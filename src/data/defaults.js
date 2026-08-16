// Bump whenever this file's content changes, so a browser's stale localStorage
// snapshot (saved by the admin dashboard) gets discarded instead of shadowing it.
export const CONTENT_VERSION = 13

export const defaultData = {
  hero: {
    name: "Mu'az Arief",
    // NOTE: Hero.jsx splits this on the literal ' · ' — keep exactly three segments.
    title: 'CS Student · Networking & Security · University Malaya',
    bio: "I'm heading for network security — the infrastructure layer everything else quietly sits on, and the one nobody looks at until it breaks. Right now that means desktop support at iFast, studying toward CCNA, and publishing what I learn as I go.",
    status: 'Desktop Support Intern · iFast',
    location: 'Kajang, Selangor',
    university: 'University Malaya',
  },

  about: {
    paragraphs: [
      "Computer Science student at University Malaya, majoring in Information Systems, working toward a career in network security. I'm drawn to the infrastructure layer — the routing, segmentation, and access control that every application depends on and mostly takes for granted.",
      "I'm learning in public. That means studying toward CCNA, working through networking and security coursework, and writing up what I actually learn instead of only collecting completion badges. My internship at iFast Global Hub AI is my first real exposure to production infrastructure — endpoints, directory services, and the escalation path to the teams who own the network.",
      "Beyond the technical side, I've held multiple Head of Department roles across university events, managing budgets, logistics, and cross-functional coordination for hundreds of participants.",
    ],
    focus: ['Network Security', 'Infrastructure', 'Firewalls & Segmentation', 'Automation'],
    info: [
      { label: 'NAME', value: "Mu'az Arief bin Mohamad Rom" },
      { label: 'STATUS', value: 'Student · Intern' },
      { label: 'DEGREE', value: 'B.CS (Information Systems)' },
      { label: 'UNIVERSITY', value: 'University Malaya' },
      { label: 'LOCATION', value: 'Kajang, Selangor' },
      { label: 'EMAIL', value: atob('emF1bWFyaWVmMDhAZ21haWwuY29t') },
    ],
  },

  // Honesty rule for this board: only list what survives two minutes of interview
  // questioning. level 1 = Basic, 2 = Proficient, 3 = Strong. Things being aimed at
  // rather than held belong in the hero bio as prose, not on this board.
  skills: [
    {
      id: 'S01', label: 'Networking', icon: 'network', desc: 'Packets & paths',
      tools: [
        { name: 'Subnetting & IP Addressing', icon: 'network', level: 2 }, { name: 'DNS & DHCP', icon: 'globe', level: 2 },
        { name: 'NAT', icon: 'router', level: 2 }, { name: 'ARP & Broadcast Domains', icon: 'switch', level: 2 },
        { name: 'TCP/IP', icon: 'network', level: 1 }, { name: 'Routing & Switching', icon: 'router', level: 1 },
      ],
    },
    {
      id: 'S02', label: 'Labs & Diagnostics', icon: 'flask', desc: 'Proving it works',
      tools: [
        { name: 'Cisco Packet Tracer', icon: 'flask', level: 2 }, { name: 'ping / tracert', icon: 'pulse', level: 2 },
        { name: 'ipconfig', icon: 'terminal', level: 2 }, { name: 'Packet Inspection', icon: 'search', level: 1 },
      ],
    },
    {
      id: 'S03', label: 'Systems & Infrastructure', icon: 'server', desc: 'The layer underneath',
      tools: [
        { name: 'Windows / Active Directory', icon: 'windows', level: 2 }, { name: 'Endpoint Support', icon: 'monitor', level: 2 },
        { name: 'Hardware Troubleshooting', icon: 'chip', level: 2 }, { name: 'Linux', icon: 'terminal', level: 1 },
      ],
    },
    {
      id: 'S04', label: 'Security', icon: 'shield', desc: 'Security bench',
      tools: [
        { name: 'Secure Auth', icon: 'key', level: 2 }, { name: 'Encryption Fundamentals', icon: 'lock', level: 2 },
        { name: 'SSH vs Telnet', icon: 'shield', level: 2 }, { name: 'Network Segmentation', icon: 'switch', level: 1 },
        { name: 'Threat Fundamentals', icon: 'shield', level: 1 },
      ],
    },
    {
      id: 'S05', label: 'Development & Automation', icon: 'code', desc: 'Making it repeatable',
      tools: [
        { name: 'Python', icon: 'code', level: 2 }, { name: 'JavaScript', icon: 'code', level: 2 },
        { name: 'React', icon: 'code', level: 2 }, { name: 'API Integration', icon: 'external', level: 2 },
        { name: 'Bash', icon: 'terminal', level: 1 },
      ],
    },
    {
      id: 'S06', label: 'Tools & Platforms', icon: 'wrench', desc: 'Workshop gear',
      tools: [
        { name: 'Git / GitHub', icon: 'gitBranch', level: 2 }, { name: 'Cloudflare', icon: 'cloud', level: 1 },
        { name: 'Figma', icon: 'palette', level: 2 }, { name: 'Excel', icon: 'spreadsheet', level: 2 },
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
          "Full CRUD flows via in-browser backend emulation — a server-backed project's API re-served from localStorage",
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
              "One demo re-implements its FastAPI surface on top of localStorage, so the untouched frontend performs real CRUD against what it thinks is a server. Every visitor gets a private dataset with a reset button. The rejected alternative was screenshots or a video — which prove nothing, because the whole point of Noctua is that you can poke at the real thing.",
          },
          {
            name: "Zero-secrets policy",
            description:
              "No credentials of any kind ship to the client. Where a project needs a paid API (Resume Checker's Gemini calls), the demo disables the live call and ships sample analyses rather than proxying through a keyed endpoint that could be farmed. A demo hub should have nothing worth stealing.",
          },
        ],

        finished:
          "Live at noctua.muazrom.my — the shelf still hosts demos of earlier projects, including some no longer featured here.",
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

  // Earned credentials only. Anything not yet held belongs in prose — the hero bio
  // already says "studying toward CCNA" — because a section that mostly lists
  // intentions reads as a wishlist, not evidence.
  //
  // `kind` is the single field driving both the medal design and the card label.
  // It replaces the old `tier`, which conflated credential rigor with artifact type
  // and is why the previous renderer needed an orderOf() shim. When CCNA lands it
  // goes in as kind: 'certification' and renders at top weight automatically,
  // visibly distinct from a free course badge.
  //
  //   kind:  certification | path | course | module
  //   topic: network | security | systems   (colour accent)
  //   date:  ISO, sortable
  credentials: [
    {
      id: 'cr-thm-presecurity',
      name: 'Pre Security Learning Path',
      issuer: 'TryHackMe',
      kind: 'path',
      topic: 'security',
      date: '2026-06',
      image: '/badges/tryhackme-pre-security.png',
      credential: '/badges/tryhackme-pre-security.pdf',
    },
    {
      id: 'cr-cisco-introcyber',
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      kind: 'course',
      topic: 'security',
      date: '2026',
      image: '/badges/cisco-intro-cybersecurity.png',
      credential: 'https://www.credly.com/badges/93dd6936-bea6-48ae-9311-30c16399e323/public_url',
    },
    {
      id: 'cr-cisco-netaddressing',
      name: 'Network Addressing and Basic Troubleshooting',
      issuer: 'Cisco Networking Academy',
      kind: 'course',
      topic: 'network',
      date: '2026-08',
      image: '/badges/cisco-network-addressing-troubleshooting.png',
      credential: 'https://www.credly.com/badges/ddfdb053-2523-4ade-8903-e5619cb2d0cf/public_url',
    },
    {
      id: 'cr-cisco-netdevices',
      name: 'Networking Devices and Initial Configuration',
      issuer: 'Cisco Networking Academy',
      kind: 'course',
      topic: 'network',
      date: '2026-08',
      image: '/badges/cisco-networking-devices-initial-config.png',
      credential: 'https://www.credly.com/badges/03796fd1-7045-4126-bb5d-1328e24a3313/public_url',
    },
    {
      id: 'cr-cisco-netbasics',
      name: 'Networking Basics',
      issuer: 'Cisco Networking Academy',
      kind: 'course',
      topic: 'network',
      date: '2026-08',
      image: '/badges/cisco-networking-basics.png',
      credential: 'https://www.credly.com/badges/4581f746-ff2e-4064-8def-797b1d0b07ea/public_url',
    },
    {
      id: 'cr-cisco-hardware',
      name: 'Computer Hardware Basics',
      issuer: 'Cisco Networking Academy',
      kind: 'module',
      topic: 'systems',
      date: '2026',
      image: '/badges/cisco-computer-hardware-basics.png',
      credential: 'https://www.credly.com/earner/earned/badge/215db823-5346-4b3b-98ed-bcfdd04d5c1c',
    },
  ],

  // Split by `track` so one technical internship isn't diluted by six event roles.
  //   technical   — paid or competitive work: the internship, the company role, the
  //                 competition placing. Rendered on the ring, in the spotlight.
  //   leadership  — university committee and event roles. Real and worth showing,
  //                 but supporting evidence, so they sit below in a compact list.
  // The "Head of Logistics & Technical" roles stay under leadership: they involved
  // genuine equipment and AV work, but they were student events, and filing them as
  // technical would read as padding to anyone hiring for infrastructure.
  experience: [
    {
      id: 'e8', track: 'technical',
      role: 'Desktop Support Intern', org: 'iFast Global Hub AI Sdn Bhd', period: 'Jul 2026 – Present',
      // Deliberately generic. No client names, no topology detail, no ticket
      // specifics, no internal tooling names.
      summary: 'First-line IT support for internal users: endpoint provisioning and troubleshooting, hardware and software faults, account and access issues, and escalation to the infrastructure teams who own the network and server layer. My first sustained look at how a production environment is actually held together.',
    },
    {
      id: 'e9', track: 'technical',
      role: 'Silver Award', org: 'Pitram', period: '2024',
      // TODO(muaz): add one line on what the competition involved — "Silver at Pitram"
      // means nothing to someone outside it, and that context is the whole value.
      summary: 'Entered Pitram as a participant and placed, taking the Silver award.',
    },
    {
      id: 'e5', track: 'technical',
      role: 'Assistant', org: 'Perisian Huda Sdn Bhd', period: 'Apr 2023',
      summary: 'Assisted in collecting natural data for machine learning and developing the "Mushafi" app. Served as a beta tester and provided user feedback that directly shaped the product.',
    },

    {
      id: 'e1', track: 'leadership',
      role: 'Vice Secretary', org: 'Warisan Run', period: 'May 2026',
      summary: 'Handled administrative tasks including documentation, planning, and resolving internal problems for an event involving 260 participants and 48 committee members.',
    },
    {
      id: 'e2', track: 'leadership',
      role: 'Head of Logistics & Technical', org: 'Jelajah Nusantara International Mobility Programme', period: 'Nov 2025',
      summary: "Led technical and logistics operations for the university's international mobility programme to Indonesia. Coordinated equipment, transportation, and technical requirements across international borders.",
    },
    {
      id: 'e4', track: 'leadership',
      role: 'Head of Department', org: 'Minggu Haluan Siswa KK10', period: 'Oct 2025',
      summary: 'Managed technical setup and equipment for the university orientation programme serving 300 new students and 50 committee members. Ensured seamless execution of all technical operations.',
    },
    {
      id: 'e3', track: 'leadership',
      role: 'Head of Dept & Scenographer', org: 'Pentaz Production — Karnival Teater UM', period: 'Apr 2025 & 2026',
      summary: 'Designed and led full stage sets and props for Karnival Teater Universiti Malaya for two consecutive years. Managed production budget and team coordination — received acknowledgement from the panel of jury.',
    },
    {
      id: 'e6', track: 'leadership',
      role: 'Head of Logistics & Technical', org: 'Tazcup', period: '2025',
      summary: 'Managed logistics and technical operations for Tazcup, a futsal tournament open to University Malaya students and the surrounding community. Coordinated equipment, venue setup, and ensured smooth technical execution throughout the event.',
    },
    {
      id: 'e7', track: 'leadership',
      role: 'Director', org: 'Dayasari Goes Green', period: 'Feb 2024',
      summary: 'Directed a recycling awareness programme organised by one of the residential colleges at University Malaya. Led the committee in planning and executing activities centred around sustainability and environmental responsibility.',
    },
  ],
}
