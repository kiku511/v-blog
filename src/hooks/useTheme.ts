import { useState, useEffect } from 'react'
import { THEMES, DEFAULT_THEME_ID, type Theme } from '../data/themes'
import { THEME_STORAGE_KEY } from '../config/constants'

function applyTheme(vars: Theme['vars']) {
  const root = document.documentElement.style
  for (const [k, v] of Object.entries(vars)) {
    root.setProperty(`--${k}`, v)
  }
}

export function useTheme() {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME_ID
  })

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0]
    applyTheme(theme.vars)
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  }, [themeId])

  return { themeId, setThemeId, themes: THEMES }
}
