const projects = [
  {
    name: 'Noctua',
    description: 'AI-driven personal assistant & life management dashboard. Features natural language journaling, proactive data tracking, and intelligent goal planning with LangGraph-powered contextual AI workflows.',
    stack: ['React', 'Tailwind CSS', 'Python', 'SQLite', 'LangGraph', 'API Integration'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'In Development',
  },
  {
    name: 'Archive',
    description: 'AI-native unified file system & hybrid search engine. Combines local storage with web intelligence for hyper-personalized information retrieval using vector databases and search APIs.',
    stack: ['React', 'Electron', 'Python', 'Tailwind CSS', 'ChromaDB', 'Brave API'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'Ongoing',
  },
  {
    name: 'VISSCO',
    description: 'Web-based attendance management system for students and lecturers. Built for the Pre-University Innovation Competition with CRUD operations, basic login, and password encryption.',
    stack: ['HTML', 'CSS', 'JavaScript', 'SQLite'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'Completed',
  },
  {
    name: 'Digital Portfolio',
    description: 'This site — a personal dashboard-style portfolio built with React, Vite, and Tailwind CSS. Deployed on Cloudflare Pages with custom domain.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
    github: 'https://github.com/muazrom/Digital_Portfolio',
    live: 'https://muazrom.my',
    status: 'Live',
  },
]

const statusColor = {
  'Live': 'text-green-400',
  'In Development': 'text-yellow-400',
  'Ongoing': 'text-blue-400',
  'Completed': 'text-muted',
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 04</p>
        <h2 className="section-title mb-12">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.name} className="card p-6 flex flex-col gap-4 group">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg group-hover:text-accent transition-colors duration-200">
                    {project.name}
                  </h3>
                  <span className={`font-mono text-xs ${statusColor[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-3 border-t border-border">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-xs text-muted hover:text-accent transition-colors flex items-center gap-1">
                    GitHub ↗
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-xs text-muted hover:text-accent transition-colors flex items-center gap-1">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
