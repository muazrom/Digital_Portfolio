import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  { name: 'Noctua',             status: 'DEV',  stack: 'React · Python · LangGraph',   desc: 'AI personal assistant with contextual workflows' },
  { name: 'Manga Tracker',      status: 'DEV',  stack: 'Flutter · Dart · comick.io',    desc: 'Cross-platform manga reading tracker' },
  { name: 'Digital Portfolio',  status: 'LIVE', stack: 'React · Vite · Cloudflare',     desc: 'This site — workshop-themed personal dashboard' },
  { name: 'VISSCO',             status: 'DONE', stack: 'HTML · CSS · JS · SQLite',      desc: 'Web attendance management system' },
  { name: 'Internships Tracker',status: 'DONE', stack: 'Python · JS · HTML · CSS',     desc: 'Personal app to track internship applications' },
  { name: 'Vault',              status: 'DONE', stack: 'React · WebAuthn · AES-256-GCM', desc: 'Zero-knowledge password manager unlocked by passkey/hardware key' },
]

const EXPERIENCE = [
  { role: 'Desktop Support Intern',        org: 'iFast Global Hub AI',  period: 'Jul 2026 –',   type: 'INTERN' },
  { role: 'Vice Secretary',                org: 'Warisan Run',           period: 'May 2026',      type: 'LEAD' },
  { role: 'Head of Logistics & Tech',      org: 'Jelajah Nusantara',     period: 'Nov 2025',      type: 'LEAD' },
  { role: 'Head of Dept & Scenographer',   org: 'Karnival Teater UM',   period: 'Apr 2025 & 26', type: 'LEAD' },
  { role: 'Head of Department',            org: 'Minggu Haluan Siswa',  period: 'Oct 2025',      type: 'LEAD' },
  { role: 'Director',                      org: 'Dayasari Goes Green',  period: 'Feb 2024',      type: 'LEAD' },
]

const BADGES = [
  { name: 'Intro to Cybersecurity', issuer: 'Cisco', year: '2026',     color: '#22d3ee' },
  { name: 'Pre Security Path',      issuer: 'TryHackMe', year: 'Jun 2026', color: '#10b981' },
  { name: 'Pitram Silver Award',    issuer: 'Pitram', year: '2024',     color: '#f59e0b' },
]

const STATUS_COLOR = { DEV: '#f59e0b', LIVE: '#22d3ee', DONE: '#10b981' }
const TYPE_COLOR   = { INTERN: '#22d3ee', LEAD: '#a78bfa' }

// ─── ZONE 04: PROJECTS BLUEPRINT ─────────────────────────────────────────────
export function ProjectsBlueprint({ position = [7, 0, -9] }) {
  const deskRef = useRef()

  useFrame(({ clock }) => {
    if (!deskRef.current) return
    deskRef.current.material.emissiveIntensity = 0.12 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
  })

  return (
    <group position={position} rotation={[0, -0.675, 0]}>
      {/* Legs */}
      {[[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#0d0f1c" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Desk surface */}
      <mesh ref={deskRef} position={[0, 0.86, 0]} rotation={[-Math.PI * 0.18, 0, 0]}>
        <boxGeometry args={[2.2, 0.03, 1.4]} />
        <meshStandardMaterial color="#020b2a" emissive="#0a1a50" emissiveIntensity={0.12} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Blueprint grid overlay */}
      <mesh position={[0, 0.875, 0]} rotation={[-Math.PI * 0.18, 0, 0]}>
        <planeGeometry args={[2.0, 1.25]} />
        <meshStandardMaterial color="#0c1e55" emissive="#0c1e55" emissiveIntensity={0.8} transparent opacity={0.35} wireframe />
      </mesh>

      <pointLight position={[0, 3, 0]} color="#2563eb" intensity={25} distance={8} decay={2} />

      {/* Single Html card for all projects */}
      <Html
        position={[0, 0.9, 0.05]}
        rotation={[-Math.PI * 0.18, 0, 0]}
        transform
        distanceFactor={1}
        style={{ pointerEvents: 'none', userSelect: 'none', width: 360 }}
      >
        <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#93c5fd', padding: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: '#60a5fa', borderBottom: '1px solid #1e3a8a', paddingBottom: 4, marginBottom: 6, textShadow: '0 0 8px #2563eb' }}>
            // ARTIFACT BLUEPRINTS · 6 ENTRIES
          </div>
          {PROJECTS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 7, borderLeft: `2px solid ${STATUS_COLOR[p.status]}`, paddingLeft: 7 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</span>
                  <span style={{ fontSize: 7, padding: '1px 4px', border: `1px solid ${STATUS_COLOR[p.status]}`, color: STATUS_COLOR[p.status], letterSpacing: '0.15em' }}>{p.status}</span>
                </div>
                <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 2 }}>{p.desc}</div>
                <div style={{ fontSize: 7.5, color: '#4a6fa5' }}>{p.stack}</div>
              </div>
            </div>
          ))}
        </div>
      </Html>
    </group>
  )
}

