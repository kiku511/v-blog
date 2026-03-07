import { FileIcon, SearchIcon, PersonIcon, SettingsIcon } from './Icons'

type SidebarView = 'explorer' | 'search'
type Props = {
  sidebarView: SidebarView
  onSidebarView: (v: SidebarView) => void
  onPaletteClick: () => void
}

export function ActivityBar({ sidebarView, onSidebarView, onPaletteClick }: Props) {
  return (
    <nav className="activitybar" aria-label="Activity Bar">
      <button
        className={`act-icon${sidebarView === 'explorer' ? ' active' : ''}`}
        onClick={() => onSidebarView('explorer')}
        aria-label="Explorer"
        aria-pressed={sidebarView === 'explorer'}
      >
        <FileIcon aria-hidden="true" />
      </button>
      <button
        className={`act-icon${sidebarView === 'search' ? ' active' : ''}`}
        onClick={() => onSidebarView('search')}
        aria-label="Search"
        aria-pressed={sidebarView === 'search'}
      >
        <SearchIcon aria-hidden="true" />
      </button>
      <a
        className="act-icon"
        href="https://www.linkedin.com/in/vanshgambhir/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn profile (opens in new tab)"
      >
        <PersonIcon aria-hidden="true" />
      </a>
      <button
        className="act-icon settings"
        onClick={onPaletteClick}
        aria-label="Command Palette"
      >
        <SettingsIcon aria-hidden="true" />
      </button>
    </nav>
  )
}
