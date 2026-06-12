import { useRef, useState } from 'react'

const experiences = [
  {
    role: 'Vice Secretary',
    org: 'Warisan Run',
    period: 'May 2026',
    summary: 'Handled administrative tasks including documentation, planning, and resolving internal problems for an event involving 260 participants and 48 committee members.',
  },
  {
    role: 'Head of Logistics & Technical',
    org: 'Jelajah Nusantara International Mobility Programme',
    period: 'Nov 2025',
    summary: 'Led technical and logistics operations for the university\'s international mobility programme to Indonesia. Coordinated equipment, transportation, and technical requirements across international borders.',
  },
  {
    role: 'Head of Department & Scenographer',
    org: 'Pentaz Production — Karnival Teater UM',
    period: 'April 2025 & 2026',
    summary: 'Designed and led full stage sets and props for Karnival Teater Universiti Malaya for two consecutive years. Managed production budget and team coordination — received acknowledgement from the panel of jury.',
  },
  {
    role: 'Head of Department',
    org: 'Minggu Haluan Siswa KK10',
    period: 'Oct 2025',
    summary: 'Managed technical setup and equipment for the university orientation programme serving 300 new students and 50 committee members. Ensured seamless execution of all technical operations.',
  },
  {
    role: 'Assistant',
    org: 'Perisian Huda Sdn Bhd',
    period: 'April 2023',
    summary: 'Assisted in collecting natural data for machine learning and developing the "Mushafi" app. Served as a beta tester and provided user feedback that directly shaped the product.',
  },
]

export default function Experience() {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const scrollTo = (index) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index]
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActive(index)
  }

  const prev = () => scrollTo(Math.max(0, active - 1))
  const next = () => scrollTo(Math.min(experiences.length - 1, active + 1))

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    Array.from(track.children).forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - cardCenter)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActive(closest)
  }

  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />

      <div className="max-w-5xl mx-auto px-6 mb-8">
        <p className="section-number mb-2">// 05</p>
        <div className="flex items-end justify-between">
          <h2 className="section-title">Experience &amp; Activities</h2>
          <div className="flex items-center gap-3">
            <button onClick={prev} disabled={active === 0}
              className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200">
              ←
            </button>
            <span className="font-mono text-xs text-muted">
              {String(active + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
            </span>
            <button onClick={next} disabled={active === experiences.length - 1}
              className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100vw',
          paddingLeft: 'calc((100vw - 960px) / 2 + 24px)',
          paddingRight: 'calc((100vw - 960px) / 2 + 24px)',
        }}
      >
        {experiences.map((exp, i) => (
          <div
            key={i}
            onClick={() => scrollTo(i)}
            className="snap-center shrink-0 w-72 md:w-80 card p-6 flex flex-col gap-3 cursor-pointer"
            style={{
              transition: 'border-color 0.25s, box-shadow 0.25s, opacity 0.25s',
              borderColor: active === i ? 'rgba(37,99,235,0.6)' : undefined,
              boxShadow: active === i ? '0 0 24px rgba(37,99,235,0.12)' : undefined,
              opacity: active === i ? 1 : 0.5,
            }}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-accent">{exp.period}</span>
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base leading-snug mb-1">{exp.role}</h3>
              <p className="font-mono text-xs text-muted">{exp.org}</p>
            </div>
            <p className="text-muted text-sm leading-relaxed">{exp.summary}</p>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {experiences.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="transition-all duration-200"
            style={{
              width: active === i ? '20px' : '6px',
              height: '6px',
              borderRadius: active === i ? '3px' : '50%',
              background: active === i ? '#2563eb' : '#2a2a2a',
            }}
          />
        ))}
      </div>
    </section>
  )
}
