import { TABS, type Tab } from '../config/tabs'
import { FileIcon } from './FileIcon'

type Props = { active: Tab; onSelect: (tab: Tab) => void }

export function Sidebar({ active, onSelect }: Props) {
  return (
    <nav className="sidebar" aria-label="File Explorer">
      <div className="sidebar-header">Explorer</div>
      <div className="tree-folder">▾ vansh-gambhir</div>
      <div className="tree-folder sub">▾ src</div>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tree-file${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <FileIcon fileName={tab.fileName} />
          {tab.fileName}
        </button>
      ))}
    </nav>
  )
}
