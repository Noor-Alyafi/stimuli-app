import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'client',            // index.html is in /client
  plugins: [react()],
  base: './',                // relative paths → works everywhere
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  build: {
    outDir: 'dist',          // final build goes to client/dist
    // sourcemap: true,      // (optional) turn on if you need to debug
  },
  server: { port: 3000, host: true },
})
