// Case study body, lifted out of Projects unchanged when the coverflow was
// replaced by the inventory table. The rendering is the part worth keeping:
// the 3D carousel was the wrapper, not the content.

const csLabel = { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', color: '#2563eb', textTransform: 'uppercase' }
const csSubLabel = { fontFamily: 'JetBrains Mono', fontSize: 9.5, letterSpacing: '0.08em', color: '#666', textTransform: 'uppercase', marginBottom: 6 }
const csList = { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }
const csListItem = { fontSize: 12, color: '#999', lineHeight: 1.55, paddingLeft: 14, position: 'relative' }
const csBullet = { position: 'absolute', left: 0, color: '#2563eb' }

// Case study body — accepts either the legacy plain-string format or the structured
// { problem, idea, scope, constraints, workflow, concepts, finished } object. `twoColumn`
// splits scope/constraints/workflow (left) from idea/concepts (right) on desktop; mobile
// always stacks single-column since there isn't room for two.
export default function CaseStudyContent({ caseStudy, twoColumn }) {
  if (!caseStudy) return <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7 }}>Case study coming soon.</p>
  if (typeof caseStudy === 'string') return <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7 }}>{caseStudy}</p>

  const { problem, idea, scope, constraints, workflow, concepts, finished } = caseStudy

  const left = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {(scope || constraints) && (
        <div>
          <p style={csLabel}>Scope &amp; Constraints</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
            {scope && (
              <div style={{ flex: '1 1 160px' }}>
                <p style={csSubLabel}>In scope</p>
                <ul style={csList}>
                  {scope.map((s, i) => <li key={i} style={csListItem}><span style={csBullet}>▹</span>{s}</li>)}
                </ul>
              </div>
            )}
            {constraints && (
              <div style={{ flex: '1 1 160px' }}>
                <p style={csSubLabel}>Constraints</p>
                <ul style={csList}>
                  {constraints.map((c, i) => <li key={i} style={csListItem}><span style={{ ...csBullet, color: '#666' }}>▹</span>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {workflow && (
        <div>
          <p style={csLabel}>Workflow</p>
          <div style={{ marginTop: 10 }}>
            {workflow.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', border: '1px solid rgba(37,99,235,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono', fontSize: 8.5, color: '#2563eb', flexShrink: 0,
                  }}>{i + 1}</span>
                  {i < workflow.length - 1 && <span style={{ width: 1, flex: 1, background: '#242424', marginTop: 2, marginBottom: 2 }} />}
                </div>
                <p style={{ fontSize: 12, color: '#999', lineHeight: 1.55, paddingBottom: 14 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const right = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {idea && (
        <div>
          <p style={csLabel}>The Idea</p>
          <p style={{ fontSize: 12.5, color: '#bbb', lineHeight: 1.75, marginTop: 10 }}>{idea}</p>
        </div>
      )}
      {concepts && (
        <div>
          <p style={csLabel}>Concepts</p>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {concepts.map((c, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#93b4ff', marginBottom: 4 }}>{c.name}</p>
                <p style={{ fontSize: 12, color: '#999', lineHeight: 1.65 }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {finished && (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10.5, color: '#666' }}>
          <span style={{ color: '#4ade80' }}>●</span>&nbsp; {finished}
        </p>
      )}
      {problem && (
        <blockquote style={{
          margin: 0, borderLeft: '2px solid #2563eb', paddingLeft: 16,
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 14.5, fontStyle: 'italic',
          color: '#ddd', lineHeight: 1.55,
        }}>
          {problem}
        </blockquote>
      )}
      <div style={twoColumn ? { display: 'flex', gap: 40 } : { display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{left}</div>
        <div style={{ flex: 1, minWidth: 0 }}>{right}</div>
      </div>
    </div>
  )
}
