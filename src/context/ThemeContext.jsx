import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

const STORAGE_KEY = 'theme'

// The inline script in index.html has already resolved and stamped the theme
// before React mounts, so read it back off the element rather than resolving a
// second time — that keeps the two from ever disagreeing on the first frame.
const initialTheme = () => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow the OS only for as long as the visitor hasn't made a choice of their
  // own; once they've hit the toggle, that choice is stored and outranks it.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e) => {
      let saved = null
      try {
        saved = localStorage.getItem(STORAGE_KEY)
      } catch {
        // Unreadable storage means no stored preference to honour.
      }
      if (saved !== 'light' && saved !== 'dark') setTheme(e.matches ? 'light' : 'dark')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Only an explicit toggle writes storage. Persisting on mount instead would
  // mean the very first visit records a preference the visitor never expressed,
  // and the OS listener above would then never match again.
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private mode or blocked storage — the theme still applies for this
        // visit, it just won't be remembered on the next one.
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
