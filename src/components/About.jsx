import { useData } from '../context/DataContext'

// Blueprint corner bracket
function Corner({ pos }) {
  const size = 14
  const s = {
    position: 'absolute',
    width: size, height: size,
    borderColor: 'rgba(37,99,235,0.4)',
    borderStyle: 'solid',
    ...pos,
  }
  return <div style={s} />
}

function TerminalLine({ cmd, output, delay = 0 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ color: '#2563eb', fontFamily: 'JetBrains Mono', fontSize: 12 }}>$</span>
        <span style={{ color: '#a0b4ff', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{cmd}</span>
      </div>
      {output && (
        <div style={{ paddingLeft: 20, borderLeft: '1px solid #1e1e1e' }}>
          {Array.isArray(output)
            ? output.map((line, i) => (
                <p key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 11.5, color: '#888', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  <span style={{ color: '#2a2a2a', marginRight: 8 }}>›</span>{line}
                </p>
              ))
            : <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11.5, color: '#888', lineHeight: 1.8 }}>
                <span style={{ color: '#2a2a2a', marginRight: 8 }}>›</span>{output}
              </p>
          }
        </div>
      )}
    </div>
  )
}

export default function About() {
  const { data } = useData()
  const a = data.about

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />

      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 02</p>
        <h2 className="section-title mb-10">About Me</h2>

        {/* Blueprint terminal window */}
        <div style={{ position: 'relative', padding: 2 }}>

          {/* Blueprint corners */}
          <Corner pos={{ top: -6, left: -6, borderWidth: '2px 0 0 2px' }} />
          <Corner pos={{ top: -6, right: -6, borderWidth: '2px 2px 0 0' }} />
          <Corner pos={{ bottom: -6, left: -6, borderWidth: '0 0 2px 2px' }} />
          <Corner pos={{ bottom: -6, right: -6, borderWidth: '0 2px 2px 0' }} />

          {/* Main panel */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid #1e1e1e',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}>

            {/* Terminal title bar */}
            <div style={{
              background: '#111',
              borderBottom: '1px solid #1e1e1e',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444', '#facc15', '#4ade80'].map(c => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#444', flex: 1, textAlign: 'center' }}>
                muazrom@workshop: ~/about
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2a2a2a' }}>bash</span>
            </div>

            {/* Terminal body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

              {/* Left — commands */}
              <div style={{ padding: '28px 28px', borderRight: '1px solid #1a1a1a' }}>
                <TerminalLine
                  cmd="whoami"
                  output={a.info[0]?.value}
                />
                <TerminalLine
                  cmd="cat bio.txt"
                  output={a.paragraphs}
                />
                <TerminalLine
                  cmd="ls modules/"
                  output={null}
                />
                {/* Module tags */}
                <div style={{ paddingLeft: 20, borderLeft: '1px solid #1e1e1e', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {a.modules.map(m => (
                    <span key={m} style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10,
                      background: 'rgba(37,99,235,0.06)',
                      border: '1px solid rgba(37,99,235,0.15)',
                      color: '#666', padding: '3px 8px', borderRadius: 3,
                    }}>{m}</span>
                  ))}
                </div>

                {/* Blinking cursor line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
                  <span style={{ color: '#2563eb', fontFamily: 'JetBrains Mono', fontSize: 12 }}>$</span>
                  <span className="cursor-blink" style={{ color: '#2563eb', fontSize: 14 }}>▋</span>
                </div>
              </div>

              {/* Right — system info panel */}
              <div style={{ padding: '28px 28px' }}>
                {/* Panel header */}
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: '#2563eb', letterSpacing: '0.12em',
                  marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  SYSINFO
                  <div style={{ flex: 1, height: 1, background: 'rgba(37,99,235,0.2)' }} />
                  <span style={{ color: '#4ade80', fontSize: 8 }}>● ONLINE</span>
                </div>

                {/* Spec rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {a.info.map((row, i) => (
                    <div key={row.label} style={{
                      display: 'flex', gap: 0,
                      borderBottom: i < a.info.length - 1 ? '1px solid #111' : 'none',
                      padding: '9px 0',
                    }}>
                      <span style={{
                        fontFamily: 'JetBrains Mono', fontSize: 9.5,
                        color: '#2563eb', width: 110, flexShrink: 0,
                        letterSpacing: '0.04em',
                      }}>{row.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ccc' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Uptime / build line */}
                <div style={{
                  marginTop: 24,
                  padding: '12px',
                  background: 'rgba(37,99,235,0.04)',
                  border: '1px solid rgba(37,99,235,0.1)',
                  borderRadius: 4,
                }}>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2563eb', marginBottom: 4 }}>
                    INTERNSHIP_WINDOW
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#888' }}>
                    Aug 2026 → Feb 2027
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333', marginTop: 4 }}>
                    min. 6 months · open to opportunities
                  </p>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div style={{
              borderTop: '1px solid #1a1a1a',
              background: '#0d0d0d',
              padding: '6px 16px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {[
                { label: 'UTF-8', color: '#333' },
                { label: 'LF', color: '#333' },
                { label: 'STUDENT', color: '#2563eb' },
                { label: 'B.CS (IS)', color: '#888' },
                { label: 'University Malaya', color: '#888' },
              ].map(item => (
                <span key={item.label} style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: item.color,
                }}>{item.label}</span>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2a2a2a' }}>
                Ln 1, Col 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
