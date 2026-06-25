import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── ZONE 01: HERO HOLOGRAM ─────────────────────────────────────────────────
export function HeroHologram({ position = [0, 0, 2] }) {
  const innerRingRef = useRef()
  const outerRingRef = useRef()
  const coreRef = useRef()
  const barsRef = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (innerRingRef.current) innerRingRef.current.rotation.y = t * 0.8
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.5
      outerRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.15
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.2
      const s = 1 + Math.sin(t * 2) * 0.06
      coreRef.current.scale.set(s, s, s)
    }
    barsRef.current.forEach((bar, i) => {
      if (!bar) return
      const phase = (t * 1.5 + i * 0.8) % (Math.PI * 2)
      bar.scale.y = 0.4 + Math.abs(Math.sin(phase)) * 1.4
      bar.material.opacity = 0.2 + Math.abs(Math.sin(phase)) * 0.5
    })
  })

  const barAngles = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

  return (
    <group position={position}>
      {/* Floor glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.4, 64]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={1.5}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Holographic bars around perimeter */}
      {barAngles.map((angle, i) => (
        <mesh
          key={i}
          ref={el => (barsRef.current[i] = el)}
          position={[Math.cos(angle) * 1.1, 1, Math.sin(angle) * 1.1]}
        >
          <boxGeometry args={[0.04, 2, 0.04]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={3}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Inner rotating torus */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.8, 0.015, 8, 64]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer torus */}
      <mesh ref={outerRingRef} position={[0, 1.5, 0]}>
        <torusGeometry args={[1.0, 0.012, 8, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Core octahedron */}
      <mesh ref={coreRef} position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={5}
          wireframe
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight position={[0, 2, 0]} color="#2563eb" intensity={25} distance={8} decay={2} />

      {/* Info card */}
      <Html
        position={[0, 3.4, 0]}
        center
        distanceFactor={6}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          textAlign: 'center',
          color: '#93c5fd',
          textShadow: '0 0 12px #2563eb',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>
            MUAZ ARIEF
          </div>
          <div style={{ fontSize: 10, color: '#60a5fa', letterSpacing: '0.3em', opacity: 0.8 }}>
            FULLSTACK DEV · DESKTOP SUPPORT INTERN
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─── ZONE 02: ABOUT TERMINAL ─────────────────────────────────────────────────
const ABOUT_LINES = [
  '> SUBJECT: MUAZ ARIEF',
  '> STATUS:  STUDENT · INTERN @ IFAST',
  '> STACK:   JS · REACT · NODE · SQL',
  '> FIELD:   FULLSTACK ENGINEERING',
  '',
  '> I build things that work.',
  '> Obsessed with clean systems,',
  '> dark UIs, and shipping real product.',
  '',
  '> Currently breaking things at iFast',
  '> Global Hub AI as Desktop Support',
  '> and assembling new artifacts here.',
]

export function AboutKiosk({ position = [-10, 1.5, 0] }) {
  const screenRef = useRef()
  const scanRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 1.8) * 0.1
    }
    if (scanRef.current) {
      scanRef.current.position.y = ((t * 0.4) % 1.4) - 0.7
    }
  })

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Terminal body */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[2.4, 1.8, 0.18]} />
        <meshStandardMaterial color="#0a0c18" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.1, -0.02]}>
        <boxGeometry args={[2.1, 1.45, 0.04]} />
        <meshStandardMaterial color="#060810" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Screen emissive surface */}
      <mesh ref={screenRef} position={[0, 0.1, 0.01]}>
        <planeGeometry args={[1.9, 1.28]} />
        <meshStandardMaterial
          color="#020510"
          emissive="#0a1a40"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[1.9, 0.015]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Neon frame */}
      {[[-0.98, 0.1], [0.98, 0.1]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.02]}>
          <boxGeometry args={[0.025, 1.32, 0.025]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#2563eb"
            emissiveIntensity={4}
          />
        </mesh>
      ))}
      {[[-0.05, 0.78], [-0.05, -0.58]].map(([y, yy], i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[1.96, 0.025, 0.025]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#2563eb"
            emissiveIntensity={4}
          />
        </mesh>
      ))}

      {/* Keyboard strip */}
      <mesh position={[0, -0.72, -0.05]}>
        <boxGeometry args={[1.8, 0.18, 0.08]} />
        <meshStandardMaterial color="#080a14" roughness={0.9} metalness={0.4} />
      </mesh>

      {/* Screen content via Html */}
      <Html
        position={[0, 0.1, 0.03]}
        transform
        distanceFactor={1}
        style={{ pointerEvents: 'none', userSelect: 'none', width: 340, overflow: 'hidden' }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#4ade80',
          padding: '8px 12px',
          lineHeight: 1.65,
          textShadow: '0 0 6px #22c55e',
          letterSpacing: '0.05em',
        }}>
          {ABOUT_LINES.map((line, i) => (
            <div key={i} style={{ opacity: line === '' ? 0.3 : 1 }}>{line || '·'}</div>
          ))}
        </div>
      </Html>

      {/* Zone light */}
      <pointLight position={[2, 1, 0]} color="#2563eb" intensity={20} distance={8} decay={2} />
    </group>
  )
}