// ─── ZONE 05: EXPERIENCE LOGBOOK ─────────────────────────────────────────────
export function ExperienceLogbook({ position = [-7, 0.5, -9] }) {
  const spineRef = useRef()

  useFrame(({ clock }) => {
    if (!spineRef.current) return
    spineRef.current.material.emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime() * 1.2) * 0.2
  })

  return (
    <group position={position} rotation={[0, 0.675, 0]}>
      {/* Stand */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#0a0c18" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.45, 0.05, 0.28]} />
        <meshStandardMaterial color="#0a0c18" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Book body */}
      <mesh position={[0, 0.6, 0]} rotation={[-Math.PI * 0.12, 0, 0]}>
        <boxGeometry args={[2.0, 0.03, 1.3]} />
        <meshStandardMaterial color="#03061a" emissive="#0a1230" emissiveIntensity={0.08} roughness={0.5} />
      </mesh>

      {/* Spine divider */}
      <mesh ref={spineRef} position={[0, 0.62, 0]} rotation={[-Math.PI * 0.12, 0, 0]}>
        <boxGeometry args={[0.04, 0.06, 1.32]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.6} />
      </mesh>

      <pointLight position={[0, 2, 0]} color="#a78bfa" intensity={20} distance={8} decay={2} />

      {/* Single Html for both pages */}
      <Html
        position={[0, 0.64, 0.08]}
        rotation={[-Math.PI * 0.12, 0, 0]}
        transform
        distanceFactor={1}
        style={{ pointerEvents: 'none', userSelect: 'none', width: 360, display: 'flex', gap: 8 }}
      >
        {/* Left page */}
        <div style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', color: '#e2e8f0' }}>
          <div style={{ fontSize: 8, letterSpacing: '0.2em', color: '#a78bfa', borderBottom: '1px solid #3b2a6e', paddingBottom: 3, marginBottom: 8, textShadow: '0 0 6px #a78bfa' }}>
            // LOGBOOK · I
          </div>
          {EXPERIENCE.slice(0, 3).map((e, i) => (
            <div key={i} style={{ marginBottom: 9, paddingLeft: 6, borderLeft: `2px solid ${TYPE_COLOR[e.type]}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#e2e8f0', marginBottom: 1 }}>{e.role}</div>
              <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 1 }}>{e.org}</div>
              <div style={{ fontSize: 7.5, color: TYPE_COLOR[e.type], letterSpacing: '0.1em' }}>{e.period}</div>
            </div>
          ))}
        </div>
        {/* Right page */}
        <div style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', color: '#e2e8f0' }}>
          <div style={{ fontSize: 8, letterSpacing: '0.2em', color: '#a78bfa', borderBottom: '1px solid #3b2a6e', paddingBottom: 3, marginBottom: 8, textShadow: '0 0 6px #a78bfa' }}>
            // LOGBOOK · II
          </div>
          {EXPERIENCE.slice(3).map((e, i) => (
            <div key={i} style={{ marginBottom: 9, paddingLeft: 6, borderLeft: `2px solid ${TYPE_COLOR[e.type]}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#e2e8f0', marginBottom: 1 }}>{e.role}</div>
              <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 1 }}>{e.org}</div>
              <div style={{ fontSize: 7.5, color: TYPE_COLOR[e.type], letterSpacing: '0.1em' }}>{e.period}</div>
            </div>
          ))}
        </div>
      </Html>
    </group>
  )
}

// ─── ZONE 06: BADGES TOKENS ───────────────────────────────────────────────────
export function BadgesTokens({ position = [0, 7, -10] }) {
  const ringsRef = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ringsRef.current.forEach((mesh, i) => {
      if (!mesh) return
      // Rotate only the 3D torus rim, not the Html
      mesh.rotation.y = t * 0.6 * (i % 2 === 0 ? 1 : -1)
    })
  })

  return (
    <group position={position}>
      {/* Mount bar */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[5.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#1a1f3a" metalness={0.8} roughness={0.3} />
      </mesh>

      <pointLight position={[0, 0, 1]} color="#f59e0b" intensity={20} distance={8} decay={2} />

      {BADGES.map((badge, i) => {
        const x = (i - 1) * 1.8
        const y = -0.4 + (i % 2) * 0.3
        return (
          <group key={i} position={[x, y, 0]}>
            {/* Hanging wire */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 1.0, 4]} />
              <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={1} />
            </mesh>

            {/* Rotating torus rim only */}
            <mesh ref={el => (ringsRef.current[i] = el)}>
              <torusGeometry args={[0.52, 0.028, 6, 6]} />
              <meshStandardMaterial color={badge.color} emissive={badge.color} emissiveIntensity={2} />
            </mesh>

            {/* Static disc face */}
            <mesh>
              <cylinderGeometry args={[0.48, 0.48, 0.07, 6]} />
              <meshStandardMaterial color="#050810" emissive={badge.color} emissiveIntensity={0.15} metalness={0.5} roughness={0.4} />
            </mesh>

            {/* Badge info — static Html, no rotation */}
            <Html
              position={[0, 0, 0.05]}
              center
              distanceFactor={4}
              style={{ pointerEvents: 'none', userSelect: 'none', width: 120 }}
            >
              <div style={{ fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', color: badge.color, textShadow: `0 0 8px ${badge.color}` }}>
                <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 3, letterSpacing: '0.08em' }}>{badge.name}</div>
                <div style={{ fontSize: 7, color: '#94a3b8' }}>{badge.issuer}</div>
                <div style={{ fontSize: 7, marginTop: 2 }}>{badge.year}</div>
              </div>
            </Html>
          </group>
        )
      })}

      {/* Zone header */}
      <Html position={[0, 0.9, 0]} center distanceFactor={6} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: '#fbbf24', textShadow: '0 0 10px #f59e0b', whiteSpace: 'nowrap' }}>
          // VERIFICATION TOKENS
        </div>
      </Html>
    </group>
  )
}

