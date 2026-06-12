export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted">
          © 2026 Muaz Arief — muazrom.my
        </span>
        <span className="font-mono text-xs text-muted">
          Built with React + Vite. Deployed on Cloudflare Pages.
        </span>
      </div>
    </footer>
  )
}
