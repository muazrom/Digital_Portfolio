const projects = [
  {
    name: 'Digital Portfolio',
    description: 'This site — a personal dashboard-style portfolio built with React, Vite, and Tailwind CSS. Deployed on Cloudflare Pages.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
    github: 'https://github.com/muazrom/Digital_Portfolio',
    live: 'https://muazrom.my',
  },
  // Add more projects here
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 04</p>
        <h2 className="section-title mb-12">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.name} className="card p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{project.name}</h3>
                <p className="text-muted text-sm leading-relaxed">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-2 border-t border-border">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted hover:text-accent transition-colors"
                  >
                    GitHub →
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted hover:text-accent transition-colors"
                  >
                    Live →
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
