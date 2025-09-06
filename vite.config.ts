import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅ Use relative paths so the same build works on GitHub Pages *and* Vercel
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  build: {
    outDir: 'dist',
    // (optional) generate sourcemaps if you want easier debugging:
    // sourcemap: true,
  },
  server: {
    port: 3000,
    host: true,
  },
})