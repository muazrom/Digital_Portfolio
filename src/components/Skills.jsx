const skillGroups = [
  {
    category: 'Programming & Frameworks',
    skills: ['Python', 'HTML', 'React', 'Java', 'SQLite'],
  },
  {
    category: 'AI & Prompting',
    skills: ['Prompt Engineering', 'API Integration', 'LangGraph', 'AI-assisted Development'],
  },
  {
    category: 'Cybersecurity',
    skills: ['Secure Authentication', 'Password Encryption', 'Network (Introductory)'],
  },
  {
    category: 'Tools & Technologies',
    skills: ['Git', 'GitHub', 'Linux', 'Excel', 'Figma'],
  },
  {
    category: 'Soft Skills',
    skills: ['Leadership', 'Team Collaboration', 'Problem-Solving', 'Complex Thinking'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 03</p>
        <h2 className="section-title mb-12">Skills &amp; Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {skillGroups.map((group) => (
            <div key={group.category} className="card p-6">
              <p className="font-mono text-xs mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
                  style={{ boxShadow: '0 0 8px rgba(37,99,235,0.8)' }} />
                <span className="text-accent">{group.category.toUpperCase()}</span>
              </p>
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
