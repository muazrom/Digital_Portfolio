const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono text-sm text-white tracking-tight">
          muazrom<span className="text-accent">.my</span>
        </span>
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="font-mono text-xs text-muted hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs border border-accent text-accent px-3 py-1.5 hover:bg-accent hover:text-white transition-all duration-200"
        >
          Resume
        </a>
      </nav>
    </header>
  )
}
