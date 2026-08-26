import CountUp from '../CountUp'

// Small NMS-style readouts. Every one of these renders a number that came from
// real content — see src/lib/metrics.js. Nothing here fabricates telemetry.

export const SEV = {
  ok:   '#22c55e',
  warn: '#f59e0b',
  crit: '#ef4444',
  idle: '#9ca3af',
  link: '#2563eb',
}

/** Pulsing status LED. `sev` keys into SEV; `steady` disables the pulse. */
export function SeverityDot({ sev = 'ok', size = 6, steady = false, style }) {
  const c = SEV[sev] || SEV.idle
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: c, boxShadow: `0 0 ${size}px ${c}`,
        animation: steady ? undefined : 'led 2s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

/** Big number over a mono caption. The console's primary KPI readout. */
export function Metric({ label, value, unit, delay = 0, accent = '#fff' }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        className="font-display"
        style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700, color: accent, lineHeight: 1 }}
      >
        <CountUp to={value} delay={delay} />
        {unit && <span style={{ fontSize: '0.45em', color: '#666', marginLeft: 4 }}>{unit}</span>}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: 9, color: '#6d6d6d', letterSpacing: '0.14em',
          marginTop: 7, textTransform: 'uppercase', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}
      >
        {label}
      </div>
    </div>
  )
}

/** Horizontal fill bar, 0..1. Used for skill-group aggregates. */
export function Meter({ value, color = SEV.link, height = 4, track = '#1e1e1e' }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div style={{ background: track, borderRadius: 2, height, overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          width: `${pct}%`, height: '100%', background: color,
          boxShadow: `0 0 6px ${color}`, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  )
}

/** Stacked proportion bar: segments = [{ value, color, label }]. */
export function StackBar({ segments, height = 6 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  return (
    <div style={{ display: 'flex', height, borderRadius: 2, overflow: 'hidden', background: '#1e1e1e' }}>
      {segments.map((s, i) => (
        <div
          key={i}
          title={`${s.label}: ${s.value}`}
          style={{ width: `${(s.value / total) * 100}%`, background: s.color, transition: 'width 0.6s ease' }}
        />
      ))}
    </div>
  )
}

/** Bar sparkline over a series of counts. Flat-zero series render as a baseline. */
export function Sparkline({ series, width = 160, height = 30, color = SEV.link }) {
  const max = Math.max(1, ...series)
  const gap = 2
  const barW = series.length ? (width - gap * (series.length - 1)) / series.length : 0
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {series.map((v, i) => {
        const h = Math.max(1, (v / max) * height)
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={height - h}
            width={Math.max(1, barW)}
            height={h}
            rx={1}
            fill={v === 0 ? '#242424' : color}
            opacity={v === 0 ? 1 : 0.55 + 0.45 * (v / max)}
          />
        )
      })}
    </svg>
  )
}

/** Mono key/value line for device-facts style tables. */
export function Field({ label, value, color = '#c4c4c4' }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
      <span style={{ color: '#5c5c5c', letterSpacing: '0.08em', minWidth: 92, flexShrink: 0 }}>{label}</span>
      <span style={{ color, minWidth: 0, overflowWrap: 'anywhere' }}>{value}</span>
    </div>
  )
}

/** Severity-tinted pill. Used for project status and credential kind. */
export function Chip({ children, color = SEV.idle, dot = false }) {
  return (
    <span
      className="font-mono"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        color, border: `1px solid ${color}44`, background: `${color}12`,
        borderRadius: 3, padding: '2px 7px', whiteSpace: 'nowrap',
      }}
    >
      {dot && <SeverityDot sev="ok" size={4} steady style={{ background: color, boxShadow: 'none' }} />}
      {children}
    </span>
  )
}
