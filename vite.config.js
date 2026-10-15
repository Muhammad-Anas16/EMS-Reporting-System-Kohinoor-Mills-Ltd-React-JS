// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import path from "path";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(import.meta.dirname, "./src"),
//     },
//   },

// });

// ===========================================================
// ===========================================================
// ===========================================================

// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import path from "path";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],

//   resolve: {
//     alias: {
//       "@": path.resolve(import.meta.dirname, "./src"),
//     },
//   },

//   // Production build goes into the Express server's public folder.
//   build: {
//     outDir: "../server/public",
//     emptyOutDir: true,
//   },

//   // Development mode only.
//   server: {
//     host: "0.0.0.0",
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:3000",
//         changeOrigin: true,
//       },
//     },
//   },
// });

// ===========================================================
// ===========================================================
// ===========================================================

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },

  // npm run build -> ../server/public
  build: {
    outDir: path.resolve(import.meta.dirname, "../server/public"),
    emptyOutDir: true,
  },

  // Development mode only
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
});
