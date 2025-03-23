
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";  // Using plugin-react which is compatible with Vite 6
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Set base to relative path for GitHub Pages
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Explicitly configure HMR
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
    },
  },
  define: {
    // Define the missing WebSocket token
    __WS_TOKEN__: JSON.stringify("development-ws-token"),
  },
  build: {
    outDir: "docs", // Set output directory to "docs" for GitHub Pages
  },
  plugins: [
    react(),  // Using standard React plugin instead of SWC
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
