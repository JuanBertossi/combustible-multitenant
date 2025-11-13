import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "mui-core": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "mui-icons": ["@mui/icons-material"],
          charts: ["recharts"],
          utils: ["date-fns", "axios", "xlsx"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