// ─── ZONE 07: CONTACT TERMINAL ───────────────────────────────────────────────
const CONTACT_LINES = [
  { label: 'EMAIL',  value: 'zaumarief08@gmail.com', color: '#22d3ee' },
  { label: 'GITHUB', value: 'github.com/muazrom',    color: '#a78bfa' },
  { label: 'SITE',   value: 'muazrom.my',            color: '#2563eb' },
  { label: 'LOC',    value: 'Kajang, Selangor, MY',  color: '#94a3b8' },
]

export function ContactTerminal({ position = [0, 1, -11] }) {
  const screenRef = useRef()
  const antennaRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (screenRef.current)  screenRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 2.1) * 0.08
    if (antennaRef.current) antennaRef.current.rotation.z = Math.sin(t * 0.4) * 0.06
  })

  return (
    <group position={position}>
      {/* Console body */}
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[2.8, 1.6, 0.3]} />
        <meshStandardMaterial color="#070910" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.15, -0.01]}>
        <boxGeometry args={[2.4, 1.1, 0.04]} />
        <meshStandardMaterial color="#04060e" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Screen surface */}
      <mesh ref={screenRef} position={[0, 0.15, 0.02]}>
        <planeGeometry args={[2.18, 0.96]} />
        <meshStandardMaterial color="#010410" emissive="#071230" emissiveIntensity={0.4} />
      </mesh>

      {/* Blue frame edges — 4 strips */}
      {[
        [0,     0.64,  0.03, [2.22, 0.03, 0.02]],
        [0,    -0.34,  0.03, [2.22, 0.03, 0.02]],
        [-1.12, 0.15,  0.03, [0.025, 1.0, 0.02]],
        [ 1.12, 0.15,  0.03, [0.025, 1.0, 0.02]],
      ].map(([x, y, z, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={d} />
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={5} />
        </mesh>
      ))}

      {/* Antenna */}
      <mesh ref={antennaRef} position={[0.9, 1.0, -0.12]}>
        <cylinderGeometry args={[0.012, 0.018, 0.7, 4]} />
        <meshStandardMaterial color="#1a2040" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.9, 1.36, -0.12]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={6} />
      </mesh>

      {/* Dial row */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((x, i) => (
        <mesh key={i} position={[x, -0.6, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 8]} />
          <meshStandardMaterial color="#0a0e1c" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      <pointLight position={[0, 2, 1]} color="#22d3ee" intensity={25} distance={9} decay={2} />

      {/* Screen content — single Html */}
      <Html
        position={[0, 0.15, 0.04]}
        transform
        distanceFactor={1}
        style={{ pointerEvents: 'none', userSelect: 'none', width: 380 }}
      >
        <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#22d3ee', padding: '10px 14px', textShadow: '0 0 6px #22d3ee' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: '#60a5fa', borderBottom: '1px solid #1e3a8a', paddingBottom: 6, marginBottom: 10 }}>
            TRANSMISSION CHANNEL · OPEN
          </div>
          <div style={{ fontSize: 10, color: '#22d3ee', marginBottom: 10, letterSpacing: '0.1em' }}>
            {'> INITIATE CONTACT SEQUENCE...'}
          </div>
          {CONTACT_LINES.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'baseline' }}>
              <span style={{ fontSize: 8, color: '#475569', letterSpacing: '0.2em', minWidth: 52 }}>{line.label}</span>
              <span style={{ fontSize: 10, color: line.color, letterSpacing: '0.05em', textShadow: `0 0 8px ${line.color}` }}>{line.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, fontSize: 8, color: '#334155', letterSpacing: '0.15em', borderTop: '1px solid #1e293b', paddingTop: 6 }}>
            {'> CHANNEL ONLINE · READY TO RECEIVE'}
          </div>
        </div>
      </Html>
    </group>
  )
}
