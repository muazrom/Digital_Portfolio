export const defaultData = {
  hero: {
    name: "Mu'az Arief",
    title: 'CS Student · Cybersecurity & AI · University Malaya',
    bio: "Passionate about cybersecurity and building AI-powered systems. Proven leader with hands-on experience developing full-stack applications — from secure auth to intelligent workflows.",
    status: 'Seeking Internship',
    location: 'Kajang, Selangor',
    university: 'University Malaya',
  },

  about: {
    paragraphs: [
      "Computer Science student at University Malaya, majoring in Information Systems. Passionate about cybersecurity and leveraging AI to develop secure, intelligent systems.",
      "I build full-stack applications with a focus on security and AI integration — from secure authentication systems to LangGraph-powered AI workflows. Currently seeking a Cybersecurity Analyst internship.",
      "Beyond code, I've led teams in multiple Head of Department roles across university events, managing budgets, logistics, and cross-functional coordination for hundreds of participants.",
    ],
    modules: ['Operating Systems', 'Data Structures', 'Information Retrieval', 'Algorithm Design', 'Network Technology', 'Machine Learning'],
    info: [
      { label: 'NAME', value: "Mu'az Arief bin Mohamad Rom" },
      { label: 'STATUS', value: 'Student' },
      { label: 'DEGREE', value: 'B.CS (Information Systems)' },
      { label: 'UNIVERSITY', value: 'University Malaya' },
      { label: 'LOCATION', value: 'Kajang, Selangor' },
      { label: 'EMAIL', value: 'zaumarief08@gmail.com' },
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
      id: 'p1', name: 'Noctua', status: 'In Development',
      description: 'AI-driven personal assistant & life management dashboard. Features natural language journaling, proactive data tracking, and intelligent goal planning with LangGraph-powered contextual AI workflows.',
      stack: ['React', 'Python', 'SQLite', 'LangGraph', 'Tailwind CSS'],
      github: 'https://github.com/muazrom', live: null,
    },
    {
      id: 'p6', name: 'Manga Tracker', status: 'In Development',
      description: 'Cross-platform Flutter app to track manga, manhwa & manhua reading progress, with an in-app reader powered by the comick.io API.',
      stack: ['Flutter', 'Dart', 'comick.io API'],
      github: 'https://github.com/muazrom/manga-tracker', live: null,
    },
    {
      id: 'p2', name: 'Archive', status: 'Ongoing',
      description: 'macOS desktop overlay that replaces Finder, Spotlight, and the Dock with a single hotkey-triggered interface. Semantic search over your entire file system — fully local, no internet dependency.',
      stack: ['Electron', 'React', 'Python', 'FastAPI', 'ChromaDB', 'SQLite FTS5'],
      github: 'https://github.com/muazrom/Archives', live: null,
    },
    {
      id: 'p3', name: 'VISSCO', status: 'Completed',
      description: 'Web-based attendance management system for students and lecturers. Built for the Pre-University Innovation Competition with CRUD operations, secure login, and password encryption.',
      stack: ['HTML', 'CSS', 'JavaScript', 'SQLite'],
      github: 'https://github.com/muazrom', live: null,
    },
    {
      id: 'p5', name: 'Internships Tracker', status: 'Completed',
      description: 'A personal web app to track and manage internship applications through the recruitment process. Separated client-server architecture with a Python backend and vanilla JS/HTML/CSS frontend.',
      stack: ['Python', 'JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/muazrom/Internships-Tracker', live: null,
    },
    {
      id: 'p4', name: 'Digital Portfolio', status: 'Live',
      description: 'This site — a personal dashboard-style portfolio themed as a digital workshop. Built with React + Vite, deployed on Cloudflare Pages with a custom domain.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
      github: 'https://github.com/muazrom/Digital_Portfolio', live: 'https://muazrom.my',
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
      id: 'e1', role: 'Vice Secretary', org: 'Warisan Run', period: 'May 2026',
      summary: 'Handled administrative tasks including documentation, planning, and resolving internal problems for an event involving 260 participants and 48 committee members.',
    },
    {
      id: 'e2', role: 'Head of Logistics & Technical', org: 'Jelajah Nusantara International Mobility Programme', period: 'Nov 2025',
      summary: "Led technical and logistics operations for the university's international mobility programme to Indonesia. Coordinated equipment, transportation, and technical requirements across international borders.",
    },
    {
      id: 'e3', role: 'Head of Dept & Scenographer', org: 'Pentaz Production — Karnival Teater UM', period: 'Apr 2025 & 2026',
      summary: 'Designed and led full stage sets and props for Karnival Teater Universiti Malaya for two consecutive years. Managed production budget and team coordination — received acknowledgement from the panel of jury.',
    },
    {
      id: 'e4', role: 'Head of Department', org: 'Minggu Haluan Siswa KK10', period: 'Oct 2025',
      summary: 'Managed technical setup and equipment for the university orientation programme serving 300 new students and 50 committee members. Ensured seamless execution of all technical operations.',
    },
    {
      id: 'e7', role: 'Director', org: 'Dayasari Goes Green', period: 'Feb 2024',
      summary: 'Directed a recycling awareness programme organised by one of the residential colleges at University Malaya. Led the committee in planning and executing activities centred around sustainability and environmental responsibility.',
    },
    {
      id: 'e6', role: 'Head of Logistics & Technical', org: 'Tazcup', period: '2025',
      summary: 'Managed logistics and technical operations for Tazcup, a futsal tournament open to University Malaya students and the surrounding community. Coordinated equipment, venue setup, and ensured smooth technical execution throughout the event.',
    },
    {
      id: 'e5', role: 'Assistant', org: 'Perisian Huda Sdn Bhd', period: 'Apr 2023',
      summary: 'Assisted in collecting natural data for machine learning and developing the "Mushafi" app. Served as a beta tester and provided user feedback that directly shaped the product.',
    },
  ],
}
