import { TABS, type Tab } from '../config/tabs'
import { FileIcon } from './FileIcon'

type Props = { active: Tab; onSelect: (tab: Tab) => void }

export function Sidebar({ active, onSelect }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Explorer</div>
      <div className="tree-folder">▾ vansh-gambhir</div>
      <div className="tree-folder sub">▾ src</div>
      {TABS.map(tab => (
        <div
          key={tab.id}
          className={`tree-file${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          <FileIcon color={tab.color} />
          {tab.fileName}
        </div>
      ))}
    </div>
  )
}
