import { TABS, type Tab } from '../config/tabs'
import { FileIcon } from './FileIcon'

type Props = { active: Tab; onSelect: (tab: Tab) => void }

export function EditorTabs({ active, onSelect }: Props) {
  return (
    <div className="tabs">
      {TABS.map(tab => (
        <div
          key={tab.id}
          className={`tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          <FileIcon color={tab.color} />
          {tab.fileName}
        </div>
      ))}
    </div>
  )
}
