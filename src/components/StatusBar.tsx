import { TABS, type Tab } from '../config/tabs'
import { SettingsIcon } from './Icons'
import { cmdKey } from '../utils/platform'

type Cursor = { ln: number; col: number }
type Props  = { active: Tab; cursor: Cursor; onOpenPalette: () => void; onOpenTheme: () => void }

export function StatusBar({ active, cursor, onOpenPalette, onOpenTheme }: Props) {
  const tab = TABS.find(t => t.id === active)!
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span>⎇ main</span>
        <span className="sb-hide-mobile">🔴 0 &nbsp;⚠️ 0</span>
        <span className="sb-palette-hint sb-hide-mobile" onClick={onOpenPalette} title="Open Command Palette">{cmdKey}+P</span>
        <span className="sb-palette-hint sb-only-mobile" onClick={onOpenTheme} title="Change Color Theme">
          <SettingsIcon size={12} style={{ display: 'block' }} />
        </span>
      </div>
      <div className="sb-right">
        <span>{tab.lang}</span>
        <span className="sb-hide-mobile">UTF-8</span>
        <span>Ln {cursor.ln}, Col {cursor.col}</span>
      </div>
    </div>
  )
}
