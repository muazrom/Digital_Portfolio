import { useData } from '../context/DataContext'

export default function About() {
  const { data } = useData()
  const a = data.about

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 02</p>
        <h2 className="section-title mb-12">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-muted leading-relaxed">
            {a.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="pt-2">
              <p className="font-mono text-xs text-accent mb-3">RELEVANT MODULES</p>
              <div className="flex flex-wrap gap-2">
                {a.modules.map(m => <span key={m} className="tag">{m}</span>)}
              </div>
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            {a.info.map((row, i) => (
              <div key={row.label}
                className={`flex gap-4 px-5 py-3.5 ${i !== a.info.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.02] transition-colors`}>
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
