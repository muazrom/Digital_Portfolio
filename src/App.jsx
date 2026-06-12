import { useState, useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import { isAuthenticated, setAuthenticated } from './admin/auth'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

function getView() {
  return window.location.hash.startsWith('#admin') ? 'admin' : 'public'
}

export default function App() {
  const [view, setView] = useState(getView)
  const [authed, setAuthed] = useState(isAuthenticated)

  useEffect(() => {
    const onHashChange = () => {
      const next = getView()
      // Always require login fresh when navigating to admin
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
      {view === 'admin' ? (
        authed
          ? <AdminDashboard onLogout={handleLogout} />
          : <AdminLogin onSuccess={() => setAuthed(true)} />
      ) : (
        <div className="bg-bg text-white min-h-screen">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </DataProvider>
  )
}
