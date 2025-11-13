import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === "production";

// Custom plugin to stub CSS imports since we don't actually need to process the CSS files
const cssStubPlugin = {
  name: 'css-stub',
  load(id) {
    if (id.endsWith('.css')) {
      return 'export default {}';
    }
  },
  resolveId(id) {
    if (id.endsWith('.css')) {
      return id;
    }
  }
};

export default {
  input: "src/index.ts",
  output: {
    file: "build/client.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    cssStubPlugin,  // Handle CSS imports
    resolve(),
    commonjs(),
    sucrase({
      exclude: ["node_modules/**"],
      transforms: ["typescript"],
    }),
    replace({
      // Get production-mode react
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      ),
    }),
    ...(isProd ? [terser()] : []),
  ],
};
