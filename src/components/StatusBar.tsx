import { TABS, type Tab } from '../config/tabs'

type Cursor = { ln: number; col: number }
type Props = { active: Tab; cursor: Cursor }

export function StatusBar({ active, cursor }: Props) {
  const tab = TABS.find(t => t.id === active)!
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span>⎇ main</span>
        <span>🔴 0 &nbsp;⚠️ 0</span>
      </div>
      <div className="sb-right">
        <span>{tab.lang}</span>
        <span>UTF-8</span>
        <span>Ln {cursor.ln}, Col {cursor.col}</span>
      </div>
    </div>
  )
}
