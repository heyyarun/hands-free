import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // getUserMedia needs a secure context. localhost counts as one, so plain
    // http://localhost:5173 is fine for local dev; only remote hosts need TLS.
    host: 'localhost',
    port: 5173,
  },
  build: {
    target: 'es2022',
    // No manual chunks: App and Game are lazy (see main.tsx), so three.js and MediaPipe
    // land in chunks only those pages import, and the landing a phone gets needs neither.
    // A manualChunks rule for them also captured Vite's dynamic-import helper, which made
    // the entry preload all of MediaPipe.
  },
})
