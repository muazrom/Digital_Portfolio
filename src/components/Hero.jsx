export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24 w-full relative z-10">
        <p className="section-number mb-6 fade-up fade-up-delay-1 flex items-center gap-2">
          <span className="text-muted">~/workshop</span>
          <span className="text-accent">$</span>
          <span>init_sequence</span>
          <span className="cursor-blink text-accent">▋</span>
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 fade-up fade-up-delay-2">
          <span className="glow-text">Mu'az Arief</span>
        </h1>

        <h2 className="text-lg md:text-xl font-mono text-muted mb-6 fade-up fade-up-delay-3">
          <span className="text-accent">{'>'}</span> CS Student · Cybersecurity &amp; AI · University Malaya
        </h2>

        <p className="max-w-lg text-muted leading-relaxed mb-10 fade-up fade-up-delay-4">
          Passionate about cybersecurity and building AI-powered systems. Proven leader with hands-on experience developing full-stack applications — from secure auth to intelligent workflows.
        </p>

        <div className="flex flex-wrap gap-4 fade-up fade-up-delay-5">
          <a
            href="#projects"
            className="relative bg-accent text-white font-mono text-sm px-6 py-3 hover:bg-blue-600 transition-all duration-200 overflow-hidden group"
          >
            <span className="relative z-10">View Projects →</span>
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
          </a>
          <a
            href="#contact"
            className="border border-border text-muted font-mono text-sm px-6 py-3 hover:border-accent hover:text-white transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 fade-up fade-up-delay-5">
          {[
            { label: 'STATUS', value: 'Seeking Internship', dot: true },
            { label: 'LOCATION', value: 'Kajang, Selangor' },
            { label: 'UNIVERSITY', value: 'University Malaya' },
            { label: 'CGPA', value: '3.21 / 4.00' },
          ].map((item) => (
            <div key={item.label} className="card p-4">
              <p className="font-mono text-xs text-muted mb-2 flex items-center gap-1.5">
                {item.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                    style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
                )}
                {item.label}
              </p>
              <p className="text-sm text-white font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0a, transparent)' }} />
    </section>
  )
}
