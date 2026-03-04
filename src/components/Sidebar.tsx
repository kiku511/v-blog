import { TABS, type Tab } from '../config/tabs'
import { FileIcon } from './FileIcon'

type Props = {
  active: Tab
  onSelect: (tab: Tab) => void
  isOpen: boolean
  onClose: () => void
  onThemeClick: () => void
}

export function Sidebar({ active, onSelect, isOpen, onClose, onThemeClick }: Props) {
  const handleSelect = (tab: Tab) => {
    onSelect(tab)
    onClose()
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <div className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-header">Explorer</div>
        <div className="tree-folder">▾ vansh-gambhir</div>
        <div className="tree-folder sub">▾ src</div>
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={`tree-file${active === tab.id ? ' active' : ''}`}
            onClick={() => handleSelect(tab.id)}
          >
            <FileIcon fileName={tab.fileName} />
            {tab.fileName}
          </div>
        ))}
        <div className="sidebar-theme-btn" onClick={() => { onThemeClick(); onClose() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.93s-.03-.64-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.36-.07.7-.07 1s.03.64.07 1l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
          </svg>
          Change Color Theme
        </div>
      </div>
    </>
  )
}
