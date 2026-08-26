import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import content from './vite/content.js'

export default defineConfig({
  plugins: [react(), content()],
  publicDir: 'assets',
  // Stamped into the bundle so every deploy produces a new content hash, and
  // therefore an asset URL that has never been requested before.
  //
  // This exists because Cloudflare Pages has no atomic swap: during the upload
  // window a request for a not-yet-present asset is answered by the SPA fallback
  // with index.html at status 200. If that response gets cached against the
  // asset's URL, every visitor is served HTML where a module belongs and the
  // page renders blank — which happened. A fresh hash per deploy means a
  // poisoned entry can never be reused by the next release.
  define: {
    __BUILD_ID__: JSON.stringify(new Date().toISOString().replace(/\D/g, '').slice(0, 14)),
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5174,
  },
})
