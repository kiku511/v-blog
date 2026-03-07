import { FileIcon, SearchIcon, PersonIcon, SettingsIcon } from './Icons'

type SidebarView = 'explorer' | 'search'
type Props = {
  sidebarView: SidebarView
  onSidebarView: (v: SidebarView) => void
  onPaletteClick: () => void
}

export function ActivityBar({ sidebarView, onSidebarView, onPaletteClick }: Props) {
  return (
    <div className="activitybar">
      <div
        className={`act-icon${sidebarView === 'explorer' ? ' active' : ''}`}
        onClick={() => onSidebarView('explorer')}
        style={{ cursor: 'pointer' }}
        title="Explorer"
      >
        <FileIcon />
      </div>
      <div
        className={`act-icon${sidebarView === 'search' ? ' active' : ''}`}
        onClick={() => onSidebarView('search')}
        style={{ cursor: 'pointer' }}
        title="Search"
      >
        <SearchIcon />
      </div>
      <a
        className="act-icon"
        href="https://www.linkedin.com/in/vanshgambhir/"
        target="_blank"
        rel="noreferrer"
        title="LinkedIn"
      >
        <PersonIcon />
      </a>
      <div className="act-icon settings" onClick={onPaletteClick} style={{ cursor: 'pointer' }} title="Command Palette">
        <SettingsIcon />
      </div>
    </div>
  )
}
