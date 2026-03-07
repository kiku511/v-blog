import { useState, useEffect } from 'react'

const STORAGE_KEY = 'vscode-minimap'

export function useMinimapSetting() {
  const [minimapOn, setMinimapOn] = useState<boolean>(() =>
    localStorage.getItem(STORAGE_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(minimapOn))
  }, [minimapOn])

  return { minimapOn, toggleMinimap: () => setMinimapOn(v => !v) }
}
