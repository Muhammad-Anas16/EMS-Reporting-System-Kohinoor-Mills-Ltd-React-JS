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

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://localhost:3000",
        target: "http://100.70.197.124:3000",
        changeOrigin: true,
      },
    },
  },
});
