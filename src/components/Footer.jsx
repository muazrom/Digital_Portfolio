export default function Footer() {
  return (
    <footer className="relative border-t border-border py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted flex items-center gap-2">
          <span className="text-accent">©</span> 2026 Muaz Arief
          <span className="text-border">—</span>
          <span className="text-accent">muazrom.my</span>
        </span>
        <span className="font-mono text-xs text-muted/50">
          React + Vite · Cloudflare Pages · v1.0.0
        </span>
      </div>
    </footer>
  )
}
