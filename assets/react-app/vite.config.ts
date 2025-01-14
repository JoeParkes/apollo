import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // This will be the output directory for the build
    rollupOptions: {
      input: 'index.html', // Main entry file for Vite
    },
  },
  plugins: [react()],
});
