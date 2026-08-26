import { useState } from 'react'

// Base64-encoded so the address never appears as a plaintext string in the built bundle (avoids naive scrapers).
const EMAIL = atob('emF1bWFyaWVmMDhAZ21haWwuY29t')

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.77 10.77.57.1.78-.25.78-.55v-2.17c-3.16.69-3.83-1.36-3.83-1.36-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.16-3.04-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.46 3.11-1.16 3.11-1.16.61 1.57.23 2.73.11 3.02.72.79 1.16 1.8 1.16 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.21.65.79.54 4.5-1.5 7.76-5.75 7.76-10.77C23.25 5.48 18.27.5 12 .5z" />
    </svg>
  )
}
function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.58 4.78 5.94V21h-4v-5.3c0-1.26-.02-2.89-1.85-2.89-1.85 0-2.14 1.37-2.14 2.8V21H9z" />
    </svg>
  )
}
function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V5a1 1 0 0 1 1-1h11" />
    </svg>
  )
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  )
}
function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

const channels = [
  { key: 'email', icon: MailIcon, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, copyable: true },
  { key: 'github', icon: GithubIcon, label: 'GitHub', value: 'github.com/muazrom', href: 'https://github.com/muazrom' },
  { key: 'linkedin', icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/muazrom', href: 'https://linkedin.com/in/muazrom' },
]

function ChannelCard({ ch }) {
  const [copied, setCopied] = useState(false)
  const ChannelIcon = ch.icon

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(ch.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <a
      href={ch.href}
      target="_blank"
      rel="noopener noreferrer"
      className="card group"
      style={{ display: 'block', padding: '22px 20px', textDecoration: 'none' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#2563eb',
        }}>
          <ChannelIcon width={16} height={16} />
        </div>
        <ArrowIcon width={14} height={14} className="text-muted group-hover:text-accent" style={{ transition: 'color 0.2s' }} />
      </div>

      <p className="font-mono mb-1.5" style={{ fontSize: 10, color: '#2563eb', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {ch.label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#e0e0e0', fontWeight: 500, wordBreak: 'break-all' }}>
          {ch.value}
        </p>
        {ch.copyable && (
          <button
            onClick={handleCopy}
            title="Copy email"
            style={{
              flexShrink: 0, width: 26, height: 26, borderRadius: 6,
              border: '1px solid #333', background: '#181818',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: copied ? '#4ade80' : '#888', cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {copied ? <CheckIcon width={12} height={12} /> : <CopyIcon width={12} height={12} />}
          </button>
        )}
      </div>
    </a>
  )
}

// There is no backend to POST to, and there won't be — the whole site is static.
// So "Message me" composes the mail locally and hands it to whatever mail client
// the visitor already uses. Nothing is transmitted from this page, and the button
// is a plain link, so it degrades to a normal mailto if JS never runs.
function Compose() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const ready = subject.trim().length > 0 || body.trim().length > 0

  const field = {
    width: '100%', background: '#0b0b0b', border: '1px solid #232323', borderRadius: 5,
    padding: '9px 11px', color: '#dcdcdc', fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11.5, outline: 'none', resize: 'vertical',
  }

  return (
    <div style={{
      background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: 6,
      padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div className="font-mono" style={{ fontSize: 9, color: '#5c5c5c', letterSpacing: '0.14em' }}>
        MESSAGE ME
      </div>

      <label className="font-mono" style={{ fontSize: 9, color: '#5c5c5c', letterSpacing: '0.1em' }}>
        SUBJECT
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about?"
          style={{ ...field, marginTop: 5 }}
        />
      </label>

      <label className="font-mono" style={{ fontSize: 9, color: '#5c5c5c', letterSpacing: '0.1em' }}>
        MESSAGE
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message here."
          style={{ ...field, marginTop: 5, lineHeight: 1.6 }}
        />
      </label>

      <a
        href={href}
        className="font-mono"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 5, textDecoration: 'none',
          fontSize: 10.5, letterSpacing: '0.1em',
          color: ready ? '#fff' : '#8d8d8d',
          background: ready ? 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(37,99,235,0.65))' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${ready ? 'rgba(96,165,250,0.55)' : '#242424'}`,
          transition: 'background 0.2s, color 0.2s, border-color 0.2s',
        }}
      >
        <MailIcon width={13} height={13} />
        OPEN IN MAIL APP
      </a>

      <p className="font-mono" style={{ fontSize: 9, color: '#4f4f4f', lineHeight: 1.6 }}>
        This opens your own mail client with the message ready to send. Nothing is
        submitted to this site — it has no server to submit to.
      </p>
    </div>
  )
}

export default function Contact() {
  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs text-muted mb-10">
          Graduating Feb 2028 · targeting <span className="text-white">junior network engineer / NOC</span> roles, heading toward cloud security · open to conversations now
        </p>
        <div className="console-contact-grid">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignContent: 'start' }}>
            {channels.map(ch => <ChannelCard key={ch.key} ch={ch} />)}
          </div>
          <Compose />
        </div>
      </div>
    </section>
  )
}
