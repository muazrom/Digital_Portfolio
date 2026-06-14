# muazrom.my — Personal Digital Workshop

Personal portfolio site for Mu'az Arief. Built with a dark monochrome + electric blue "workshop" aesthetic. Fully editable through a hidden admin panel — no backend, no database.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + inline styles |
| Fonts | Space Grotesk · Inter · JetBrains Mono |
| Persistence | `localStorage` |
| Auth | SHA-256 via Web Crypto API |
| Deployment | Cloudflare Pages |

---

## Sections

| # | Section | Design |
|---|---|---|
| 01 | **Hero** | Centered monolith — gradient name, floating stat pills, rule line |
| 02 | **About** | Terminal / blueprint panel with shell commands and sysinfo table |
| 03 | **Skills** | Pegboard — tools hang from pegs with proficiency dots |
| 04 | **Projects** | 3D coverflow carousel — scroll, swipe, or arrow keys |
| 05 | **Experience** | Rotating SVG ring — active node locks to 12 o'clock |
| 06 | **Badges** | Credential tag cards — lanyard hole, category seal, verified tick |
| 07 | **Contact** | Transmission panel — frequency channels + compose console |

---

## Admin Panel

All content is editable in-browser. Nothing is stored server-side.

**Access:** Type `#admin` anywhere on the page (not inside an input field). Password prompt always appears — no session carry-over.

**Default password:** `workshop2026`

**Editable sections:** Hero · Skills · Projects · Experience · Badges & Certs · Settings (password change, reset to defaults)

> To change the password, go to Admin → Settings → Change Password. The hash is stored in `localStorage` under `admin_pw_hash`.

---

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5174` (or next available port if 5173 is taken).

---

## Build & Deploy

```bash
npm run build   # outputs to /dist
```

Deployed on **Cloudflare Pages**:
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required

---

## Project Structure

```
src/
├── components/          # All public-facing sections
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Experience.jsx
│   ├── Badges.jsx
│   ├── Contact.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── SectionDivider.jsx
├── admin/               # Admin panel + auth
│   ├── auth.js          # SHA-256 password hashing
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│   └── editors/         # Per-section content editors
├── context/
│   └── DataContext.jsx  # Global state + localStorage persistence
├── data/
│   └── defaults.js      # Default content (source of truth)
├── hooks/
│   └── useScrollReveal.js
└── styles/
    └── globals.css
```

---

## Data Persistence

All content lives in `localStorage` under the key `portfolio_data`. On load, stored data is merged with `defaults.js` so new sections always appear even with old cached data:

```js
const merged = { ...defaultData, ...stored }
```

To reset all content: Admin → Settings → Reset to Defaults.

---

## Resume

Place `resume.pdf` in the `/public` folder. It's served at `/resume.pdf` and linked from the navbar.
