import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Floating dust/spark particles that drift through the room
export function DustParticles({ count = 300 }) {
  const mesh = useRef()
  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = Math.random() * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26
      speeds[i]  = 0.002 + Math.random() * 0.006
      phases[i]  = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds[i]
      // Drift slightly in x
      pos.array[i * 3] += Math.sin(t * 0.3 + phases[i]) * 0.001
      // Reset when particle floats above ceiling
      if (pos.array[i * 3 + 1] > 9.5) {
        pos.array[i * 3 + 1] = 0.1
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry {...geo} />
      <pointsMaterial
        color="#2563eb"
        size={0.025}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Electric arc between two points — drawn as a jagged line
export function ElectricArc({ from, to, segments = 16, intensity = 1 }) {
  const ref = useRef()
  const geo = useMemo(() => buildArc(from, to, segments), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    // Re-jitter the arc every ~6 frames for flicker
    if (Math.floor(clock.getElapsedTime() * 30) % 6 === 0) {
      const newGeo = buildArc(from, to, segments)
      ref.current.geometry.setAttribute(
        'position',
        newGeo.attributes.position,
      )
    }
    ref.current.material.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 8) * 0.3
  })

  return (
    <line ref={ref}>
      <bufferGeometry {...geo} />
      <lineBasicMaterial color="#2563eb" transparent opacity={0.6} linewidth={1} />
    </line>
  )
}

function buildArc(from, to, segments) {
  const points = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = from[0] + (to[0] - from[0]) * t + (Math.random() - 0.5) * 0.3
    const y = from[1] + (to[1] - from[1]) * t + (Math.random() - 0.5) * 0.3
    const z = from[2] + (to[2] - from[2]) * t + (Math.random() - 0.5) * 0.3
    points.push(x, y, z)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return geo
}

// Pulsing glow sphere at a zone anchor
export function GlowOrb({ position, color = '#2563eb', baseIntensity = 1 }) {
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime()
    lightRef.current.intensity = baseIntensity + Math.sin(t * 2.1) * 0.4 + Math.sin(t * 5.3) * 0.15
  })

  return (
    <group position={position}>
      <pointLight ref={lightRef} color={color} intensity={baseIntensity} distance={6} decay={2} />
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

// Ambient arc cluster scattered around the room
export function ArcCluster() {
  const arcs = [
    { from: [-11, 8, -4],  to: [-11, 6, -6]  },
    { from: [11, 7, 2],    to: [11, 5, 4]    },
    { from: [-3, 9.5, -8], to: [3, 9.5, -8]  },
    { from: [0, 9.5, 0],   to: [2, 7, 0]     },
    { from: [-8, 9, -10],  to: [-6, 7, -10]  },
    { from: [8, 8, -10],   to: [6, 6, -10]   },
  ]

  return (
    <group>
      {arcs.map((arc, i) => (
        <ElectricArc key={i} from={arc.from} to={arc.to} segments={12} />
      ))}
    </group>
  )
}
