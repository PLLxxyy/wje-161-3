import React from 'react'
import { CategoryType } from '../types'
import { getItemById, categoryMap } from '../data/items'

interface Props {
  itemId: string
  onBack: () => void
}

const infoBoxClassMap: Record<CategoryType, string> = {
  recycle: 'info-box-blue',
  harmful: 'info-box-red',
  kitchen: 'info-box-green',
  other: 'info-box-gray',
}

const ItemDetail: React.FC<Props> = ({ itemId, onBack }) => {
  const item = getItemById(itemId)

  if (!item) {
    return (
      <div className="container fade-in">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>未找到该物品信息</p>
        </div>
      </div>
    )
  }

  const cat = categoryMap[item.category]

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-emoji">{cat.emoji}</div>
          <div>
            <div className="detail-title">{item.name}</div>
            <div className="detail-subtitle">
              <span className={`tag ${cat.tagClass}`}>{cat.name}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {item.description}
        </p>

        <div className="section-title">📋 分类归属</div>
        <div className={`info-box ${infoBoxClassMap[item.category]}`}>
          该物品属于<strong>{cat.name}</strong>。{cat.description}
        </div>

        <div className="section-title">🗑️ 投放要求</div>
        <div className={`info-box ${infoBoxClassMap[item.category]}`}>
          {item.disposal}
        </div>

        <div className="section-title">⚠️ 常见错误</div>
        <ul className="error-list">
          {item.commonMistakes.map((m, i) => (
            <li key={i}>
              <span style={{ color: 'var(--harmful)', fontWeight: 700 }}>✗</span>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ItemDetail
