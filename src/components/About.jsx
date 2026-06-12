export default function About() {
  return (
    <section id="about" className="py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 02</p>
        <h2 className="section-title mb-12">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              I'm a software developer based in Malaysia, focused on building clean, functional, and well-structured digital products.
            </p>
            <p>
              My approach is methodical — I treat every project like an engineering problem: understand the system, define the constraints, then build deliberately.
            </p>
            <p>
              Outside of code, I spend time thinking about design systems, developer tooling, and how interfaces shape behaviour.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'NAME', value: 'Muaz Arief' },
              { label: 'ROLE', value: 'Software Developer' },
              { label: 'LOCATION', value: 'Malaysia' },
              { label: 'EMAIL', value: 'zaumarief08@gmail.com' },
              { label: 'AVAILABILITY', value: 'Open to opportunities' },
            ].map((row) => (
              <div key={row.label} className="flex gap-4 border-b border-border pb-3">
                <span className="font-mono text-xs text-muted w-28 shrink-0">{row.label}</span>
                <span className="text-sm text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
