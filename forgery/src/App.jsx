import { useState } from 'react'
import BootScene from './scenes/BootScene'
import ForgeryCavas from './scenes/ForgeryCanvas'

export default function App() {
  // 'boot' → 'entering' → 'inside'
  const [phase, setPhase] = useState('boot')

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      {phase !== 'inside' && (
        <BootScene phase={phase} onEnter={() => setPhase('entering')} onInside={() => setPhase('inside')} />
      )}
      {phase === 'inside' && <ForgeryCavas />}
    </div>
  )
}
