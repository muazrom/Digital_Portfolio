import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import FieldNotes from './components/FieldNotes'
import Contact from './components/Contact'
import { publishedWriteups } from './content/writeups'

// The one place section order, numbering, and nav labels are defined.
// Hero is 01 and lives outside this list, so a section's number is its index + 2.
// `id` is the anchor target AND what Navbar's scroll-spy observes — components
// receive it as a prop rather than hardcoding it, so the two can never disagree.
//
// Order is the argument: network security evidence comes before any software
// project, so a visitor reaches the certification route before the React apps.
//
// `enabled` is optional. A section whose component would render nothing must be
// excluded here rather than returning null, or it still consumes a number, a
// divider, and a dead nav link pointing at an id that never mounts.
const allSections = [
  { id: 'about', label: 'About', Component: About },
  { id: 'skills', label: 'Skills', Component: Skills },
  { id: 'certifications', label: 'Certifications', Component: Certifications },
  { id: 'fieldnotes', label: 'Field Notes', Component: FieldNotes, enabled: () => publishedWriteups().length > 0 },
  { id: 'experience', label: 'Experience', Component: Experience },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'contact', label: 'Contact', Component: Contact },
]

export const sections = allSections.filter(s => !s.enabled || s.enabled())

export const sectionNumber = (i) => String(i + 2).padStart(2, '0')
