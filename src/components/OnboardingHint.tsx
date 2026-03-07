import { useState, useEffect } from 'react'
import { cmdKey } from '../utils/platform'

export function OnboardingHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('hint_dismissed')) {
      setVisible(true)
      const t = setTimeout(() => dismiss(), 12000)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('hint_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="onboarding-hint" role="status" aria-live="polite">
      <span>
        Tip: Hit <kbd>{cmdKey}P</kbd> to explore &nbsp;·&nbsp; <kbd>Ctrl+`</kbd> for terminal &nbsp;·&nbsp; Ask the AI anything →
      </span>
      <button className="onboarding-hint-close" onClick={dismiss} aria-label="Dismiss tip">✕</button>
    </div>
  )
}
