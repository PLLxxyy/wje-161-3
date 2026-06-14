import { WasteItem } from '../types'
import { wasteItems } from '../data/items'

export interface SearchResult {
  item: WasteItem
  matchType: 'name' | 'keyword'
  matchedWord: string
}

export const searchItems = (query: string): SearchResult[] => {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []
  const seen = new Set<string>()

  wasteItems.forEach(item => {
    if (seen.has(item.id)) return

    if (item.name.toLowerCase().includes(q)) {
      seen.add(item.id)
      results.push({ item, matchType: 'name', matchedWord: item.name })
      return
    }

    for (const kw of item.keywords) {
      if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) {
        seen.add(item.id)
        results.push({ item, matchType: 'keyword', matchedWord: kw })
        break
      }
    }
  })

  return results
}

export const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
