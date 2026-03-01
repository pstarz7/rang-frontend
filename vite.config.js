import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  // Add this to ensure Vite watches your files correctly
  server: {
    watch: {
      usePolling: true,
    },
  },
})