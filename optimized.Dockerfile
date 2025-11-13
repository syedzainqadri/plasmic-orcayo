# Optimized multi-stage Dockerfile for Plasmic application
# This file focuses on the essential build steps and addresses the live-frame issue

# === Build Stage ===
FROM node:22-alpine AS builder

# Install necessary system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    python3 \
    py3-pip \
    postgresql-client \
    build-base \
    g++ \
    make \
    jq

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy platform/wab package files and install
COPY platform/wab/package.json platform/wab/yarn.lock ./platform/wab/
RUN cd platform/wab && yarn install --frozen-lockfile --network-timeout 100000

# Copy all application files
COPY . .

# Install all other platform dependencies and build components
RUN cd platform/sub && yarn install --frozen-lockfile --network-timeout 100000 && yarn build
RUN cd platform/react-web-bundle && yarn install --frozen-lockfile --network-timeout 100000 && yarn build

# Apply our fix for the live-frame build issue by creating a working rollup.config.js
RUN echo "import sucrase from \"@rollup/plugin-sucrase\";" > platform/live-frame/rollup.config.js && \
    echo "import resolve from \"@rollup/plugin-node-resolve\";" >> platform/live-frame/rollup.config.js && \
    echo "import commonjs from \"@rollup/plugin-commonjs\";" >> platform/live-frame/rollup.config.js && \
    echo "import replace from \"@rollup/plugin-replace\";" >> platform/live-frame/rollup.config.js && \
    echo "import { terser } from \"rollup-plugin-terser\";" >> platform/live-frame/rollup.config.js && \
    echo "" >> platform/live-frame/rollup.config.js && \
    echo "const isProd = process.env.NODE_ENV === \"production\";" >> platform/live-frame/rollup.config.js && \
    echo "" >> platform/live-frame/rollup.config.js && \
    echo "// Custom plugin to stub CSS imports" >> platform/live-frame/rollup.config.js && \
    echo "const cssStubPlugin = {" >> platform/live-frame/rollup.config.js && \
    echo "  name: 'css-stub'," >> platform/live-frame/rollup.config.js && \
    echo "  load(id) {" >> platform/live-frame/rollup.config.js && \
    echo "    if (id.endsWith('.css')) {" >> platform/live-frame/rollup.config.js && \
    echo "      return 'export default {}';" >> platform/live-frame/rollup.config.js && \
    echo "    }" >> platform/live-frame/rollup.config.js && \
    echo "  }," >> platform/live-frame/rollup.config.js && \
    echo "  resolveId(id) {" >> platform/live-frame/rollup.config.js && \
    echo "    if (id.endsWith('.css')) {" >> platform/live-frame/rollup.config.js && \
    echo "      return id;" >> platform/live-frame/rollup.config.js && \
    echo "    }" >> platform/live-frame/rollup.config.js && \
    echo "  }" >> platform/live-frame/rollup.config.js && \
    echo "};" >> platform/live-frame/rollup.config.js && \
    echo "" >> platform/live-frame/rollup.config.js && \
    echo "export default {" >> platform/live-frame/rollup.config.js && \
    echo "  input: \"src/index.ts\"," >> platform/live-frame/rollup.config.js && \
    echo "  output: {" >> platform/live-frame/rollup.config.js && \
    echo "    file: \"build/client.js\"," >> platform/live-frame/rollup.config.js && \
    echo "    format: \"iife\"," >> platform/live-frame/rollup.config.js && \
    echo "    sourcemap: true," >> platform/live-frame/rollup.config.js && \
    echo "  }," >> platform/live-frame/rollup.config.js && \
    echo "  plugins: [" >> platform/live-frame/rollup.config.js && \
    echo "    cssStubPlugin,  // Handle CSS imports" >> platform/live-frame/rollup.config.js && \
    echo "    resolve()," >> platform/live-frame/rollup.config.js && \
    echo "    commonjs()," >> platform/live-frame/rollup.config.js && \
    echo "    sucrase({" >> platform/live-frame/rollup.config.js && \
    echo "      exclude: [\"node_modules/**\"]," >> platform/live-frame/rollup.config.js && \
    echo "      transforms: [\"typescript\"]," >> platform/live-frame/rollup.config.js && \
    echo "    })," >> platform/live-frame/rollup.config.js && \
    echo "    replace({" >> platform/live-frame/rollup.config.js && \
    echo "      // Get production-mode react" >> platform/live-frame/rollup.config.js && \
    echo "      \"process.env.NODE_ENV\": JSON.stringify(" >> platform/live-frame/rollup.config.js && \
    echo "        isProd ? \"production\" : \"development\"" >> platform/live-frame/rollup.config.js && \
    echo "      )," >> platform/live-frame/rollup.config.js && \
    echo "    })," >> platform/live-frame/rollup.config.js && \
    echo "    ...(isProd ? [terser()] : [])," >> platform/live-frame/rollup.config.js && \
    echo "  ]," >> platform/live-frame/rollup.config.js && \
    echo "};" >> platform/live-frame/rollup.config.js

# Build live-frame after our fix
RUN cd platform/live-frame && yarn install --frozen-lockfile --network-timeout 100000 && yarn build

RUN cd platform/loader-bundle-env && yarn install --frozen-lockfile --network-timeout 100000 && yarn build
RUN cd platform/loader-html-hydrate && yarn install --frozen-lockfile --network-timeout 100000 && yarn build

# Build canvas packages
RUN cd platform/canvas-packages && \
    for d in internal_pkgs/*; do \
        if [ -d "$d" ]; then \
            cd $d && yarn install --frozen-lockfile --network-timeout 100000 && yarn build && cd -; \
        fi \
    done && \
    yarn install --frozen-lockfile --network-timeout 100000 && yarn build

# Run setup for wab to ensure all dependencies are ready
RUN cd platform/wab && \
    mkdir -p build dev-build && \
    yarn cache clean

# === Production Stage ===
FROM node:22-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    bash \
    curl \
    postgresql-client \
    dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S plasmic -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=plasmic:nodejs /app /app

# Change ownership to non-root user
USER plasmic

# Expose ports
EXPOSE 3003 3004 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3004/api/health || exit 1

# Use dumb-init to handle PID 1 properly
ENTRYPOINT ["dumb-init", "--"]

# Default command to start the application
CMD ["sh", "-c", "cd /app/platform/wab && yarn backend"]