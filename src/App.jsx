import { useState, useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import Intro from './components/Intro'
import ParticleBackground from './components/ParticleBackground'
import { isAuthenticated, setAuthenticated } from './admin/auth'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ConsoleShell from './components/console/ConsoleShell'
import Panel from './components/console/Panel'
import Overview from './components/console/Overview'
import Footer from './components/Footer'
import WriteupsPage from './pages/WriteupsPage'
import { sections } from './sections'
import { useData } from './context/DataContext'
import { panelMeta } from './lib/metrics'

// Routes live under '#/'. Anything else — '#about', '#credentials', '' — is the
// console view, so native anchor scrolling keeps working untouched.
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
      // Leaving the console should land at the top of the new view, not wherever
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

  if (view === 'admin') {
    return (
      <DataProvider>
        {authed
          ? <AdminDashboard onLogout={handleLogout} />
          : <AdminLogin onSuccess={() => setAuthed(true)} />}
      </DataProvider>
    )
  }

  const isArchive = view === 'writeups' || view === 'writeup'

  return (
    <DataProvider>
      {booting && <Intro onDone={() => setBooting(false)} />}
      <div className="bg-bg text-white min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
        <ParticleBackground />
        <ConsoleShell>
          {isArchive
            ? <WriteupsPage slug={view === 'writeup' ? route.slug : null} />
            : <ConsolePanels />}
          <Footer />
        </ConsoleShell>
      </div>
    </DataProvider>
  )
}

// Separate component so it sits inside DataProvider and can read the counts the
// panel headers report. Same source as the nav rail badges.
function ConsolePanels() {
  const { data } = useData()
  const meta = panelMeta(data)

  return (
    <>
      <Overview />
      {sections.map(({ id, label, icon, Component }, i) => (
        <Panel key={id} id={id} index={i + 2} label={label} icon={icon} meta={meta[id]}>
          <Component />
        </Panel>
      ))}
    </>
  )
}
