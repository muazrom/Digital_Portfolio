# muazrom.my — Personal Digital Workshop

Personal portfolio site for Mu'az Arief, presented as a network operations console — status bar, device tree, panel grid. Fully editable through a hidden admin panel — no backend, no database.

**Every number on the site is derived from real content** (`src/data/defaults.js` and `src/content/writeups/index.js`) via `src/lib/metrics.js`. No invented traffic graphs or alert counts: the nav badges, panel header readouts, and Overview KPIs all call the same functions, so a header can't claim a count the rows underneath don't back up.

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

## Layout

The shell is `src/components/console/`:

| Piece | Role |
|---|---|
| `ConsoleShell` | Frame — status strip, device tree, panel column |
| `StatusBar` | Hostname, current status, session uptime, live clock |
| `NavRail` | Section tree with count badges; scroll-spy + the `#admin` keystroke. Becomes a bottom tab bar under 900px |
| `Panel` | The one chassis every section renders inside — owns the anchor id, number, icon, title, and meta readout |
| `Overview` | Panel 01 — identity, KPI row, credential and write-up breakdowns |
| `widgets.jsx` | `Metric`, `Meter`, `StackBar`, `SeverityDot`, `Chip`, `Field` |

Panel order, numbering, anchors, labels, and icons all come from `src/sections.js` — the single place to change them.

| # | Panel | Design |
|---|---|---|
| 01 | **Overview** | Identity block, five KPIs, credentials-by-kind bar, write-ups by course |
| 02 | **About** | Terminal / blueprint panel with shell commands and sysinfo table |
| 03 | **Skills** | Pegboard — tools hang from pegs with proficiency dots |
| 04 | **Credentials** | Rack units — lanyard seal, category tag, verification LED |
| 05 | **Field Notes** | Event log — dated rows, newest first, source and read time |
| 06 | **Experience** | Two timeline rails, technical and leadership |
| 07 | **Projects** | Inventory table with status chips; case study expands inline |
| 08 | **Contact** | Channel cards + a compose panel that hands off to the visitor's mail client |

## Admin Panel

All content is editable in-browser. Nothing is stored server-side.

**Access:** Type `#admin` anywhere on the page (not inside an input field). Password prompt always appears — no session carry-over.

**Default password:** `workshop2026`

**Editable sections:** Hero · Skills · Projects · Experience · Credentials · Settings (password change, reset to defaults)

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
├── sections.js          # Panel order, numbers, anchors, labels, icons
├── components/
│   ├── console/         # The console shell
│   │   ├── ConsoleShell.jsx
│   │   ├── StatusBar.jsx
│   │   ├── NavRail.jsx
│   │   ├── Panel.jsx
│   │   ├── Overview.jsx
│   │   ├── TerminalButton.jsx
│   │   └── widgets.jsx
│   ├── About.jsx        # Panel contents
│   ├── Skills.jsx
│   ├── Credentials.jsx
│   ├── FieldNotes.jsx
│   ├── Experience.jsx
│   ├── Projects.jsx
│   ├── CaseStudy.jsx    # Case study body, opened from the Projects table
│   ├── Contact.jsx
│   ├── CountUp.jsx
│   ├── Icon.jsx
│   └── Footer.jsx
├── lib/
│   ├── metrics.js       # Every displayed number is derived here
│   └── markdown.js
├── admin/               # Admin panel + auth
│   ├── auth.js          # SHA-256 password hashing
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│   └── editors/         # Per-section content editors
├── content/writeups/    # Git-authored write-ups (outside DataContext)
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
