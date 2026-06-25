import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { ZONES, SCROLL_KEYFRAMES } from '../utils/zones'

gsap.registerPlugin(ScrollTrigger)

export function useScrollCamera(scrollContainerRef) {
  const { camera } = useThree()
  const progress = useRef(0)
  const camPos = useRef(new THREE.Vector3(...ZONES.entry.camera.pos))
  const camTarget = useRef(new THREE.Vector3(...ZONES.entry.camera.target))
  const lerpPos = useRef(new THREE.Vector3(...ZONES.entry.camera.pos))
  const lerpTarget = useRef(new THREE.Vector3(...ZONES.entry.camera.target))

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const totalZones = SCROLL_KEYFRAMES.length - 1

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress * totalZones
        const fromIdx = Math.floor(p)
        const toIdx = Math.min(fromIdx + 1, totalZones)
        const t = p - fromIdx

        const fromKey = SCROLL_KEYFRAMES[fromIdx]
        const toKey = SCROLL_KEYFRAMES[toIdx]
        const from = ZONES[fromKey].camera
        const to = ZONES[toKey].camera

        // Smooth eased interpolation between keyframes
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

        camPos.current.set(
          from.pos[0] + (to.pos[0] - from.pos[0]) * ease,
          from.pos[1] + (to.pos[1] - from.pos[1]) * ease,
          from.pos[2] + (to.pos[2] - from.pos[2]) * ease,
        )
        camTarget.current.set(
          from.target[0] + (to.target[0] - from.target[0]) * ease,
          from.target[1] + (to.target[1] - from.target[1]) * ease,
          from.target[2] + (to.target[2] - from.target[2]) * ease,
        )
      },
    })

    return () => st.kill()
  }, [])

  useFrame(() => {
    // Lerp camera smoothly toward the scroll-driven target
    lerpPos.current.lerp(camPos.current, 0.06)
    lerpTarget.current.lerp(camTarget.current, 0.06)
    camera.position.copy(lerpPos.current)
    camera.lookAt(lerpTarget.current)
  })
}
