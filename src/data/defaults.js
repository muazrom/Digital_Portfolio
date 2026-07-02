export const defaultData = {
  hero: {
    name: "Mu'az Arief",
    title: 'CS Student · Cybersecurity & AI · University Malaya',
    bio: "Passionate about cybersecurity and building AI-powered systems. Proven leader with hands-on experience developing full-stack applications — from secure auth to intelligent workflows.",
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
      id: 'p7', name: 'Vault', status: 'In Development',
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
          "In development — registration, unlock, and encrypted CRUD work end-to-end; credential recovery flow is next.",
      },
    },
    {
      id: 'p1', name: 'Noctua', status: 'In Development',
      description: 'AI-driven personal assistant & life management dashboard. Features natural language journaling, proactive data tracking, and intelligent goal planning with LangGraph-powered contextual AI workflows.',
      stack: ['React', 'Python', 'SQLite', 'LangGraph', 'Tailwind CSS'],
      github: 'https://github.com/muazrom', live: null,
      image: null,
      caseStudy: 'Started as a way to consolidate journaling, habit tracking, and goal planning that were scattered across four different apps. Built the assistant on LangGraph so it can hold context across conversations and proactively surface patterns instead of waiting to be asked. Journaling and tracking are working end-to-end; the planning layer is next.',
    },
    {
      id: 'p6', name: 'Manga Tracker', status: 'In Development',
      description: 'Cross-platform Flutter app to track manga, manhwa & manhua reading progress, with an in-app reader powered by the comick.io API.',
      stack: ['Flutter', 'Dart', 'comick.io API'],
      github: 'https://github.com/muazrom/manga-tracker', live: null,
      image: null,
      caseStudy: 'Wanted one tracker for manga, manhwa, and manhua that also let me read without switching apps. Wired the UI to the comick.io API for metadata and chapter data, then layered a Flutter reader on top so tracking and reading progress stay in sync automatically.',
    },
    {
      id: 'p3', name: 'VISSCO', status: 'Completed',
      description: 'Web-based attendance management system for students and lecturers. Built for the Pre-University Innovation Competition with CRUD operations, secure login, and password encryption.',
      stack: ['HTML', 'CSS', 'JavaScript', 'SQLite'],
      github: 'https://github.com/muazrom', live: null,
      image: null,
      caseStudy: 'Built for a Pre-University Innovation Competition brief that required a working system, not a mockup. Implemented CRUD-based session management with encrypted login so lecturers could take attendance without a paper sheet, and demoed it live end-to-end at the competition.',
    },
    {
      id: 'p5', name: 'Internships Tracker', status: 'Completed',
      description: 'A personal web app to track and manage internship applications through the recruitment process. Separated client-server architecture with a Python backend and vanilla JS/HTML/CSS frontend.',
      stack: ['Python', 'JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/muazrom/Internships-Tracker', live: null,
      image: null,
      caseStudy: 'Was tracking internship applications in a spreadsheet and kept losing track of follow-up dates and stages. Split the app into a Python backend and a vanilla JS/HTML/CSS frontend so application status actually persists, instead of living in a browser tab that gets closed.',
    },
    {
      id: 'p4', name: 'Digital Portfolio', status: 'Live',
      description: 'This site — a personal dashboard-style portfolio themed as a digital workshop. Built with React + Vite, deployed on Cloudflare Pages with a custom domain.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
      github: 'https://github.com/muazrom/Digital_Portfolio', live: 'https://muazrom.my',
      image: null,
      caseStudy: 'This site. Rebuilt from a static single-page resume into a React + Vite app with an in-browser admin editor — every section including this project carousel is data-driven, not hardcoded — and deployed it on Cloudflare Pages with a custom domain.',
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
