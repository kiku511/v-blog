import { useState, useEffect, useRef } from 'react'
import { THEMES, type Theme } from '../data/themes'

type Props = {
  isOpen: boolean
  currentThemeId: string
  onClose: () => void
  onSelect: (themeId: string) => void
}

export function ThemeSelector({ isOpen, currentThemeId, onClose, onSelect }: Props) {
  const [preview, setPreview] = useState(currentThemeId)
  const [selected, setSelected] = useState(0)
  const listRef   = useRef<HTMLDivElement>(null)
  const modalRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const idx = THEMES.findIndex(t => t.id === currentThemeId)
      setSelected(idx >= 0 ? idx : 0)
      setPreview(currentThemeId)
      modalRef.current?.focus()
    }
  }, [isOpen, currentThemeId])

  // Apply preview theme to DOM while hovering
  useEffect(() => {
    const theme = THEMES.find(t => t.id === preview)
    if (!theme) return
    const root = document.documentElement.style
    for (const [k, v] of Object.entries(theme.vars)) {
      root.setProperty(`--${k}`, v)
    }
  }, [preview])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      // Revert to original
      onSelect(currentThemeId)
      onClose()
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setSelected(i => {
        const next = Math.min(Math.max(i + dir, 0), THEMES.length - 1)
        setPreview(THEMES[next].id)
        return next
      })
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      onSelect(THEMES[selected].id)
      onClose()
    }
  }

  const commit = (theme: Theme) => {
    onSelect(theme.id)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="cp-overlay" onClick={() => { onSelect(currentThemeId); onClose() }}>
      <div className="cp-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={-1}
        ref={modalRef} style={{ outline: 'none' }}>
        <div className="cp-input" style={{ pointerEvents: 'none', color: 'var(--muted)', fontSize: 13 }}>
          Select Color Theme (↑↓ to preview, Enter to confirm, Esc to cancel)
        </div>
        <div className="cp-list" ref={listRef}>
          {THEMES.map((theme, i) => (
            <div
              key={theme.id}
              className={`cp-item${i === selected ? ' active' : ''}`}
              onClick={() => commit(theme)}
              onMouseEnter={() => { setSelected(i); setPreview(theme.id) }}
            >
              <span className="cp-label">{theme.name}</span>
              {theme.id === currentThemeId && (
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>current</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
