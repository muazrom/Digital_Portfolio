import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ZONES } from '../utils/zones'

const ZONE_LABELS = {
  hero:       { label: 'ZONE 01 · ENTRY HOLOGRAM',        color: '#2563eb' },
  about:      { label: 'ZONE 02 · HOLOGRAM TERMINAL',     color: '#3b82f6' },
  skills:     { label: 'ZONE 03 · ARSENAL',               color: '#2563eb' },
  projects:   { label: 'ZONE 04 · ARTIFACT BLUEPRINTS',   color: '#3b82f6' },
  experience: { label: 'ZONE 05 · LOGBOOK',               color: '#2563eb' },
  badges:     { label: 'ZONE 06 · VERIFICATION TOKENS',   color: '#3b82f6' },
  contact:    { label: 'ZONE 07 · TRANSMISSION CHANNEL',  color: '#2563eb' },
}

export default function ZoneMarkers() {
  return (
    <group>
      {Object.entries(ZONE_LABELS).map(([key, { label, color }]) => {
        const anchor = ZONES[key]?.anchor
        if (!anchor) return null
        return (
          <ZoneMarker
            key={key}
            position={anchor}
            label={label}
            color={color}
          />
        )
      })}
    </group>
  )
}

function ZoneMarker({ position, label, color }) {
  const ringRef = useRef()

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.y = clock.getElapsedTime() * 0.4
    ringRef.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.15
  })

  const [x, y, z] = position

  return (
    <group position={[x, y, z]}>
      {/* Rotating ring on the floor */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        transparent
        opacity={0.6}
      >
        {label}
      </Text>
    </group>
  )
}
