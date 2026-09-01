import { useData } from '../../context/DataContext'
import { kindMeta } from '../Credentials'
import {
  credentialStats, skillStats, projectStats, experienceStats,
  writeupActivity, stage1Readiness, STAGE1_TARGET, KIND_ORDER,
} from '../../lib/metrics'
import { Metric, StackBar, Meter, Chip, SeverityDot, SEV } from './widgets'
import TerminalButton from './TerminalButton'

// The console's home screen: who this is, then the four numbers that summarise
// the site, then two readouts breaking those numbers down. Every figure here is
// a count of something a visitor can scroll down and verify — see lib/metrics.js.

function Card({ title, children, right }) {
  return (
    <div style={{
      background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: 6,
      padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 11, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="font-mono" style={{ fontSize: 9, color: '#5c5c5c', letterSpacing: '0.14em' }}>
          {title}
        </span>
        {right && <span className="font-mono" style={{ fontSize: 9, color: '#4a4a4a', marginLeft: 'auto' }}>{right}</span>}
      </div>
      {children}
    </div>
  )
}

export default function Overview() {
  const { data } = useData()
  const h = data.hero
  const creds = credentialStats(data.credentials)
  const skills = skillStats(data.skills)
  const projects = projectStats(data.projects)
  const exp = experienceStats(data.experience)
  const notes = writeupActivity()
  // Strongest group first. skillStats already computes the per-group aggregate;
  // ordering it is a display decision, so it stays here rather than in metrics.
  const capability = [...skills.groups].sort((a, b) => b.strength - a.strength)
  const readiness = stage1Readiness(data)

  // The name carries the visual weight the old Hero monolith did, at a size that
  // still leaves room for a dashboard underneath it.
  const [first, ...rest] = h.name.split(' ')

  const segments = KIND_ORDER
    .filter(k => creds.byKind[k] > 0)
    .map(k => ({ value: creds.byKind[k], color: kindMeta[k].main, label: kindMeta[k].label }))

  return (
    <section id="overview" className="console-panel console-overview">
      <header className="console-panel-head">
        <span className="font-mono console-panel-index">01</span>
        <span className="console-panel-sep" />
        <SeverityDot sev="ok" size={6} />
        <h2 className="font-mono console-panel-title">Overview</h2>
        <span className="font-mono console-panel-meta">{h.university}</span>
      </header>

      <div className="console-panel-body">
        {/* identity */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <h1 className="font-display glow-text" style={{
              fontSize: 'clamp(30px, 5.4vw, 52px)', fontWeight: 700,
              lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 10,
            }}>
              {first} {rest.join(' ')}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
              {h.title.split(' · ').map((part) => (
                <Chip key={part} color={SEV.link}>{part}</Chip>
              ))}
            </div>

            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.75,
              color: '#9d9d9d', maxWidth: 560, marginBottom: 18,
            }}>
              {h.bio}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <TerminalButton href="#fieldnotes" primary>FIELD NOTES</TerminalButton>
              <TerminalButton href="#contact">CONTACT</TerminalButton>
              <TerminalButton href="/resume.pdf" external>RESUME</TerminalButton>
            </div>
          </div>

          {/* current assignment — the one genuinely "live" fact about me */}
          <div style={{
            flex: '0 1 250px', minWidth: 210,
            background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: 6, padding: '13px 15px',
          }}>
            <div className="font-mono" style={{ fontSize: 9, color: '#5c5c5c', letterSpacing: '0.14em', marginBottom: 11 }}>
              CURRENT ASSIGNMENT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <SeverityDot sev="ok" size={6} />
              <span className="font-mono" style={{ fontSize: 11.5, color: '#dcdcdc' }}>{h.status}</span>
            </div>
            <div className="font-mono" style={{ fontSize: 10.5, color: '#6f6f6f', lineHeight: 1.9 }}>
              <div>{h.location}</div>
              <div>{h.university}</div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="console-kpi-row">
          <Metric label="Credentials" value={creds.total} delay={100} />
          <Metric label="Write-ups" value={notes.total} delay={200} />
          <Metric label="Projects" value={projects.total} delay={300} />
          <Metric label="Skills tracked" value={skills.toolCount} delay={400} />
          <Metric label="Roles held" value={exp.total} delay={500} />
        </div>

        {/* breakdowns */}
        <div className="console-overview-grid">
          <Card title="CREDENTIALS BY KIND" right={`${creds.verifiable}/${creds.total} verifiable`}>
            <StackBar segments={segments} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {segments.map(s => (
                <span key={s.label} className="font-mono" style={{
                  fontSize: 9.5, color: '#8a8a8a', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: s.color }} />
                  {s.label} {s.value}
                </span>
              ))}
            </div>
            <p className="font-mono" style={{ fontSize: 9.5, color: '#565656', lineHeight: 1.6 }}>
              Verifiable = has a public link someone else can check.
            </p>
          </Card>

          <Card title="CAPABILITY" right={`${skills.groups.length} groups · ${skills.toolCount} tools`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {capability.map((g) => (
                <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span className="font-mono" style={{
                      fontSize: 9.5, color: '#9a9a9a', flex: 1, minWidth: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {g.label}
                    </span>
                    <span className="font-mono" style={{ fontSize: 9.5, color: '#dcdcdc' }}>{g.count}</span>
                  </div>
                  <Meter value={g.strength} height={3} />
                </div>
              ))}
            </div>
            <p className="font-mono" style={{ fontSize: 9.5, color: '#565656', lineHeight: 1.6 }}>
              Bar is the mean tool level in each group, on the same 1–3 scale the
              Skills panel prints per tool.
            </p>
          </Card>

          <Card title="STAGE 1 READINESS" right={STAGE1_TARGET}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readiness.map((r) => (
                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <SeverityDot sev={r.done ? 'ok' : 'idle'} size={5} steady />
                    <span className="font-mono" style={{
                      fontSize: 9.5, color: '#9a9a9a', flex: 1, minWidth: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {r.label}
                    </span>
                    <span className="font-mono" style={{ fontSize: 9.5, color: r.done ? '#dcdcdc' : '#6f6f6f' }}>
                      {r.target ? `${r.held}/${r.target}` : r.detail}
                    </span>
                  </div>
                  {/* Exam code on its own line — appended to the label it
                      overruns the column and truncates mid-word. */}
                  {r.code && (
                    <span className="font-mono" style={{ fontSize: 8.5, color: '#4f4f4f', paddingLeft: 13 }}>
                      {r.code}
                    </span>
                  )}
                  {r.target && <Meter value={r.held / r.target} height={3} />}
                </div>
              ))}
            </div>
            <p className="font-mono" style={{ fontSize: 9.5, color: '#565656', lineHeight: 1.6 }}>
              What I want to be holding walking into the first network role.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
