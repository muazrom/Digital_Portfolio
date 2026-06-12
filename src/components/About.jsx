export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 02</p>
        <h2 className="section-title mb-12">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Computer Science student at University Malaya, majoring in Information Systems. Passionate about cybersecurity and leveraging AI to develop secure, intelligent systems.
            </p>
            <p>
              I build full-stack applications with a focus on security and AI integration — from secure authentication systems to LangGraph-powered AI workflows. Currently seeking a Cybersecurity Analyst internship.
            </p>
            <p>
              Beyond code, I've led teams in multiple Head of Department roles across university events, managing budgets, logistics, and cross-functional coordination for hundreds of participants.
            </p>
            <div className="pt-2">
              <p className="font-mono text-xs text-accent mb-3">RELEVANT MODULES</p>
              <div className="flex flex-wrap gap-2">
                {['Operating Systems', 'Data Structures', 'Information Retrieval', 'Algorithm Design', 'Network Technology', 'Machine Learning'].map(m => (
                  <span key={m} className="tag">{m}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            {[
              { label: 'NAME', value: "Mu'az Arief bin Mohamad Rom" },
              { label: 'DEGREE', value: 'B.CS (Information Systems)' },
              { label: 'UNIVERSITY', value: 'University Malaya' },
              { label: 'CGPA', value: '3.21' },
              { label: 'LOCATION', value: 'Kajang, Selangor' },
              { label: 'EMAIL', value: 'zaumarief08@gmail.com' },
              { label: 'INTERNSHIP', value: 'July 2026 – Jan 2027' },
            ].map((row, i, arr) => (
              <div key={row.label}
                className={`flex gap-4 px-5 py-3.5 ${i !== arr.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.02] transition-colors`}>
                <span className="font-mono text-xs text-accent w-28 shrink-0 pt-0.5">{row.label}</span>
                <span className="text-sm text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
