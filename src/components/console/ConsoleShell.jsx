import StatusBar from './StatusBar'
import NavRail from './NavRail'

// Console frame: fixed status strip across the top, device tree down the left,
// panel column in the remaining space. Under 900px the rail becomes a bottom tab
// bar (see globals.css) and the panel column goes full width.
export default function ConsoleShell({ children }) {
  return (
    <div className="console-root">
      <StatusBar />
      <NavRail />
      <main className="console-main">{children}</main>
    </div>
  )
}
