import React from 'react'
import { categories } from '../data/items'

interface Props {
  onBack: () => void
}

const Guide: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>📖 垃圾分类指南</h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
        了解四大垃圾类别的定义、颜色标识、包含物品和投放注意事项
      </p>

      <div className="guide-grid">
        {categories.map(cat => (
          <div key={cat.type} className="guide-card" style={{ borderColor: cat.color }}>
            <div className="emoji">{cat.emoji}</div>
            <h3 style={{ color: cat.color }}>{cat.name}</h3>
            <p>{cat.description}</p>

            <div className="examples">
              {cat.examples.map((ex, i) => (
                <span key={i} className="example-tag">{ex}</span>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>
                投放注意事项：
              </p>
              <ul style={{ paddingLeft: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2 }}>
                {cat.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="detail-card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📋 分类小贴士</h3>
        <ul style={{ paddingLeft: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2.2 }}>
          <li><strong>可回收物</strong>记口诀：纸塑玻金衣（纸张、塑料、玻璃、金属、织物）</li>
          <li><strong>有害垃圾</strong>记口诀：药（药品）油（废油漆）电（电池）汞（水银温度计）胶（废胶片）</li>
          <li><strong>厨余垃圾</strong>特征：易腐烂、可降解的有机物（食物残渣、果皮菜叶等）</li>
          <li><strong>其他垃圾</strong>特征：除以上三类外的所有生活垃圾（用过的纸巾、陶瓷、烟蒂等）</li>
          <li>拿不准时，记住：污染过的纸张不可回收、大骨头不属于厨余垃圾</li>
          <li>利乐包（牛奶盒等）记得冲洗压扁后再投放</li>
          <li>尖锐物品需用纸包裹后投放，防止划伤处理人员</li>
        </ul>
      </div>
    </div>
  )
}

export default Guide
