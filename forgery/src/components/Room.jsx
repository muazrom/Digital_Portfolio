import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Room dimensions
const W = 24, H = 10, D = 28

export default function Room() {
  return (
    <group>
      <color attach="background" args={['#03040f']} />
      <Floor />
      <Ceiling />
      <WallNorth />
      <WallSouth />
      <WallEast />
      <WallWest />
      <LightingRig />
      <FloorGrid />
      <CeilingConduits />
    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[W, D, 24, 28]} />
      <meshStandardMaterial color="#0a0c1a" roughness={0.85} metalness={0.3} />
    </mesh>
  )
}

function FloorGrid() {
  const grid = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const lines = []
    const step = 2

    for (let x = -W / 2; x <= W / 2; x += step) {
      lines.push(x, 0.005, -D / 2, x, 0.005, D / 2)
    }
    for (let z = -D / 2; z <= D / 2; z += step) {
      lines.push(-W / 2, 0.005, z, W / 2, 0.005, z)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
    return geometry
  }, [])

  return (
    <lineSegments geometry={grid}>
      <lineBasicMaterial color="#111a2e" transparent opacity={0.6} />
    </lineSegments>
  )
}

function Ceiling() {
  return (
    <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[W, D]} />
      <meshStandardMaterial color="#060810" roughness={1} metalness={0} />
    </mesh>
  )
}

function WallNorth() {
  return (
    <mesh position={[0, H / 2, -D / 2]}>
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial color="#0c0e1e" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

function WallSouth() {
  // South wall has the door opening — split into two panels
  const panelW = (W - 4) / 2
  return (
    <group position={[0, H / 2, D / 2]}>
      <mesh position={[-(panelW / 2 + 2), 0, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[panelW, H]} />
        <meshStandardMaterial color="#0c0e1e" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[(panelW / 2 + 2), 0, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[panelW, H]} />
        <meshStandardMaterial color="#0c0e1e" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}

function WallEast() {
  return (
    <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[D, H]} />
      <meshStandardMaterial color="#07091a" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

function WallWest() {
  return (
    <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[D, H]} />
      <meshStandardMaterial color="#07091a" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

function LightingRig() {
  return (
    <group>
      {/* Ambient fill — bright enough to see room structure */}
      <ambientLight intensity={4} color="#1a2040" />

      {/* White fill so nothing is pitch black */}
      <directionalLight position={[0, 8, 4]} intensity={1.5} color="#ffffff" />

      {/* Entry glow — strong blue near the south door */}
      <pointLight position={[0, 5, 11]} color="#2563eb" intensity={60} distance={22} decay={2} />

      {/* Zone accent lights */}
      <pointLight position={[0, 5, 2]}    color="#2563eb" intensity={40} distance={16} decay={2} />
      <pointLight position={[-9, 5, 0]}   color="#3b82f6" intensity={35} distance={14} decay={2} />
      <pointLight position={[9, 5, -1]}   color="#3b82f6" intensity={35} distance={14} decay={2} />
      <pointLight position={[6, 5, -9]}   color="#2563eb" intensity={35} distance={14} decay={2} />
      <pointLight position={[-6, 5, -9]}  color="#2563eb" intensity={35} distance={14} decay={2} />
      <pointLight position={[0, 8, -10]}  color="#60a5fa" intensity={45} distance={18} decay={2} />
      <pointLight position={[0, 5, -11]}  color="#2563eb" intensity={35} distance={14} decay={2} />

      {/* Ceiling strip lights */}
      <StripLight z={-10} />
      <StripLight z={0} />
      <StripLight z={9} />
    </group>
  )
}

function StripLight({ z }) {
  return (
    <mesh position={[0, H - 0.05, z]}>
      <boxGeometry args={[W * 0.6, 0.05, 0.1]} />
      <meshStandardMaterial
        color="#2563eb"
        emissive="#2563eb"
        emissiveIntensity={8}
        transparent
        opacity={0.95}
      />
    </mesh>
  )
}

function CeilingConduits() {
  const positions = [
    [-6, H - 0.3, 0], [6, H - 0.3, 0],
    [-6, H - 0.3, -8], [6, H - 0.3, -8],
    [0, H - 0.3, -10],
  ]
  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.15, 0.15, D * 0.7]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
