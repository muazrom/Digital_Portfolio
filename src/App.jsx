import { useState, useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import BootIntro from './components/BootIntro'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import { isAuthenticated, setAuthenticated } from './admin/auth'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Badges from './components/Badges'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'
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
      {booting && <BootIntro onDone={() => setBooting(false)} />}
      {view === 'admin' ? (
        authed
          ? <AdminDashboard onLogout={handleLogout} />
          : <AdminLogin onSuccess={() => setAuthed(true)} />
      ) : (
        <div className="bg-bg text-white min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
          <ParticleBackground />
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <Section index={2} label="About">
              <About />
            </Section>
            <Section index={3} label="Skills">
              <Skills />
            </Section>
            <Section index={4} label="Projects">
              <Projects />
            </Section>
            <Section index={5} label="Experience">
              <Experience />
            </Section>
            <Section index={6} label="Badges">
              <Badges />
            </Section>
            <Section index={7} label="Contact">
              <Contact />
            </Section>
          </main>
          <Footer />
        </div>
      )}
    </DataProvider>
  )
}
