import { TABS, type Tab } from '../config/tabs'

type Props = { active: Tab }

export function StatusBar({ active }: Props) {
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
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  )
}
