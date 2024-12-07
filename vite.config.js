import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],  // Empty array means don't externalize any dependencies
    },
  },
  optimizeDeps: {
    include: ['recharts']  // Explicitly include recharts
  }
})