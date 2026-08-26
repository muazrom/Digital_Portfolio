import { useData } from '../../context/DataContext'
import { kindMeta } from '../Credentials'
import {
  credentialStats, skillStats, projectStats, experienceStats,
  writeupActivity, KIND_ORDER,
} from '../../lib/metrics'
import { Metric, StackBar, Sparkline, Chip, SeverityDot, SEV } from './widgets'
import TerminalButton from './TerminalButton'

// The console's home screen: who this is, then the four numbers that summarise
// the site, then two readouts breaking those numbers down. Every figure here is
// a count of something a visitor can scroll down and verify — see lib/metrics.js.

const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

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
  const notes = writeupActivity(12)

  // The name carries the visual weight the old Hero monolith did, at a size that
  // still leaves room for a dashboard underneath it.
  const [first, ...rest] = h.name.split(' ')

  const segments = KIND_ORDER
    .filter(k => creds.byKind[k] > 0)
    .map(k => ({ value: creds.byKind[k], color: kindMeta[k].main, label: kindMeta[k].label }))

  const sparkLabels = notes.labels.map((k) => MONTH_INITIALS[Number(k.slice(5)) - 1])

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

          <Card title="WRITE-UP ACTIVITY" right="last 12 months">
            <Sparkline series={notes.series} height={34} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${sparkLabels.length}, 1fr)`,
              marginTop: -4,
            }}>
              {sparkLabels.map((l, i) => (
                <span key={i} className="font-mono" style={{ fontSize: 8, color: '#3f3f3f', textAlign: 'center' }}>{l}</span>
              ))}
            </div>
            <p className="font-mono" style={{ fontSize: 9.5, color: '#565656', lineHeight: 1.6 }}>
              {notes.total} published · latest {notes.latest || '—'}
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
