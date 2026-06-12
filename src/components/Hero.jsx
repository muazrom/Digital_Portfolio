export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-5xl mx-auto px-6 py-24 w-full">
        <p className="section-number mb-4">INIT_SEQUENCE // 00</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Muaz Arief
        </h1>
        <h2 className="text-xl md:text-2xl text-muted font-light mb-6">
          Software Developer &amp; Digital Craftsman
        </h2>
        <p className="max-w-xl text-muted leading-relaxed mb-10">
          Building structured, intentional digital systems. This is my workshop — where tools, projects, and ideas take shape.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="bg-accent text-white font-mono text-sm px-5 py-2.5 hover:bg-blue-700 transition-colors duration-200"
          >
            View Projects →
          </a>
          <a
            href="#contact"
            className="border border-border text-muted font-mono text-sm px-5 py-2.5 hover:border-accent hover:text-white transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'STATUS', value: 'Available for work' },
            { label: 'LOCATION', value: 'Malaysia' },
            { label: 'FOCUS', value: 'Full-Stack Dev' },
            { label: 'BUILD', value: 'v1.0.0' },
          ].map((item) => (
            <div key={item.label} className="card p-4">
              <p className="font-mono text-xs text-muted mb-1">{item.label}</p>
              <p className="text-sm text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