// ─── ZONE 03: SKILLS PEGBOARD ────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    category: 'FRONTEND',
    color: '#3b82f6',
    skills: ['React', 'Next.js', 'Three.js', 'TailwindCSS', 'TypeScript'],
  },
  {
    category: 'BACKEND',
    color: '#22d3ee',
    skills: ['Node.js', 'Express', 'REST APIs', 'SQL', 'PostgreSQL'],
  },
  {
    category: 'TOOLS',
    color: '#a78bfa',
    skills: ['Git', 'Docker', 'Vite', 'Linux', 'Cloudflare'],
  },
]

export function SkillsPegboard({ position = [10, 2, -1] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      {/* Pegboard panel */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[3.8, 3.2, 0.1]} />
        <meshStandardMaterial color="#06080f" roughness={0.9} metalness={0.3} />
      </mesh>

      {/* Peg holes grid */}
      <PegHoles />

      {/* Header */}
      <mesh position={[0, 1.78, 0.02]}>
        <boxGeometry args={[3.6, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={5}
        />
      </mesh>

      {/* Skill groups */}
      {SKILL_GROUPS.map((group, gi) => (
        <SkillGroup
          key={gi}
          group={group}
          offsetX={(gi - 1) * 1.2}
          offsetY={0.2}
        />
      ))}

      {/* Zone light */}
      <pointLight position={[-2, 1, 0]} color="#3b82f6" intensity={20} distance={8} decay={2} />

      {/* Header Html */}
      <Html
        position={[0, 1.9, 0.05]}
        center
        distanceFactor={5}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: '#93c5fd',
          letterSpacing: '0.3em',
          textShadow: '0 0 8px #2563eb',
          whiteSpace: 'nowrap',
        }}>
          // ARSENAL · TECH STACK
        </div>
      </Html>
    </group>
  )
}

function SkillGroup({ group, offsetX, offsetY }) {
  return (
    <group position={[offsetX, offsetY, 0.02]}>
      {/* Category label line */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.9, 0.025, 0.015]} />
        <meshStandardMaterial
          color={group.color}
          emissive={group.color}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Category Html */}
      <Html
        position={[0, 1.48, 0.05]}
        center
        distanceFactor={5}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          color: group.color,
          letterSpacing: '0.2em',
          textShadow: `0 0 8px ${group.color}`,
          whiteSpace: 'nowrap',
        }}>
          {group.category}
        </div>
      </Html>

      {/* Skill tags */}
      {group.skills.map((skill, si) => (
        <SkillTag key={si} skill={skill} color={group.color} y={1.05 - si * 0.44} />
      ))}
    </group>
  )
}

function SkillTag({ skill, color, y }) {
  const tagRef = useRef()

  useFrame(({ clock }) => {
    if (!tagRef.current) return
    const t = clock.getElapsedTime()
    tagRef.current.material.emissiveIntensity = 0.6 + Math.sin(t * 1.2 + y) * 0.2
  })

  return (
    <group position={[0, y, 0]}>
      {/* Tag background */}
      <mesh ref={tagRef}>
        <boxGeometry args={[0.82, 0.3, 0.03]} />
        <meshStandardMaterial
          color="#050810"
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* Tag border */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.84, 0.31, 0.004]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      {/* Skill text */}
      <Html
        position={[0, 0, 0.02]}
        center
        distanceFactor={5}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          color: '#e2e8f0',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          textShadow: `0 0 6px ${color}`,
        }}>
          {skill}
        </div>
      </Html>
    </group>
  )
}

function PegHoles() {
  const holes = []
  for (let r = -3; r <= 3; r++) {
    for (let c = -7; c <= 7; c++) {
      holes.push([c * 0.25, r * 0.25])
    }
  }
  return (
    <group position={[0, 0, -0.025]}>
      {holes.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <circleGeometry args={[0.025, 6]} />
          <meshStandardMaterial color="#0a0c1a" />
        </mesh>
      ))}
    </group>
  )
}
