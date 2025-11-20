import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { GoogleMapsPlugin } from '../vite-plugin-google-maps-main/dist/index';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), GoogleMapsPlugin({
      apiKey: 'AIzaSyCaEs0feZBkg6knGzrXrVTThUKWcCZhdSc',
      libraries: ['places', 'marker'],
      debug: true, // Enable dev tools
      mapDefaults: {
        gestureHandling: 'greedy',
        defaultCenter: { lat: 40.7128, lng: -74.0060 },
        defaultZoom: 12,
        fullscreenControl: true,
        disableDefaultUI: false,
      }
    }),],
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
