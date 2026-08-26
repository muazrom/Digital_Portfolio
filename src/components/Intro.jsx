import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import CountUp from './CountUp'
import { writeupActivity } from '../lib/metrics'

function Stat({ label, value, delay }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
        <CountUp to={value} delay={delay} />
      </div>
      <div className="font-mono" style={{ fontSize: 10, color: '#777', letterSpacing: '0.15em', marginTop: 8, textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

export default function Intro({ onDone }) {
  const { data } = useData()
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  // The three counts a visitor can go and verify for themselves further down
  // the page: the Credentials rack, the Field Notes list, and Projects.
  const moduleCount = data.credentials.length
  const writeupCount = writeupActivity().total
  const projectCount = data.projects.length

  const finish = () => {
    setFading(true)
    setTimeout(onDone, 500)
  }

  useEffect(() => {
    const tIn = setTimeout(() => setVisible(true), 50)
    const tOut = setTimeout(finish, 3000)
    return () => { clearTimeout(tIn); clearTimeout(tOut) }
  }, [])

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030303',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Radial glow — matches Hero */}
      <div className="absolute inset-0 pointer-events-none" style={{ position: 'absolute' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900, height: 900, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)',
        }} />
      </div>

      <div style={{
        position: 'relative', textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <span className="font-mono" style={{
          fontSize: 11, color: '#2563eb', letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}>
          Portfolio Snapshot
        </span>

        <div style={{
          display: 'flex', gap: 'clamp(28px, 8vw, 64px)',
          marginTop: 28, marginBottom: 28,
        }}>
          <Stat label="Modules" value={moduleCount} delay={200} />
          <Stat label="Write-ups" value={writeupCount} delay={350} />
          <Stat label="Projects" value={projectCount} delay={500} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.8)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span className="font-mono" style={{ fontSize: 12, color: '#b8b8b8' }}>
            {data.hero.status}
          </span>
        </div>
      </div>
    </div>
  )
}
