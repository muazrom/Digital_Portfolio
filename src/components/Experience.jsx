const experiences = [
  // Add your work experience here
  // {
  //   role: 'Software Developer',
  //   company: 'Company Name',
  //   period: '2024 — Present',
  //   summary: 'Brief description of responsibilities and impact.',
  // },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 05</p>
        <h2 className="section-title mb-12">Work Experience</h2>
        {experiences.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-mono text-xs text-muted">EXPERIENCE_LOG // Entries pending</p>
          </div>
        ) : (
          <div className="relative border-l border-border pl-8 space-y-10">
            {experiences.map((exp, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[2.35rem] top-1 w-3 h-3 rounded-full bg-accent border-2 border-bg" />
                <p className="font-mono text-xs text-accent mb-1">{exp.period}</p>
                <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
                <p className="text-muted text-sm mb-3">{exp.company}</p>
                <p className="text-muted text-sm leading-relaxed">{exp.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
