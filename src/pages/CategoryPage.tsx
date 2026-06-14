import React from 'react'
import { CategoryType } from '../types'
import { getItemsByCategory, categoryMap } from '../data/items'

interface Props {
  categoryType: CategoryType
  onDetailClick: (id: string) => void
  onBack: () => void
}

const CategoryPage: React.FC<Props> = ({ categoryType, onDetailClick, onBack }) => {
  const items = getItemsByCategory(categoryType)
  const cat = categoryMap[categoryType]

  if (!cat) {
    return (
      <div className="container fade-in">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>未找到该分类信息</p>
        </div>
      </div>
    )
  }

  const [filter, setFilter] = React.useState('')
  const filtered = filter.trim()
    ? items.filter(it => it.name.includes(filter) || it.keywords.some(k => k.includes(filter)))
    : items

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <div className={`detail-card ${cat.bgClass}`} style={{ borderLeft: `4px solid ${cat.color}` }}>
        <div className="detail-header">
          <div className="detail-emoji">{cat.emoji}</div>
          <div>
            <div className="detail-title">{cat.name}</div>
            <div className="detail-subtitle" style={{ color: cat.color }}>
              {cat.description}
            </div>
          </div>
        </div>
      </div>

      <div className="search-box" style={{ margin: '16px 0 12px' }}>
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder={`在${cat.name}中搜索...`}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filter && (
          <button className="search-clear" onClick={() => setFilter('')}>✕</button>
        )}
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        共 {filtered.length} 种物品
      </p>

      <div className="result-list">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`result-item ${cat.borderClass}`}
            onClick={() => onDetailClick(item.id)}
          >
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="tip">{item.disposal.slice(0, 50)}...</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>没有找到匹配的物品</p>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
