const links = [
  { label: 'EMAIL', value: 'zaumarief08@gmail.com', href: 'mailto:zaumarief08@gmail.com' },
  { label: 'GITHUB', value: 'github.com/muazrom', href: 'https://github.com/muazrom' },
  { label: 'LINKEDIN', value: 'linkedin.com/in/muazrom', href: 'https://linkedin.com/in/muazrom' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 06</p>
        <h2 className="section-title mb-4">Contact</h2>
        <p className="text-muted mb-12 max-w-lg">
          Open to opportunities, collaborations, and interesting conversations. Reach out through any channel below.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 group"
            >
              <p className="font-mono text-xs text-accent mb-2">{link.label}</p>
              <p className="text-sm text-muted group-hover:text-white transition-colors">{link.value}</p>
            </a>
          ))}
        </div>
        <div className="card p-6 max-w-2xl">
          <p className="font-mono text-xs text-muted mb-6">SEND_MESSAGE</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="bg-bg border border-border text-white text-sm px-4 py-2.5 w-full focus:outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-bg border border-border text-white text-sm px-4 py-2.5 w-full focus:outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>
            <textarea
              placeholder="Message"
              rows={4}
              className="bg-bg border border-border text-white text-sm px-4 py-2.5 w-full focus:outline-none focus:border-accent transition-colors placeholder:text-muted resize-none"
            />
            <button
              type="submit"
              className="font-mono text-sm bg-accent text-white px-6 py-2.5 hover:bg-blue-700 transition-colors"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
