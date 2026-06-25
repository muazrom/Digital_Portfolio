import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Room from '../components/Room'
import ZoneMarkers from '../components/ZoneMarkers'
import { DustParticles, ArcCluster, GlowOrb } from '../components/Atmosphere'
import { HeroHologram, AboutKiosk, SkillsPegboard } from '../components/ZoneContent'
import { useScrollCamera } from '../hooks/useScrollCamera'
import { ZONES } from '../utils/zones'

const SCROLL_HEIGHT = '800vh'

export default function ForgeryCanvas() {
  const scrollRef = useRef(null)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#03040f' }}>

      {/* 3D canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 1.7, 10], fov: 65, near: 0.1, far: 120 }}
          shadows
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <Scene scrollRef={scrollRef} />
        </Canvas>
      </div>

      {/* Transparent scroll capture */}
      <div
        ref={scrollRef}
        className="scroll-capture"
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'scroll',
          zIndex: 10,
          background: 'transparent',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ height: SCROLL_HEIGHT }} />
      </div>

      {/* HUD */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
        <HUD />
      </div>
    </div>
  )
}

function Scene({ scrollRef }) {
  useScrollCamera(scrollRef)

  return (
    <>
      <fog attach="fog" args={['#03040f', 30, 80]} />
      <Room />
      <ZoneMarkers />

      {/* Stage 3: Zone content */}
      <HeroHologram  position={ZONES.hero.anchor} />
      <AboutKiosk    position={ZONES.about.anchor} />
      <SkillsPegboard position={ZONES.skills.anchor} />

      {/* Atmosphere */}
      <DustParticles count={280} />
      <ArcCluster />
      {[
        ZONES.hero.anchor,
        ZONES.about.anchor,
        ZONES.skills.anchor,
        ZONES.projects.anchor,
        ZONES.experience.anchor,
        ZONES.badges.anchor,
        ZONES.contact.anchor,
      ].map((pos, i) => (
        <GlowOrb key={i} position={pos} baseIntensity={0.8} />
      ))}
    </>
  )
}

function HUD() {
  return (
    <>
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(37,99,235,0.5)', letterSpacing: '0.2em',
      }}>
        SCROLL TO TRAVERSE THE FORGERY
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 24,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(37,99,235,0.4)', letterSpacing: '0.1em',
        lineHeight: 2,
      }}>
        {['01 · ENTRY', '02 · ABOUT', '03 · ARSENAL', '04 · BLUEPRINTS',
          '05 · LOGBOOK', '06 · TOKENS', '07 · TRANSMISSION'].map((z, i) => (
          <div key={i}>{z}</div>
        ))}
      </div>
    </>
  )
}
