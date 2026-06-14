import { SearchHistoryItem } from '../types'

const HISTORY_KEY = 'waste_search_history'
const THEME_KEY = 'waste_theme'
const MAX_HISTORY = 20

export const getHistory = (): SearchHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SearchHistoryItem[]
  } catch {
    return []
  }
}

export const addHistory = (keyword: string): SearchHistoryItem[] => {
  const trimmed = keyword.trim()
  if (!trimmed) return getHistory()
  const history = getHistory().filter(h => h.keyword !== trimmed)
  history.unshift({ keyword: trimmed, timestamp: Date.now() })
  const trimmedHistory = history.slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
  return trimmedHistory
}

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY)
}

export const getTheme = (): 'light' | 'dark' => {
  const t = localStorage.getItem(THEME_KEY)
  if (t === 'dark' || t === 'light') return t
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}
