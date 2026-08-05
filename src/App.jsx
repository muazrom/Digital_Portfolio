import { useState, useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import Intro from './components/Intro'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import { isAuthenticated, setAuthenticated } from './admin/auth'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'
import { sections, sectionNumber } from './sections'
import { useScrollReveal } from './hooks/useScrollReveal'

function Section({ index, label, children }) {
  const ref = useScrollReveal()
  return (
    <>
      <SectionDivider index={index} label={label} />
      <div ref={ref} className="reveal">
        {children}
      </div>
    </>
  )
}

function getView() {
  return window.location.hash.startsWith('#admin') ? 'admin' : 'public'
}

export default function App() {
  const [booting, setBooting] = useState(() => !window.location.hash.startsWith('#admin'))
  const [view, setView] = useState(getView)
  const [authed, setAuthed] = useState(isAuthenticated)

  useEffect(() => {
    const onHashChange = () => {
      const next = getView()
      if (next === 'admin') {
        setAuthenticated(false)
        setAuthed(false)
      }
      setView(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleLogout = () => {
    setAuthenticated(false)
    setAuthed(false)
    window.location.hash = ''
  }

  return (
    <DataProvider>
      <CustomCursor />
      {booting && <Intro onDone={() => setBooting(false)} />}
      {view === 'admin' ? (
        authed
          ? <AdminDashboard onLogout={handleLogout} />
          : <AdminLogin onSuccess={() => setAuthed(true)} />
      ) : (
        <div className="bg-bg text-white min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
          <ParticleBackground />
          <Navbar />
          <main>
            <Hero />
            {sections.map(({ id, label, Component }, i) => (
              <Section key={id} index={i + 2} label={label}>
                <Component id={id} num={sectionNumber(i)} />
              </Section>
            ))}
          </main>
          <Footer />
        </div>
      )}
    </DataProvider>
  )
}
