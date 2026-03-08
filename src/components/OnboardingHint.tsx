import { useState, useEffect } from 'react'
import { cmdKey } from '../utils/platform'
import { HINT_DISMISSED_KEY } from '../config/constants'

export function OnboardingHint() {
  const [visible, setVisible] = useState(false)

  function dismiss() {
    localStorage.setItem(HINT_DISMISSED_KEY, '1')
    setVisible(false)
  }

  useEffect(() => {
    if (!localStorage.getItem(HINT_DISMISSED_KEY)) {
      setVisible(true)
      const t = setTimeout(() => dismiss(), 12000)
      return () => clearTimeout(t)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="onboarding-hint" role="status" aria-live="polite">
      <span className="onboarding-hint-full">
        Tip: Hit <kbd>{cmdKey}P</kbd> to explore &nbsp;·&nbsp; <kbd>Ctrl+`</kbd> for terminal &nbsp;·&nbsp; Ask the AI anything →
      </span>
      <span className="onboarding-hint-short">
        Tip: Ask the AI anything →
      </span>
      <button className="onboarding-hint-close" onClick={dismiss} aria-label="Dismiss tip">✕</button>
    </div>
  )
}
