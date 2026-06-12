import { createContext, useContext, useState, useCallback } from 'react'
import { defaultData } from '../data/defaults'

const STORAGE_KEY = 'portfolio_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return defaultData
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData)

  const update = useCallback((updater) => {
    setData(prev => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  // Hero
  const updateHero = (field, value) =>
    update(d => ({ ...d, hero: { ...d.hero, [field]: value } }))

  // About
  const updateAboutParagraph = (index, value) =>
    update(d => {
      const paragraphs = [...d.about.paragraphs]
      paragraphs[index] = value
      return { ...d, about: { ...d.about, paragraphs } }
    })
  const addAboutParagraph = () =>
    update(d => ({ ...d, about: { ...d.about, paragraphs: [...d.about.paragraphs, ''] } }))
  const removeAboutParagraph = (index) =>
    update(d => {
      const paragraphs = d.about.paragraphs.filter((_, i) => i !== index)
      return { ...d, about: { ...d.about, paragraphs } }
    })
  const updateInfoRow = (index, field, value) =>
    update(d => {
      const info = d.about.info.map((row, i) => i === index ? { ...row, [field]: value } : row)
      return { ...d, about: { ...d.about, info } }
    })
  const updateModule = (index, value) =>
    update(d => {
      const modules = [...d.about.modules]
      modules[index] = value
      return { ...d, about: { ...d.about, modules } }
    })
  const addModule = () =>
    update(d => ({ ...d, about: { ...d.about, modules: [...d.about.modules, ''] } }))
  const removeModule = (index) =>
    update(d => ({ ...d, about: { ...d.about, modules: d.about.modules.filter((_, i) => i !== index) } }))

  // Skills
  const addStation = () =>
    update(d => ({
      ...d,
      skills: [...d.skills, {
        id: `S0${d.skills.length + 1}`, label: 'New Station',
        desc: 'Description', tools: [],
      }],
    }))
  const updateStation = (stationId, field, value) =>
    update(d => ({
      ...d,
      skills: d.skills.map(s => s.id === stationId ? { ...s, [field]: value } : s),
    }))
  const removeStation = (stationId) =>
    update(d => ({ ...d, skills: d.skills.filter(s => s.id !== stationId) }))
  const addTool = (stationId, toolName) =>
    update(d => ({
      ...d,
      skills: d.skills.map(s =>
        s.id === stationId
          ? { ...s, tools: [...s.tools, { name: toolName, level: 1 }] }
          : s
      ),
    }))
  const removeTool = (stationId, toolName) =>
    update(d => ({
      ...d,
      skills: d.skills.map(s =>
        s.id === stationId
          ? { ...s, tools: s.tools.filter(t => t.name !== toolName) }
          : s
      ),
    }))
  const updateToolLevel = (stationId, toolName, level) =>
    update(d => ({
      ...d,
      skills: d.skills.map(s =>
        s.id === stationId
          ? { ...s, tools: s.tools.map(t => t.name === toolName ? { ...t, level } : t) }
          : s
      ),
    }))

  // Projects
  const addProject = (project) =>
    update(d => ({ ...d, projects: [...d.projects, { ...project, id: `p${Date.now()}` }] }))
  const updateProject = (id, field, value) =>
    update(d => ({
      ...d,
      projects: d.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }))
  const removeProject = (id) =>
    update(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }))
  const reorderProjects = (from, to) =>
    update(d => {
      const arr = [...d.projects]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...d, projects: arr }
    })

  // Experience
  const addExperience = (exp) =>
    update(d => ({ ...d, experience: [{ ...exp, id: `e${Date.now()}` }, ...d.experience] }))
  const updateExperience = (id, field, value) =>
    update(d => ({
      ...d,
      experience: d.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  const removeExperience = (id) =>
    update(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }))

  // Badges
  const addBadge = (badge) =>
    update(d => ({ ...d, badges: [...(d.badges || []), { ...badge, id: `b${Date.now()}` }] }))
  const updateBadge = (id, field, value) =>
    update(d => ({ ...d, badges: d.badges.map(b => b.id === id ? { ...b, [field]: value } : b) }))
  const removeBadge = (id) =>
    update(d => ({ ...d, badges: d.badges.filter(b => b.id !== id) }))

  const resetToDefaults = () => {
    saveData(defaultData)
    setData(defaultData)
  }

  return (
    <DataContext.Provider value={{
      data,
      updateHero,
      updateAboutParagraph, addAboutParagraph, removeAboutParagraph,
      updateInfoRow, updateModule, addModule, removeModule,
      addStation, updateStation, removeStation,
      addTool, removeTool, updateToolLevel,
      addProject, updateProject, removeProject, reorderProjects,
      addExperience, updateExperience, removeExperience,
      addBadge, updateBadge, removeBadge,
      resetToDefaults,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
