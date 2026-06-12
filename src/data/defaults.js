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
        { name: 'Python', level: 3 }, { name: 'JavaScript', level: 3 },
        { name: 'HTML', level: 3 }, { name: 'CSS', level: 3 },
        { name: 'SQL', level: 2 }, { name: 'Java', level: 2 },
      ],
    },
    {
      id: 'S02', label: 'Frameworks & Libraries', desc: 'Build stack',
      tools: [
        { name: 'React', level: 3 }, { name: 'Tailwind CSS', level: 3 },
        { name: 'Node.js', level: 2 }, { name: 'Express', level: 2 },
        { name: 'Vite', level: 3 }, { name: 'Electron', level: 1 },
      ],
    },
    {
      id: 'S03', label: 'AI & Prompting', desc: 'Intelligence layer',
      tools: [
        { name: 'Prompt Engineering', level: 3 }, { name: 'LangGraph', level: 2 },
        { name: 'API Integration', level: 3 }, { name: 'ChromaDB', level: 1 },
        { name: 'AI-assisted Dev', level: 3 },
      ],
    },
    {
      id: 'S04', label: 'Cybersecurity', desc: 'Security bench',
      tools: [
        { name: 'Secure Auth', level: 2 }, { name: 'Password Encryption', level: 2 },
        { name: 'Network Fundamentals', level: 1 },
      ],
    },
    {
      id: 'S05', label: 'Tools & Platforms', desc: 'Workshop gear',
      tools: [
        { name: 'Git / GitHub', level: 3 }, { name: 'Linux', level: 1 },
        { name: 'Figma', level: 2 }, { name: 'Excel', level: 2 },
        { name: 'Cloudflare', level: 2 }, { name: 'SQLite', level: 2 },
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
      id: 'p4', name: 'Digital Portfolio', status: 'Live',
      description: 'This site — a personal dashboard-style portfolio themed as a digital workshop. Built with React + Vite, deployed on Cloudflare Pages with a custom domain.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
      github: 'https://github.com/muazrom/Digital_Portfolio', live: 'https://muazrom.my',
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
      id: 'e5', role: 'Assistant', org: 'Perisian Huda Sdn Bhd', period: 'Apr 2023',
      summary: 'Assisted in collecting natural data for machine learning and developing the "Mushafi" app. Served as a beta tester and provided user feedback that directly shaped the product.',
    },
  ],
}
