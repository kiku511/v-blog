import { useState } from 'react'

const STORAGE_KEY = 'vscode-minimap'

export function useMinimapSetting() {
  const [minimapOn, setMinimapOn] = useState<boolean>(() =>
    localStorage.getItem(STORAGE_KEY) === 'true'
  )

  const toggleMinimap = () => {
    setMinimapOn(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return { minimapOn, toggleMinimap }
}
