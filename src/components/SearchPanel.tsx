import { useState, useRef, useEffect } from 'react'
import { SEARCH_INDEX } from '../data/searchIndex'
import type { Tab } from '../config/tabs'

type Props = { onNavigate: (tab: Tab) => void }

function highlight(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SearchPanel({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim()
  const matches = q.length < 2 ? [] : SEARCH_INDEX.filter(e =>
    e.text.toLowerCase().includes(q.toLowerCase())
  )

  // Group by tab
  const grouped = matches.reduce<Record<string, { fileName: string; entries: typeof matches }>>(
    (acc, entry) => {
      if (!acc[entry.tab]) acc[entry.tab] = { fileName: entry.fileName, entries: [] }
      acc[entry.tab].entries.push(entry)
      return acc
    }, {}
  )

  return (
    <nav className="sidebar" aria-label="Search">
      <div className="sidebar-header">Search</div>

      <div className="search-input-wrap">
        <input
          ref={inputRef}
          className="search-input"
          aria-label="Search across files"
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {q.length >= 2 && (
        <div className="search-results" aria-live="polite" aria-label="Search results">
          {Object.keys(grouped).length === 0 ? (
            <div className="search-no-results">No results for "{q}"</div>
          ) : (
            Object.entries(grouped).map(([tab, { fileName, entries }]) => (
              <div key={tab} className="search-group">
                <button className="search-group-header" onClick={() => onNavigate(tab as Tab)}>
                  <span className="search-group-name">{fileName}</span>
                  <span className="search-match-count">{entries.length}</span>
                </button>
                {entries.map(m => (
                  <button key={m.line} className="search-match" onClick={() => onNavigate(tab as Tab)}>
                    <span className="search-match-line">{m.line}</span>
                    <span className="search-match-text">{highlight(m.text.trim(), q)}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {q.length === 0 && (
        <div className="search-no-results">Type to search across files</div>
      )}
    </nav>
  )
}
