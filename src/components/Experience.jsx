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
    period: 'April 2025 & April 2026',
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
  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 05</p>
        <h2 className="section-title mb-12">Experience &amp; Activities</h2>
        <div className="relative border-l border-border pl-8 space-y-10">
          {experiences.map((exp, i) => (
            <div key={i} className="relative group">
              <span className="absolute -left-[2.35rem] top-1 w-3 h-3 rounded-full bg-bg border-2 border-border group-hover:border-accent transition-colors duration-200" />
              <p className="font-mono text-xs text-accent mb-1">{exp.period}</p>
              <h3 className="text-white font-semibold text-base">{exp.role}</h3>
              <p className="text-muted text-sm mb-2 font-mono">{exp.org}</p>
              <p className="text-muted text-sm leading-relaxed">{exp.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
