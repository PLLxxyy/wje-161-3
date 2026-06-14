import React from 'react'
import { CategoryType } from '../types'
import { wasteItems, categoryMap } from '../data/items'

interface Props {
  onBack: () => void
  onDetailClick: (id: string) => void
}

interface MatchResult {
  name: string
  category: CategoryType
  confidence: number
  id: string
}

const PhotoSearch: React.FC<Props> = ({ onBack, onDetailClick }) => {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<MatchResult[]>([])
  const [fileName, setFileName] = React.useState('')
  const fileRef = React.useRef<HTMLInputElement>(null)

  const simulateRecognition = (name: string) => {
    const baseName = name.replace(/\.[^.]+$/, '').toLowerCase()
    const queryWords = baseName
      .split(/[\s_\-.,，。、；;：:！!？?]+/)
      .filter(w => w.length > 0)

    const scored: MatchResult[] = []

    wasteItems.forEach(item => {
      let score = 0
      const allText = [item.name, ...item.keywords].join(' ').toLowerCase()

      queryWords.forEach(word => {
        if (allText.includes(word)) score += 30
        if (item.name.toLowerCase().includes(word)) score += 50
        item.keywords.forEach(kw => {
          if (kw.includes(word)) score += 40
          if (word.includes(kw)) score += 20
        })
      })

      if (score > 0) {
        const confidence = Math.min(98, Math.max(15, score + Math.floor(Math.random() * 20)))
        scored.push({
          name: item.name,
          category: item.category,
          confidence,
          id: item.id,
        })
      }
    })

    if (scored.length === 0) {
      const randomItems = wasteItems
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(item => ({
          name: item.name,
          category: item.category,
          confidence: Math.floor(Math.random() * 30) + 10,
          id: item.id,
        }))
      setResults(randomItems)
    } else {
      setResults(scored.sort((a, b) => b.confidence - a.confidence).slice(0, 5))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      setPreview(ev.target?.result as string)
      simulateRecognition(file.name)
    }
    reader.readAsDataURL(file)
  }

  const confidenceColor = (c: number) => {
    if (c >= 70) return 'var(--kitchen)'
    if (c >= 40) return 'var(--primary)'
    return 'var(--other)'
  }

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <div className="detail-card" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>📷 拍照识物</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          上传垃圾物品照片，系统通过关键词匹配模拟识别分类结果
        </p>

        <div className="upload-area" onClick={() => fileRef.current?.click()}>
          <div className="icon">📷</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>点击上传图片</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            支持 JPG、PNG 格式
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleFileChange}
        />

        {preview && (
          <div style={{ marginTop: 20 }}>
            <img src={preview} alt="预览" className="upload-preview" />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
              文件名：{fileName}
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="detail-card fade-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            🔍 识别结果（基于关键词匹配模拟）
          </h3>
          {results.map((r, i) => {
            const cat = categoryMap[r.category]
            return (
              <div
                key={i}
                className={`result-item ${cat.borderClass}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onDetailClick(r.id)}
              >
                <div className="info" style={{ flex: 1 }}>
                  <div className="name">
                    {i + 1}. {r.name}
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{
                        width: `${r.confidence}%`,
                        background: confidenceColor(r.confidence),
                      }}
                    />
                  </div>
                  <div className="tip">
                    置信度：{r.confidence}% | {cat.name}
                  </div>
                </div>
                <span className={`tag ${cat.tagClass}`}>{cat.name}</span>
              </div>
            )
          })}
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 12, textAlign: 'center' }}>
            * 以上结果基于文件名关键词匹配模拟，非真实图像识别
          </p>
        </div>
      )}
    </div>
  )
}

export default PhotoSearch
