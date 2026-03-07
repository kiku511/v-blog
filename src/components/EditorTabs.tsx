import { TABS, type Tab } from '../config/tabs'
import { FileIcon } from './FileIcon'

type Props = { active: Tab; onSelect: (tab: Tab) => void }

export function EditorTabs({ active, onSelect }: Props) {
  return (
    <div className="tabs" role="tablist" aria-label="Open files">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          className={`tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
          aria-selected={active === tab.id}
        >
          <FileIcon fileName={tab.fileName} />
          {tab.fileName}
        </button>
      ))}
    </div>
  )
}
