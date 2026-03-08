import { useState, useEffect } from 'react'
import { MINIMAP_STORAGE_KEY } from '../config/constants'

export function useMinimapSetting() {
  const [minimapOn, setMinimapOn] = useState<boolean>(() =>
    localStorage.getItem(MINIMAP_STORAGE_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(MINIMAP_STORAGE_KEY, String(minimapOn))
  }, [minimapOn])

  return { minimapOn, toggleMinimap: () => setMinimapOn(v => !v) }
}
