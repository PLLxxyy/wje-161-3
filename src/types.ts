export type CategoryType = 'recycle' | 'harmful' | 'kitchen' | 'other'

export interface WasteItem {
  id: string
  name: string
  category: CategoryType
  description: string
  disposal: string
  commonMistakes: string[]
  keywords: string[]
}

export interface CategoryInfo {
  type: CategoryType
  name: string
  emoji: string
  color: string
  bgClass: string
  tagClass: string
  borderClass: string
  description: string
  guidelines: string
  examples: string[]
  tips: string[]
}

export interface SearchHistoryItem {
  keyword: string
  timestamp: number
}

export type PageType = 'home' | 'search' | 'detail' | 'category' | 'photo' | 'guide'

export interface AppState {
  currentPage: PageType
  searchText: string
  selectedItemId: string | null
  selectedCategory: CategoryType | null
  theme: 'light' | 'dark'
  history: SearchHistoryItem[]
}
