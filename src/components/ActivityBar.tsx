import { ExternalLinkIcon, SearchIcon, PersonIcon, SettingsIcon } from './Icons'

type Props = { onPaletteClick: () => void }

export function ActivityBar({ onPaletteClick }: Props) {
  return (
    <div className="activitybar">
      <div className="act-icon active">
        <ExternalLinkIcon />
      </div>
      <div className="act-icon">
        <SearchIcon />
      </div>
      <div className="act-icon">
        <PersonIcon />
      </div>
      <div className="act-icon settings" onClick={onPaletteClick} style={{ cursor: 'pointer' }} title="Command Palette">
        <SettingsIcon />
      </div>
    </div>
  )
}
