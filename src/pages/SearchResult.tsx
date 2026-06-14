import React from 'react'
import { CategoryType } from '../types'
import { categories } from '../data/items'
import { searchItems, highlightText } from '../utils/search'

interface Props {
  searchText: string
  onDetailClick: (id: string) => void
  onBack: () => void
}

const SearchResult: React.FC<Props> = ({ searchText, onDetailClick, onBack }) => {
  const results = React.useMemo(() => searchItems(searchText), [searchText])

  const getCategoryInfo = (type: CategoryType) => categories.find(c => c.type === type)

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
        搜索结果：「{searchText}」
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        共找到 {results.length} 个匹配项
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>没有找到「{searchText}」相关物品，换个关键词试试吧</p>
        </div>
      ) : (
        <div className="result-list">
          {results.map(r => {
            const cat = getCategoryInfo(r.item.category)
            return (
              <div
                key={r.item.id}
                className={`result-item ${cat?.borderClass}`}
                onClick={() => onDetailClick(r.item.id)}
              >
                <div className="info">
                  <div
                    className="name"
                    dangerouslySetInnerHTML={{ __html: highlightText(r.item.name, searchText) }}
                  />
                  <div className="tip">{r.item.description.slice(0, 50)}...</div>
                </div>
                <span className={`tag ${cat?.tagClass}`}>{cat?.name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchResult
