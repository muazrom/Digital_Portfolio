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
import WriteupsPage from './pages/WriteupsPage'
import { sections, sectionNumber } from './sections'
import { useScrollReveal } from './hooks/useScrollReveal'

function Section({ index, label, icon, children }) {
  const ref = useScrollReveal()
  return (
    <>
      <SectionDivider index={index} label={label} icon={icon} />
      <div ref={ref} className="reveal">
        {children}
      </div>
    </>
  )
}

// Routes live under '#/'. Anything else — '#about', '#certifications', '' — is the
// one-pager, so native anchor scrolling keeps working untouched.
function getRoute() {
  const hash = window.location.hash
  if (hash.startsWith('#admin')) return { view: 'admin' }
  if (hash.startsWith('#/writeups/')) {
    return { view: 'writeup', slug: decodeURIComponent(hash.slice('#/writeups/'.length)) }
  }
  if (hash === '#/writeups' || hash === '#/writeups/') return { view: 'writeups' }
  return { view: 'public' }
}

export default function App() {
  const [booting, setBooting] = useState(() => getRoute().view === 'public')
  const [route, setRoute] = useState(getRoute)
  const [authed, setAuthed] = useState(isAuthenticated)
  const { view } = route

  useEffect(() => {
    const onHashChange = () => {
      const next = getRoute()
      if (next.view === 'admin') {
        setAuthenticated(false)
        setAuthed(false)
      }
      // Leaving the one-pager should land at the top of the new view, not wherever
      // the reader happened to be scrolled to.
      if (next.view === 'writeups' || next.view === 'writeup') window.scrollTo(0, 0)
      setRoute(next)
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
          {view === 'writeups' || view === 'writeup' ? (
            <main>
              <WriteupsPage slug={view === 'writeup' ? route.slug : null} />
            </main>
          ) : (
            <main>
              <Hero />
              {sections.map(({ id, label, icon, Component }, i) => (
                <Section key={id} index={i + 2} label={label} icon={icon}>
                  <Component id={id} num={sectionNumber(i)} icon={icon} />
                </Section>
              ))}
            </main>
          )}
          <Footer />
        </div>
      )}
    </DataProvider>
  )
}
