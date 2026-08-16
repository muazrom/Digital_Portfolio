import Icon from './Icon'
import { useData } from '../context/DataContext'

// Blueprint corner bracket
function Corner({ pos }) {
  const size = 14
  const s = {
    position: 'absolute',
    width: size, height: size,
    borderColor: 'rgba(var(--accent-rgb), 0.4)',
    borderStyle: 'solid',
    ...pos,
  }
  return <div style={s} />
}

function TerminalLine({ cmd, output, delay = 0 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>$</span>
        <span style={{ color: 'var(--accent-text)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{cmd}</span>
      </div>
      {output && (
        <div style={{ paddingLeft: 20, borderLeft: '1px solid var(--border-subtle)' }}>
          {Array.isArray(output)
            ? output.map((line, i) => (
                <p key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-body)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: 8, textShadow: '0 0 8px rgba(var(--accent-rgb), 0.6)' }}>›</span>{line}
                </p>
              ))
            : <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-body)', lineHeight: 1.8 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: 8, textShadow: '0 0 8px rgba(var(--accent-rgb), 0.6)' }}>›</span>{output}
              </p>
          }
        </div>
      )}
    </div>
  )
}

export default function About({ id, num, icon }) {
  const { data } = useData()
  const a = data.about

  return (
    <section id={id} className="py-24 relative">

      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// {num}</p>
        <div className="flex items-center gap-2.5 mb-10"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">About Me</h2></div>

        {/* Blueprint terminal window */}
        <div style={{ position: 'relative', padding: 2 }}>

          {/* Blueprint corners */}
          <Corner pos={{ top: -6, left: -6, borderWidth: '2px 0 0 2px' }} />
          <Corner pos={{ top: -6, right: -6, borderWidth: '2px 2px 0 0' }} />
          <Corner pos={{ bottom: -6, left: -6, borderWidth: '0 0 2px 2px' }} />
          <Corner pos={{ bottom: -6, right: -6, borderWidth: '0 2px 2px 0' }} />

          {/* Main panel */}
          <div style={{
            background: 'var(--surface-sunken)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundImage: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}>

            {/* Terminal title bar */}
            <div style={{
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['var(--danger)', 'var(--warn)', 'var(--ok)'].map(c => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', flex: 1, textAlign: 'center' }}>
                muazrom@workshop: ~/about
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-dim)' }}>bash</span>
            </div>

            {/* Terminal body */}
            <div className="terminal-grid" style={{ gap: 0 }}>

              {/* Left — commands */}
              <div className="terminal-left" style={{ padding: '28px 28px', borderRight: '1px solid var(--border)' }}>
                <TerminalLine
                  cmd="whoami"
                  output={a.info[0]?.value}
                />
                <TerminalLine
                  cmd="cat bio.txt"
                  output={a.paragraphs}
                />
                <TerminalLine
                  cmd="ls focus/"
                  output={null}
                />
                {/* Focus tags */}
                <div style={{ paddingLeft: 20, borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {a.focus.map(m => (
                    <span key={m} style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10,
                      background: 'rgba(var(--accent-rgb), 0.06)',
                      border: '1px solid rgba(var(--accent-rgb), 0.15)',
                      color: 'var(--text-body)', padding: '3px 8px', borderRadius: 3,
                    }}>{m}</span>
                  ))}
                </div>

                {/* Blinking cursor line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
                  <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>$</span>
                  <span className="cursor-blink" style={{ color: 'var(--accent)', fontSize: 14 }}>▋</span>
                </div>
              </div>

              {/* Right — system info panel */}
              <div style={{ padding: '28px 28px' }}>
                {/* Panel header */}
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: 'var(--accent)', letterSpacing: '0.12em',
                  marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  SYSINFO
                  <div style={{ flex: 1, height: 1, background: 'rgba(var(--accent-rgb), 0.2)' }} />
                  <span style={{ color: 'var(--ok)', fontSize: 8 }}>● ONLINE</span>
                </div>

                {/* Spec rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {a.info.map((row, i) => (
                    <div key={row.label} style={{
                      display: 'flex', gap: 0,
                      borderBottom: i < a.info.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      padding: '9px 0',
                    }}>
                      <span style={{
                        fontFamily: 'JetBrains Mono', fontSize: 9.5,
                        color: 'var(--accent)', width: 110, flexShrink: 0,
                        letterSpacing: '0.04em',
                      }}>{row.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-bright)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Status bar */}
            <div style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: '6px 16px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {[
                { label: 'UTF-8', color: 'var(--text-dim)' },
                { label: 'LF', color: 'var(--text-dim)' },
                { label: 'STUDENT', color: 'var(--accent)' },
                { label: 'B.CS (IS)', color: 'var(--text-muted)' },
                { label: 'University Malaya', color: 'var(--text-muted)' },
              ].map(item => (
                <span key={item.label} style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: item.color,
                }}>{item.label}</span>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-dim)' }}>
                Ln 1, Col 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
