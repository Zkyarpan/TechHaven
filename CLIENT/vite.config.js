import path from "path";
import tailwindcss from "tailwindcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "tailwindcss",
      plugins: [tailwindcss()],
    },
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy all requests that start with /uploads to your backend server
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy API requests to your backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
