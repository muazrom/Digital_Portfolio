import { useEffect, useState } from 'react'
import { useData } from '../../context/DataContext'
import { SeverityDot } from './widgets'

// Everything on this bar is genuinely live: the clock is the visitor's clock and
// the uptime is how long this session has been open. Nothing is simulated.
const pad = (n) => String(n).padStart(2, '0')

function useSessionUptime() {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => setSecs(Math.floor((Date.now() - t0) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${pad(h)}:${pad(m)}:${pad(secs % 60)}`
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function Cell({ label, value, color = '#b0b0b0', hideOnNarrow = false }) {
  return (
    <div className={`console-status-cell${hideOnNarrow ? ' console-status-optional' : ''}`}>
      <span className="console-status-label">{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  )
}

export default function StatusBar() {
  const { data } = useData()
  const uptime = useSessionUptime()
  const clock = useClock()

  return (
    <div className="console-statusbar font-mono">
      <div className="console-status-host">
        <SeverityDot sev="ok" size={6} />
        <span style={{ color: '#8a8a8a' }}>muaz</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>rom</span>
        <span style={{ color: '#2563eb', fontWeight: 600 }}>.my</span>
      </div>

      <div className="console-status-cells">
        <Cell label="STATUS" value={data.hero.status} color="#d0d0d0" />
        <Cell label="SITE" value={data.hero.location} hideOnNarrow />
        <Cell label="UPTIME" value={uptime} color="#22c55e" hideOnNarrow />
        <Cell label="TIME" value={clock} hideOnNarrow />
      </div>
    </div>
  )
}
