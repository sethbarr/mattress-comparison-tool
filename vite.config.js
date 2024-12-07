import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Ensure `@` points to the `src` folder
    },
  },
  build: {
    rollupOptions: {
      // Do not include 'external' unless explicitly needed
    },
  },
});
