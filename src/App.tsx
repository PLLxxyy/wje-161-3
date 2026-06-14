import React from 'react'
import { PageType, CategoryType } from './types'
import { getTheme, setTheme, addHistory } from './utils/storage'
import { wasteItems } from './data/items'

import Home from './pages/Home'
import SearchResult from './pages/SearchResult'
import ItemDetail from './pages/ItemDetail'
import CategoryPage from './pages/CategoryPage'
import PhotoSearch from './pages/PhotoSearch'
import Guide from './pages/Guide'

const navItems: { page: PageType; label: string }[] = [
  { page: 'home', label: '首页' },
  { page: 'photo', label: '拍照识物' },
  { page: 'guide', label: '分类指南' },
]

const App: React.FC = () => {
  const [page, setPage] = React.useState<PageType>('home')
  const [theme, setThemeState] = React.useState<'light' | 'dark'>(getTheme)
  const [searchText, setSearchText] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType | null>(null)
  const [prevPage, setPrevPage] = React.useState<PageType>('home')

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setThemeState(next)
    setTheme(next)
  }

  const navigateTo = (p: PageType) => {
    setPrevPage(page)
    setPage(p)
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    setPage(prevPage)
    window.scrollTo(0, 0)
  }

  const handleSearch = (q: string) => {
    addHistory(q)
    setSearchQuery(q)
    navigateTo('search')
  }

  const handleDetailClick = (id: string) => {
    setSelectedItemId(id)
    navigateTo('detail')
  }

  const handleCategoryClick = (type: CategoryType) => {
    setSelectedCategory(type)
    navigateTo('category')
  }

  const stats = {
    total: wasteItems.length,
    recycle: wasteItems.filter(i => i.category === 'recycle').length,
    harmful: wasteItems.filter(i => i.category === 'harmful').length,
    kitchen: wasteItems.filter(i => i.category === 'kitchen').length,
    other: wasteItems.filter(i => i.category === 'other').length,
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-title" onClick={() => { setPage('home'); setSearchText('') }}>
            <span className="icon">♻️</span>
            <span>垃圾分类查询百科</span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {page !== 'detail' && page !== 'category' && page !== 'search' && (
        <nav className="nav">
          {navItems.map(n => (
            <button
              key={n.page}
              className={`nav-btn ${page === n.page ? 'active' : ''}`}
              onClick={() => navigateTo(n.page)}
            >
              {n.label}
            </button>
          ))}
        </nav>
      )}

      {page === 'home' && (
        <Home
          searchText={searchText}
          onSearchChange={setSearchText}
          onSearch={handleSearch}
          onCategoryClick={handleCategoryClick}
          onDetailClick={handleDetailClick}
          onNavigate={navigateTo}
        />
      )}

      {page === 'search' && (
        <SearchResult
          searchText={searchQuery}
          onDetailClick={handleDetailClick}
          onBack={goBack}
        />
      )}

      {page === 'detail' && selectedItemId && (
        <ItemDetail itemId={selectedItemId} onBack={goBack} />
      )}

      {page === 'category' && selectedCategory && (
        <CategoryPage
          categoryType={selectedCategory}
          onDetailClick={handleDetailClick}
          onBack={goBack}
        />
      )}

      {page === 'photo' && (
        <PhotoSearch onBack={() => setPage('home')} onDetailClick={handleDetailClick} />
      )}

      {page === 'guide' && (
        <Guide onBack={() => setPage('home')} />
      )}

      <footer className="footer">
        <div className="stats-bar" style={{ justifyContent: 'center', marginBottom: 8 }}>
          <span className="stat-item">收录物品 <strong>{stats.total}</strong> 种</span>
          <span className="stat-item">♻️ 可回收 <strong>{stats.recycle}</strong></span>
          <span className="stat-item">⚠️ 有害 <strong>{stats.harmful}</strong></span>
          <span className="stat-item">🥬 厨余 <strong>{stats.kitchen}</strong></span>
          <span className="stat-item">🗑️ 其他 <strong>{stats.other}</strong></span>
        </div>
        <div>垃圾分类查询百科 · 数据仅供参考 · 各地标准可能略有不同</div>
      </footer>
    </>
  )
}

export default App
