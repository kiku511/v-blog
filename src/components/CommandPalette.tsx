import { useState, useEffect, useRef } from 'react'
import { TABS, type Tab } from '../config/tabs'

type Command = {
  label: string
  shortcut?: string
  action: () => void
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onTabSelect: (tab: Tab) => void
  onThemeSelect: () => void
}

export function CommandPalette({ isOpen, onClose, onTabSelect, onThemeSelect }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    ...TABS.map(tab => ({
      label: `Go to ${tab.fileName}`,
      shortcut: '← →',
      action: () => { onTabSelect(tab.id); onClose() },
    })),
    {
      label: 'Change Color Theme',
      shortcut: '⚙',
      action: () => { onClose(); setTimeout(onThemeSelect, 50) },
    },
    {
      label: 'Download Resume',
      shortcut: '⌘⇧P → enter',
      action: () => {
        const a = document.createElement('a')
        a.href = '/resume.pdf'
        a.download = 'Vansh-Gambhir-Resume.pdf'
        a.click()
        onClose()
      },
    },
  ]

  const filtered = query.trim()
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelected(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => { setSelected(0) }, [query])

  const execute = (cmd: Command) => { cmd.action(); onClose() }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape')     { e.preventDefault(); onClose() }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); execute(filtered[selected]) }
  }

  if (!isOpen) return null

  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cp-input"
          placeholder="Type a command or file name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="cp-list">
          {filtered.map((cmd, i) => (
            <div
              key={cmd.label}
              className={`cp-item${i === selected ? ' active' : ''}`}
              onClick={() => execute(cmd)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="cp-label">{cmd.label}</span>
              {cmd.shortcut && <kbd className="cp-kbd">{cmd.shortcut}</kbd>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cp-empty">No commands found</div>
          )}
        </div>
      </div>
    </div>
  )
}
