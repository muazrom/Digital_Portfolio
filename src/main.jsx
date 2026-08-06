// Deploy note: Cloudflare Pages has no atomic swap, so during the upload window a
// request for a not-yet-present asset is answered by the SPA fallback with
// index.html at status 200. Never mark /assets/* immutable in assets/_headers —
// doing so pins that HTML to the asset URL in the edge cache. See that file.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'

// Also makes the running build identifiable from devtools when diagnosing a
// stale-asset report: document.documentElement.dataset.build
document.documentElement.dataset.build = __BUILD_ID__

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
