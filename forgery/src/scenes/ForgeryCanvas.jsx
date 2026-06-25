import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Stage 1 placeholder — the room interior will be built in Stage 2
export default function ForgeryCanvas() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 2, 2]} color="#2563eb" intensity={2} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#2563eb" wireframe />
        </mesh>
        <OrbitControls />
      </Canvas>
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: '#2563eb44', letterSpacing: '0.2em',
      }}>
        // STAGE 2 — ROOM ARCHITECTURE PENDING
      </div>
    </div>
  )
}
