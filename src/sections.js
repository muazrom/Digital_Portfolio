import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Contact from './components/Contact'

// The one place section order, numbering, and nav labels are defined.
// Hero is 01 and lives outside this list, so a section's number is its index + 2.
// `id` is the anchor target AND what Navbar's scroll-spy observes — components
// receive it as a prop rather than hardcoding it, so the two can never disagree.
export const sections = [
  { id: 'about', label: 'About', Component: About },
  { id: 'skills', label: 'Skills', Component: Skills },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'experience', label: 'Experience', Component: Experience },
  { id: 'certifications', label: 'Certifications', Component: Certifications },
  { id: 'contact', label: 'Contact', Component: Contact },
]

export const sectionNumber = (i) => String(i + 2).padStart(2, '0')
