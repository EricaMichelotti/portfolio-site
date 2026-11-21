import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/portfolio-site/ on GitHub Pages
  base: '/portfolio-site/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'vendor', test: /node_modules/ }],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
