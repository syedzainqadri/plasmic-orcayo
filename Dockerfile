# Use a compatible Node version for the dependencies
FROM node:20-alpine

# Install bash and other required tools
RUN apk add --no-cache bash curl python3 make g++

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install global dependencies
RUN npm install -g concurrently

# Set environment variables
ENV NODE_ENV=production

# Install dependencies
RUN cd platform/wab && yarn install --frozen-lockfile

# Build the application
RUN cd platform/wab && yarn build

# Install dependencies for all platform packages
RUN cd platform/sub && yarn install && yarn build
RUN cd platform/live-frame && yarn install && yarn build
RUN cd platform/react-web-bundle && yarn install && yarn build
RUN cd platform/canvas-packages && yarn install && yarn build
RUN cd platform/loader-html-hydrate && yarn install && yarn build

# Expose the port that Vercel will use
EXPOSE $PORT

# Create a startup script
RUN echo '#!/bin/bash\n\
cd platform/wab && \\\n\
echo "Starting Plasmic application..." && \\\n\
\n\
# Use Vercel-provided PORT or default to 3000\n\
export PORT=${PORT:-3000} && \\\n\
export BACKEND_PORT=3004 && \\\n\
\n\
# Start backend service in the background\n\
echo "Starting backend on port $BACKEND_PORT..." && \\\n\
BACKEND_PORT=$BACKEND_PORT REACT_APP_DEV_PROXY="http://localhost:$PORT" yarn backend & \\\n\
\n\
# Start host server in the background\n\
echo "Starting host server on port 3005..." && \\\n\
HOSTSERVER_PORT=3005 yarn host-server & \\\n\
\n\
# Wait a bit for services to start\n\
sleep 5 && \\\n\
\n\
# Start the main frontend service on Vercel port\n\
echo "Starting frontend on port $PORT..." && \\\n\
exec yarn start' > /app/start.sh

RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]