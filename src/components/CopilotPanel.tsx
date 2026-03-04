import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

type Props = { onClose: () => void }

export function CopilotPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      })
      const data = await res.json() as { content?: string; error?: string }
      setMessages(m => [...m, { role: 'assistant', content: data.content ?? data.error ?? 'Something went wrong.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="copilot-panel">
      <div className="copilot-header">
        <span className="copilot-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          Copilot
        </span>
        <button className="copilot-close" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="copilot-messages">
        {messages.length === 0 && (
          <div className="copilot-welcome">
            <p>Hi! Ask me anything about <span className="kw">Vansh</span>.</p>
            <div className="copilot-suggestions">
              {["What's Vansh's current role?", "What tech stack does he use?", "Where has he worked?"].map(s => (
                <button key={s} className="copilot-suggestion" onClick={() => { setInput(s); inputRef.current?.focus() }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`copilot-msg copilot-msg-${m.role}`}>
            <span className="copilot-msg-label">{m.role === 'user' ? 'You' : 'Copilot'}</span>
            <p className="copilot-msg-text">{m.content}</p>
          </div>
        ))}

        {loading && (
          <div className="copilot-msg copilot-msg-assistant">
            <span className="copilot-msg-label">Copilot</span>
            <p className="copilot-msg-text copilot-typing">
              <span /><span /><span />
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="copilot-input-area">
        <textarea
          ref={inputRef}
          className="copilot-input"
          placeholder="Ask about Vansh..."
          value={input}
          rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="copilot-send" onClick={send} disabled={!input.trim() || loading} title="Send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21 23 12 2 3v7l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
