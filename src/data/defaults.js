// Bump whenever this file's content changes, so a browser's stale localStorage
// snapshot (saved by the admin dashboard) gets discarded instead of shadowing it.
export const CONTENT_VERSION = 5

export const defaultData = {
  hero: {
    name: "Mu'az Arief",
    title: 'CS Student · Cybersecurity & AI · University Malaya',
    bio: "I go where the ideas are moving — right now that's AI agents and security that has to survive them. I learn by building: passwordless auth with WebAuthn, agentic workflows, whatever's next after that.",
    status: 'Desktop Support Intern · iFast',
    location: 'Kajang, Selangor',
    university: 'University Malaya',
  },

  about: {
    paragraphs: [
      "Computer Science student at University Malaya, majoring in Information Systems. Passionate about cybersecurity and leveraging AI to develop secure, intelligent systems.",
      "I build full-stack applications with a focus on security and AI integration — from secure authentication systems to LangGraph-powered AI workflows. Currently interning as a Desktop Support at iFast Global Hub AI Sdn Bhd.",
      "Beyond code, I've led teams in multiple Head of Department roles across university events, managing budgets, logistics, and cross-functional coordination for hundreds of participants.",
    ],
    focus: ['Cybersecurity', 'LLM Systems', 'Agentic Workflows', 'Automation'],
    info: [
      { label: 'NAME', value: "Mu'az Arief bin Mohamad Rom" },
      { label: 'STATUS', value: 'Student · Intern' },
      { label: 'DEGREE', value: 'B.CS (Information Systems)' },
      { label: 'UNIVERSITY', value: 'University Malaya' },
      { label: 'LOCATION', value: 'Kajang, Selangor' },
      { label: 'EMAIL', value: atob('emF1bWFyaWVmMDhAZ21haWwuY29t') },
    ],
  },

  skills: [
    {
      id: 'S01', label: 'Languages', desc: 'Core syntax',
      tools: [
        { name: 'Python', level: 2 }, { name: 'JavaScript', level: 2 },
        { name: 'HTML', level: 2 }, { name: 'CSS', level: 2 },
        { name: 'Java', level: 1 },
      ],
    },
    {
      id: 'S02', label: 'Frameworks & Libraries', desc: 'Build stack',
      tools: [
        { name: 'React', level: 2 }, { name: 'Tailwind CSS', level: 2 },
        { name: 'Node.js', level: 2 }, { name: 'Vite', level: 2 },
      ],
    },
    {
      id: 'S03', label: 'AI & Prompting', desc: 'Intelligence layer',
      tools: [
        { name: 'Prompt Engineering', level: 2 }, { name: 'LangGraph', level: 1 },
        { name: 'API Integration', level: 2 }, { name: 'AI-assisted Dev', level: 2 },
      ],
    },
    {
      id: 'S04', label: 'Cybersecurity', desc: 'Security bench',
      tools: [
        { name: 'Secure Auth', level: 2 }, { name: 'Password Encryption', level: 1 },
        { name: 'Network Fundamentals', level: 1 },
      ],
    },
    {
      id: 'S05', label: 'Tools & Platforms', desc: 'Workshop gear',
      tools: [
        { name: 'Git / GitHub', level: 2 }, { name: 'Linux', level: 1 },
        { name: 'Figma', level: 2 }, { name: 'Excel', level: 2 },
        { name: 'Cloudflare', level: 1 },
      ],
    },
  ],

  projects: [
    {
      id: 'p7', name: 'Vault', status: 'Completed',
      description: 'Zero-knowledge password manager for the browser. Unlocked entirely by a hardware key, fingerprint, or device passkey via WebAuthn — no master password, no cloud, no server ever sees your data.',
      stack: ['React', 'WebAuthn', 'AES-256-GCM', 'IndexedDB'],
      github: 'https://github.com/muazrom/vault', live: null,
      image: null,
      caseStudy: {
        // 1–2 lines — render as the pull-quote at the top
        problem:
          "Password managers protect all your secrets behind... one more password — one that can be phished, keylogged, or forgotten. Cloud-based vaults add a second risk: your secrets live on someone else's server.",

        // paragraph — end on the thesis line
        idea:
          "Vault is a zero-knowledge password manager with no master password and no server. Access is bound to a hardware credential — a YubiKey, Touch ID, Face ID, or device passkey. The same WebAuthn assertion that proves who you are also produces the secret material that decrypts what you own, so authentication and key derivation are fused into a single step. Everything is encrypted and stored locally in the browser; nothing ever phones home. No credential, no key, no vault — not even partially.",

        // what Vault defends against / covers
        scope: [
          "Phishing of a master password — there is no password to phish",
          "Server-side breaches — there is no server; the vault never leaves the device",
          "Keyloggers — nothing is typed to unlock",
          "Partial vault corruption — entries are encrypted individually, so one bad entry can't break the rest",
          "Offline use — fully functional with no internet after first load",
        ],

        // what it does NOT defend against + technical limits
        constraints: [
          "Out of scope: an attacker with physical control of an already-unlocked device",
          "Out of scope: malware with memory access during an active session",
          "Assumes full-disk encryption (FileVault / BitLocker / LUKS) for physical-access threat models",
          "Losing the hardware credential can mean losing the vault — mitigated by encrypted JSON export/import",
          "Requires the WebAuthn PRF extension: Chrome/Edge 116+, Firefox 119+, Safari 17+",
        ],

        // render as the pipeline diagram, one line of 'why' per step
        workflow: [
          "Unlock request → the browser fires a WebAuthn assertion against the registered passkey or hardware key",
          "The authenticator returns the credential plus its PRF extension output — a deterministic secret that is never stored anywhere",
          "The PRF output feeds HKDF-SHA256, which derives the 256-bit vault key (in memory only, zeroed on lock or tab close)",
          "The key decrypts entries with AES-256-GCM via the browser's native WebCrypto — lazily, per entry, as they're viewed",
          "Encrypted blobs persist in IndexedDB; export produces an encrypted JSON bundle the user fully controls",
        ],

        // paragraph each: what it is → why I chose it → what I rejected
        concepts: [
          {
            name: "WebAuthn (FIDO2) + PRF extension",
            description:
              "WebAuthn normally only proves identity — it gives you a yes/no, not a secret. The PRF extension changes that: the authenticator deterministically produces the same high-entropy output for the same credential and salt, without that secret ever being stored. I chose it because it lets one hardware gesture both authenticate the user and yield key material, eliminating the master password entirely. The rejected alternative was a conventional master password with a stretched KDF — which reintroduces every weakness the project exists to remove.",
          },
          {
            name: "HKDF-SHA256 key derivation",
            description:
              "HKDF expands strong input material into a fixed-length cryptographic key. Password-based KDFs like PBKDF2 or Argon2 exist to slow brute force against low-entropy human passwords — but the PRF output is already high-entropy machine-generated secret material, so expensive stretching would add cost without adding security. HKDF is the correct tool for this input, and it ships natively in WebCrypto.",
          },
          {
            name: "AES-256-GCM, per entry",
            description:
              "GCM provides authenticated encryption — tampering with ciphertext is detected, not silently decrypted into garbage. Every vault entry is encrypted individually rather than as one blob, so a single corrupted record can't take down the whole vault and entries decrypt lazily instead of all at once. All operations use the browser's built-in WebCrypto API: no third-party crypto libraries, no supply-chain surface to audit.",
          },
          {
            name: "Zero-knowledge, offline-first architecture",
            description:
              "Plaintext never touches disk or a server: the vault key lives only in memory for the session and is zeroed when the vault locks. Storage is IndexedDB — async, structured, and far larger capacity than localStorage — and the production build is a fully static site that can be hosted anywhere, because the trust boundary is the user's own device, not my infrastructure.",
          },
        ],

        // one line, honest and forward-looking
        finished:
          "Finished — registration, unlock, encrypted CRUD, and encrypted export/import all work end-to-end.",
      },
    },
    {
      id: 'p1', name: 'Noctua', status: 'Live',
      description: 'Live demo hub where my projects actually run. Pull a project off the shelf and its demo boots right in the browser — real code, zero servers, nothing shared between visitors.',
      stack: ['JavaScript', 'HTML', 'CSS', 'Cloudflare Pages'],
      github: 'https://github.com/muazrom', live: 'https://noctua.muazrom.my',
      image: null,
      caseStudy: {
        problem:
          "A portfolio can claim anything. \"Trust me, it works\" is not proof — and asking visitors to clone a repo and run a build is not a demo.",

        idea:
          "Noctua is the proof layer for muazrom.my: a bookshelf of runnable demos. Pull a spine off the shelf and that project boots right there in the browser — real code shipped as a sandboxed static build, no backend, no state shared between visitors. Projects that need a server get their API emulated in-browser instead of proxied, so the full flow works with nothing to breach. If a project is on the shelf, you can run it — that's the bar.",

        scope: [
          "Runnable demos of real projects, booted in-browser from static builds",
          "Per-visitor isolation — every demo's data is scoped to your own browser",
          "Full CRUD flows via in-browser backend emulation (Internships Tracker's API re-served from localStorage)",
          "Real cryptography — the Vault demo runs actual WebAuthn + AES-256-GCM, not a mock",
          "Hardened delivery: strict CSP, frame ancestry locked to origin, referrers stripped",
        ],

        constraints: [
          "Server-dependent features are emulated or disabled, never proxied — no API keys ever ship to the client",
          "Live AI calls are off in the Resume Checker demo; sample analyses show the real output format instead",
          "Demos are snapshots of their projects, not auto-synced with the repos",
          "The Vault demo needs a passkey-capable device (Touch ID, Windows Hello, or a security key)",
        ],

        workflow: [
          "Visitor pulls a book off the shelf — a boot sequence plays while the demo loads",
          "The demo's static build boots inside a sandboxed iframe granted only the permissions it needs (e.g. WebAuthn for Vault)",
          "Server-backed projects run against an emulated API seeded into localStorage — same endpoints, zero servers",
          "Everything ships as static files behind strict security headers on Cloudflare Pages",
        ],

        concepts: [
          {
            name: "Static sandboxed builds",
            description:
              "Every demo is a static export running in an iframe with a minimal permission grant. I chose this because a demo hub with live backends is a fleet of servers to patch, secure, and pay for — and a breach of one demo shouldn't touch another. The rejected alternative was hosting real backends per project, which turns a proof layer into an attack surface.",
          },
          {
            name: "In-browser backend emulation",
            description:
              "The Internships Tracker demo re-implements its FastAPI surface on top of localStorage, so the untouched frontend performs real CRUD against what it thinks is a server. Every visitor gets a private dataset with a reset button. The rejected alternative was screenshots or a video — which prove nothing, because the whole point of Noctua is that you can poke at the real thing.",
          },
          {
            name: "Zero-secrets policy",
            description:
              "No credentials of any kind ship to the client. Where a project needs a paid API (Resume Checker's Gemini calls), the demo disables the live call and ships sample analyses rather than proxying through a keyed endpoint that could be farmed. A demo hub should have nothing worth stealing.",
          },
        ],

        finished:
          "Live at noctua.muazrom.my — three demos on the shelf (Vault, Internships Tracker, Resume Checker), with more added as projects mature.",
      },
    },
    {
      id: 'p8', name: 'RSVPsaf', status: 'In Development',
      description: 'Digital wedding invitation and RSVP platform built for a family walimatul urus. Guests get the full invite, itinerary, and venue details from one link, then RSVP with their headcount — backed by Supabase with a private admin dashboard.',
      stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com/muazrom', live: null,
      image: null,
      caseStudy: {
        problem:
          "A paper invite can't tell you who's actually coming. Chasing headcounts one WhatsApp reply at a time doesn't scale to a full wedding guest list.",

        idea:
          "RSVPsaf is a single-link digital invitation for a family walimatul urus. One URL carries the full invitation — opener, family introductions, itinerary, venue with map directions — and ends in an RSVP form where guests confirm attendance with adult and child headcounts and a preferred time slot. Every response lands in Supabase the moment it's submitted, and a private admin dashboard tallies them in real time. The final headcount comes from a database, not from memory.",

        scope: [
          "Complete invitation content: opener, family intro, itinerary, venue with Google Maps link",
          "RSVP capturing attendance, adults, kids, time slot, and well-wishes",
          "Real-time admin tally via Supabase's realtime subscriptions",
          "Mobile-first — guests open this from a WhatsApp message, not a desktop",
        ],

        constraints: [
          "Single-event by design: all content lives in one typed config (lib/event.ts), not a multi-tenant invite platform",
          "No guest accounts or login — any friction before the RSVP button costs responses",
          "Guest writes go through the Supabase anon key under row-level security; admin policies get locked down before launch",
          "Content freezes before send-out — the event is 16 September 2026",
        ],

        workflow: [
          "Guest opens the link and moves through animated invitation pages (Framer Motion transitions between routes)",
          "The RSVP form inserts one row into Supabase: name, attendance, adults, kids, time slot, well-wishes",
          "Supabase realtime pushes each new row to the admin dashboard as it arrives",
          "The dashboard aggregates confirmed guests by headcount and time slot — the number the caterer actually needs",
        ],

        concepts: [
          {
            name: "Supabase as the entire backend",
            description:
              "One table, row-level security policies, and realtime subscriptions — with zero server code to write or host. The event needs public inserts, live reads, and nothing else, so a hand-rolled API server would be pure overhead. The rejected alternative was a custom Next.js API over a database, which adds an ops burden to what is fundamentally one INSERT statement.",
          },
          {
            name: "Typed event config",
            description:
              "Every piece of copy — names, dates, itinerary, hashtags, the RSVP deadline — lives in a single typed lib/event.ts. Wedding content changes right up to the deadline, and none of those edits should ever touch a component. It also means the whole site could be re-skinned for another event by swapping one file.",
          },
          {
            name: "Route groups for invite vs admin",
            description:
              "The Next.js App Router splits an (invite) route group — shared background, layout, and page transitions across invitation, itinerary, RSVP, and thank-you pages — from a separate /admin route that shares none of the guest-facing chrome. Guests get an experience; the family gets a dashboard.",
          },
        ],

        finished:
          "In development — invite pages, RSVP flow, and the real-time tally work end-to-end; polish and policy hardening before the September send-out.",
      },
    },
    {
      id: 'p9', name: 'Resume Checker', status: 'Completed',
      description: 'AI-powered resume checker that scores a resume against a structured rubric, gives targeted improvement advice, and suggests career paths based on the candidate\'s actual background — not just their current job title.',
      stack: ['Next.js', 'TypeScript', 'Gemini API', 'Tailwind CSS'],
      github: 'https://github.com/muazrom', live: null,
      image: null,
      caseStudy: {
        problem:
          "Most resume tools stop at \"fix your bullet points.\" None of them ask the more useful question: what careers does this background actually position you for?",

        idea:
          "Resume Checker takes a PDF or text resume, scores it against a five-category rubric via Gemini, and returns targeted advice per category. The differentiated part is the fifth category — career narrative — which reads the trajectory across roles and feeds suggestions for career paths the candidate is plausibly positioned for, based on what they've actually done rather than what their current title says. Advice tells you how to polish the document; the career paths tell you what the document is evidence of.",

        scope: [
          "Five-category rubric scoring: impact & achievements, clarity & readability, relevance & alignment, structure & completeness, career narrative",
          "Concrete, per-category improvement advice — not generic tips",
          "Career-path suggestions inferred from background and trajectory",
          "PDF and plain-text upload, analyzed server-side",
        ],

        constraints: [
          "The rubric is a deliberate first pass, pending review by a professional resume reader",
          "Gemini calls run server-side only — the public demo on Noctua ships sample analyses instead of a live key",
          "One resume per analysis; no accounts or history yet",
          "Product-identity questions (voice, advice depth, monetization) are documented as open in the concept doc rather than guessed at",
        ],

        workflow: [
          "Resume uploaded (PDF or .txt) to the analyze API route",
          "The file plus the rubric prompt go to Gemini, with the response constrained to a strict JSON schema",
          "Structured scores, advice, and career paths come back as data — never free prose to parse",
          "ResultsView renders per-category scores and advice; the career-narrative signal drives the path suggestions",
        ],

        concepts: [
          {
            name: "Rubric as code",
            description:
              "The scoring rubric lives in lib/rubric.ts as plain data — categories, weights, and the question each one answers. Changing what gets scored is an edit to one file, not archaeology inside a prompt. The rejected alternative was burying the criteria in prompt prose, which makes the rubric impossible to review, version, or hand to the professional resume reader whose feedback it's waiting on.",
          },
          {
            name: "Strict JSON response schema",
            description:
              "Gemini's output is constrained to a defined schema of scores, advice, and career paths, so the UI renders structured data directly. The rejected alternative was letting the model write markdown and parsing it — which breaks the moment the model phrases something differently, and turns every UI feature into a regex problem.",
          },
          {
            name: "Career-path inference as the differentiator",
            description:
              "Score-only checkers are a commodity. The career-narrative category exists specifically to feed path suggestions: it evaluates whether the progression tells a coherent story, then uses that trajectory to propose directions the candidate may not have considered. That's the part a template can't do.",
          },
        ],

        finished:
          "Finished — upload, scoring, advice, and career-path suggestions work end-to-end; a sample-mode demo lives on the Noctua shelf.",
      },
    },
    {
      id: 'p10', name: 'MyFinance', status: 'Completed',
      description: 'Personal finance dashboard covering transactions, monthly commitments, investments, and a wishlist — plus a what-if planner that projects portfolio growth across multiple phases of ROI and monthly contributions.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Recharts'],
      github: 'https://github.com/muazrom', live: null,
      image: null,
      caseStudy: {
        problem:
          "Budget apps are rear-view mirrors: they show where money went. The question I actually wanted answered is where it could go.",

        idea:
          "MyFinance is a personal finance dashboard that covers the rear-view — accounts, transactions, monthly commitments, investment platforms, a wishlist — and then adds the forward view: a what-if planner where you chain phases of different ROI and monthly contribution into one compound-growth projection, charted month by month. Real plans aren't a single growth rate; an internship ends, a salary starts, a market changes. The planner models that as phases, because that's how the future actually arrives.",

        scope: [
          "Multi-account balances with full transaction tracking",
          "Monthly commitments, tracked separately from one-off spending",
          "Investment platforms recorded as invested vs. current value, so gains are legible at a glance",
          "A wishlist priced against a designated account — affordability as a fact, not a feeling",
          "Multi-phase hypothetical projections with per-phase duration, ROI, and contribution",
        ],

        constraints: [
          "Single-user personal tool — no auth, no multi-tenancy, by design",
          "State lives in a React context seeded from mock data; a persistence layer is the next step",
          "Projections are deterministic compounding, not market simulation — a planning tool, not financial advice",
          "All entry is manual; no bank integrations",
        ],

        workflow: [
          "Accounts and investment platforms are registered into a single app-wide context store",
          "Transactions, commitments, and wishlist items all write to that same store — one source of truth",
          "The overview page aggregates balances, commitments, and portfolio value into one snapshot",
          "The hypothetical planner takes an ordered list of phases (months, ROI %, monthly contribution) and compounds through them month by month",
          "Recharts renders the projection as a continuous line, so a phase change is visible as a bend in the curve",
        ],

        concepts: [
          {
            name: "Multi-phase projection engine",
            description:
              "Each phase carries its own duration, return rate, and monthly contribution, and the engine compounds through them sequentially — the output of one phase is the base of the next. I built it this way because single-rate calculators answer a question nobody's life resembles. The rejected alternative was one ROI slider over one horizon, which is simpler but models a future that doesn't exist.",
          },
          {
            name: "One context as the store",
            description:
              "All state flows through a single React context: accounts, platforms, transactions, commitments, wishlist. For a single-user dashboard, that's the entire state problem solved with zero dependencies. The rejected alternative was Redux or a store library — machinery built for problems this app doesn't have.",
          },
          {
            name: "Wishlist against a real account",
            description:
              "One account is designated the wishlist account, and wishlist items are priced against its actual balance. That turns \"can I afford this?\" from a vibe into an arithmetic answer — and it's the feature that makes the wishlist a finance tool instead of a shopping list.",
          },
        ],

        finished:
          "Finished — all six pages work end-to-end on the context store; persistence is the next layer.",
      },
    },
    {
      id: 'p6', name: 'Manga Tracker', status: 'Completed',
      description: 'Cross-platform Flutter app to track manga, manhwa & manhua reading progress, with an in-app reader powered by the comick.io API.',
      stack: ['Flutter', 'Dart', 'comick.io API'],
      github: 'https://github.com/muazrom/manga-tracker', live: null,
      image: null,
      caseStudy: {
        problem:
          "Tracking in one app and reading in another means progress is always out of sync — and \"did a new chapter drop?\" means going to check a website.",

        idea:
          "Manga Tracker is a Flutter app that puts the library and the reader in the same place. Titles live in a local library with reading status, star ratings, and genre tags; linking a title to comick.io unlocks the full chapter list, automatic new-chapter detection, and an in-app vertical-scroll reader. Because reading happens inside the tracker, finishing a chapter updates progress automatically — sync stops being a chore because there's nothing to sync.",

        scope: [
          "Library grid with cover art, chapter progress, and status indicators",
          "Five reading statuses: Reading, Completed, On Hold, Dropped, Plan to Read",
          "Star ratings, genre tags, favorites, and a stats tab (titles, chapters read, completion rate)",
          "Automatic update detection — a NEW badge when a linked title drops a chapter",
          "In-app reader: vertical scroll, page slider, full-screen immersive mode",
        ],

        constraints: [
          "Depends on the unofficial comick.io API — enrichment can break without notice, so the tracker must survive without it",
          "Storage is local Hive only; no cloud sync or multi-device yet",
          "Tracking works offline, but reading and update checks need a connection",
          "Built and tested on Android; other Flutter targets are untested",
        ],

        workflow: [
          "A title is added to the library and persisted as a Hive record",
          "Linking it to comick.io (via search) attaches metadata and the chapter catalogue",
          "The provider fetches chapter lists and diffs against last-read position — new chapters surface as a NEW badge",
          "The reader streams pages from the API and marks chapters read as they're finished",
          "Progress writes back to the same Hive record the library grid reads — one record, always in sync",
        ],

        concepts: [
          {
            name: "Hive local database",
            description:
              "Hive stores each title as a typed object via generated adapters — fast, offline, and zero setup on device. A manga library is a collection of documents, not a web of relations, so I rejected SQLite: rows and joins would add schema ceremony to data that is naturally one object per title.",
          },
          {
            name: "Provider-based state",
            description:
              "A single provider owns the library and all comick.io calls, so the grid, detail pages, and reader all observe one source of truth. For an app this size, Provider is the boring, correct choice — heavier state machinery was rejected as solving problems the app doesn't have.",
          },
          {
            name: "Tracker-first, API-linked design",
            description:
              "comick.io is enrichment, not foundation: every tracking feature works for a title that was never linked. That boundary was deliberate — the app depends on an unofficial API, and if it disappears tomorrow, the reader dies but the library and all its progress survive.",
          },
        ],

        finished:
          "Finished — tracking, update detection, and the in-app reader all work end-to-end; cloud sync is the obvious next step.",
      },
    },
    {
      id: 'p5', name: 'Internships Tracker', status: 'Completed',
      description: 'A personal web app to track and manage internship applications through the recruitment process. Separated client-server architecture with a Python backend and vanilla JS/HTML/CSS frontend.',
      stack: ['Python', 'JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/muazrom/Internships-Tracker', live: null,
      image: null,
      caseStudy: {
        problem:
          "A spreadsheet tracks applications right up until the tab closes or a follow-up date quietly slips past. Recruitment is a pipeline — it needs a board, not a grid.",

        idea:
          "Internships Tracker is a kanban board for the application season: every application is a card, and cards drag between Wishlist, Applied, Interview, Offer, and Rejected as things progress. A FastAPI + SQLite backend persists everything; the frontend is deliberately vanilla JavaScript — no framework — because I wanted to feel the problems React solves before leaning on it. The pipeline became something I could see, and the framework became a choice instead of a default.",

        scope: [
          "Full CRUD on applications with persistent SQLite storage",
          "Drag-and-drop stage changes across the five pipeline columns",
          "Clean separation: a JSON API backend, a static frontend, nothing shared but HTTP",
        ],

        constraints: [
          "Single-user personal tool — no auth or multi-user support",
          "Vanilla JS was a learning constraint chosen up front, not a limitation discovered too late",
          "No reminders or notifications — deadlines are visible on cards, not pushed",
        ],

        workflow: [
          "The frontend talks to a FastAPI JSON API for every operation",
          "Creates, edits, and deletes persist to SQLite — status survives any closed tab",
          "Dropping a card on a new column updates its stage through the same API",
          "The board re-renders from state, so the pipeline on screen always matches the database",
        ],

        concepts: [
          {
            name: "FastAPI + SQLite backend",
            description:
              "FastAPI gives a typed, self-documenting JSON API in very little code, and SQLite is a single file with zero setup — the right weight for a single-user tool. The rejected alternative was a heavier stack with an ORM and a database server, which would have tripled the moving parts to store what is essentially one table.",
          },
          {
            name: "Vanilla JS by choice",
            description:
              "The frontend is hand-rolled DOM manipulation, event handling, and fetch calls. That was the point: after building it, re-render bugs and state-sync pain aren't abstract complaints about jQuery-era code — they're problems I've had, which is exactly the context that makes React's model make sense. The rejected alternative was starting with a framework and never learning what it was for.",
          },
          {
            name: "An API small enough to emulate",
            description:
              "Because the API surface is small and clean, the Noctua demo re-implements it entirely in-browser over localStorage — the unmodified frontend runs its full CRUD flow with zero servers. A tidy interface turned out to be the feature that made the project demoable.",
          },
        ],

        finished:
          "Finished — carried me through a real application season; the browser-emulated demo runs on the Noctua shelf.",
      },
    },
    {
      id: 'p4', name: 'Digital Portfolio', status: 'Live',
      description: 'This site — a personal dashboard-style portfolio themed as a digital workshop. Built with React + Vite, deployed on Cloudflare Pages with a custom domain.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
      github: 'https://github.com/muazrom/Digital_Portfolio', live: 'https://muazrom.my',
      image: null,
      caseStudy: {
        problem:
          "A portfolio you dread editing goes stale. If updating a project means rewriting JSX, the updates stop happening — and a stale portfolio is worse than none.",

        idea:
          "This site. It began as a static single-page resume and was rebuilt into a React + Vite app where every section — hero, about, skills, projects, badges, experience, including the case study you're reading — renders from a single content module. An in-browser admin editor layers edits on top via localStorage, and a version gate makes sure content shipped in code always beats a stale local snapshot. Content is data, so an update is an edit, not a rewrite.",

        scope: [
          "Fully data-driven sections rendered from one content file through a shared context",
          "A structured case-study format (this layout) alongside simple text ones",
          "In-browser admin editing persisted to localStorage, merged field-by-field over defaults",
          "Static deploy: push to main, Cloudflare Pages builds and ships to muazrom.my",
        ],

        constraints: [
          "Admin edits live in that browser's localStorage — device-local by design, not a CMS",
          "Bumping the content version discards stored snapshots; a deliberate trade so shipped content always wins",
          "Fully static — no backend, so contact is direct channels rather than a form",
        ],

        workflow: [
          "All content lives in one defaults module with a version number",
          "On load, the data context checks the stored version — a stale snapshot is discarded instead of shadowing new content",
          "Surviving stored edits merge over defaults field-by-field, so new fields added in code aren't erased by old snapshots",
          "Every section renders purely from context — no component owns any copy",
          "A push to main triggers the Cloudflare Pages build and deploy",
        ],

        concepts: [
          {
            name: "One content module, presentational components",
            description:
              "Every word on this site lives in a single data file; components only decide how things look. Updating a project, adding a badge, or rewriting the bio never touches a component. The rejected alternative was the original version of this site — copy hardcoded in markup, where every content change was a code change and therefore didn't happen.",
          },
          {
            name: "Field-level merge behind a version gate",
            description:
              "Stored edits merge over defaults per-field, so a snapshot saved before a new field existed can't erase it. The version gate handles the harder case: when shipped content genuinely changes, the bump invalidates old snapshots entirely. That gate exists because of a real bug — stale localStorage silently shadowing content updates shipped in code.",
          },
          {
            name: "localStorage admin instead of a CMS",
            description:
              "The admin editor writes to the browser, not a server — zero infrastructure, zero auth surface, and the trust boundary is my own machine. The rejected alternative was a headless CMS, which adds an account, an API, and a monthly dependency to a site maintained by exactly one person.",
          },
        ],

        finished:
          "Live at muazrom.my — continuously updated; this structured case-study format was the latest addition.",
      },
    },
  ],

  // tier: 1 = exam-based professional cert · 2 = course-completion badge · 3 = learning badge · 'award' = award (no rank)
  // image: path under /public for the back-of-card picture (e.g. '/badges/cisco.png'), or null
  badges: [
    {
      id: 'b2',
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      date: '2026',
      category: 'Course',
      tier: 2,
      image: '/badges/cisco-intro-cybersecurity.png',
      credential: 'https://www.credly.com/badges/93dd6936-bea6-48ae-9311-30c16399e323/public_url',
    },
    {
      id: 'b3',
      name: 'Pre Security Learning Path',
      issuer: 'TryHackMe',
      date: 'Jun 2026',
      category: 'Certificate',
      tier: 2,
      image: '/badges/tryhackme-pre-security.png',
      credential: '/badges/tryhackme-pre-security.pdf',
    },
    {
      id: 'b1',
      name: 'Pitram Silver Award',
      issuer: 'Pitram',
      date: '2024',
      category: 'Award',
      tier: 'award',
      image: null,
      credential: null,
    },
  ],

  experience: [
    {
      id: 'e8', role: 'Desktop Support Intern', org: 'iFast Global Hub AI Sdn Bhd', period: 'Jul 2026 – Present',
      summary: 'Providing desktop support for internal users at iFast Global Hub AI, covering hardware and software troubleshooting, system maintenance, and IT assistance across the organisation.',
      featured: true,
    },
    {
      id: 'e1', role: 'Vice Secretary', org: 'Warisan Run', period: 'May 2026',
      summary: 'Handled administrative tasks including documentation, planning, and resolving internal problems for an event involving 260 participants and 48 committee members.',
    },
    {
      id: 'e2', role: 'Head of Logistics & Technical', org: 'Jelajah Nusantara International Mobility Programme', period: 'Nov 2025',
      summary: "Led technical and logistics operations for the university's international mobility programme to Indonesia. Coordinated equipment, transportation, and technical requirements across international borders.",
      featured: true,
    },
    {
      id: 'e3', role: 'Head of Dept & Scenographer', org: 'Pentaz Production — Karnival Teater UM', period: 'Apr 2025 & 2026',
      summary: 'Designed and led full stage sets and props for Karnival Teater Universiti Malaya for two consecutive years. Managed production budget and team coordination — received acknowledgement from the panel of jury.',
      featured: true,
    },
    {
      id: 'e4', role: 'Head of Department', org: 'Minggu Haluan Siswa KK10', period: 'Oct 2025',
      summary: 'Managed technical setup and equipment for the university orientation programme serving 300 new students and 50 committee members. Ensured seamless execution of all technical operations.',
      featured: true,
    },
    {
      id: 'e7', role: 'Director', org: 'Dayasari Goes Green', period: 'Feb 2024',
      summary: 'Directed a recycling awareness programme organised by one of the residential colleges at University Malaya. Led the committee in planning and executing activities centred around sustainability and environmental responsibility.',
      featured: true,
    },
    {
      id: 'e6', role: 'Head of Logistics & Technical', org: 'Tazcup', period: '2025',
      summary: 'Managed logistics and technical operations for Tazcup, a futsal tournament open to University Malaya students and the surrounding community. Coordinated equipment, venue setup, and ensured smooth technical execution throughout the event.',
    },
    {
      id: 'e5', role: 'Assistant', org: 'Perisian Huda Sdn Bhd', period: 'Apr 2023',
      summary: 'Assisted in collecting natural data for machine learning and developing the "Mushafi" app. Served as a beta tester and provided user feedback that directly shaped the product.',
      featured: true,
    },
  ],
}
