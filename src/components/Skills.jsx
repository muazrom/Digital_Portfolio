const skillGroups = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'Python', 'HTML', 'CSS', 'SQL'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Vite'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Cloudflare', 'VS Code', 'Linux'],
  },
  {
    category: 'Concepts',
    skills: ['REST APIs', 'Responsive Design', 'CI/CD', 'Component Architecture'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 03</p>
        <h2 className="section-title mb-12">Skills &amp; Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skillGroups.map((group) => (
            <div key={group.category} className="card p-6">
              <p className="font-mono text-xs text-accent mb-4">{group.category.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
