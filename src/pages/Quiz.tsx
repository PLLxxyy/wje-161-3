import React from 'react'
import { wasteItems, categories, categoryMap } from '../data/items'
import { WasteItem, CategoryType } from '../types'

interface QuizQuestion {
  item: WasteItem
  options: { type: CategoryType; label: string; emoji: string }[]
}

interface WrongAnswer {
  item: WasteItem
  correctCategory: CategoryType
  userAnswer: CategoryType
}

interface Props {
  onBack: () => void
  onDetailClick: (id: string) => void
}

const QUESTION_COUNT = 10

const Quiz: React.FC<Props> = ({ onBack, onDetailClick }) => {
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<CategoryType | null>(null)
  const [answers, setAnswers] = React.useState<Map<number, CategoryType>>(new Map())
  const [showResult, setShowResult] = React.useState(false)
  const [wrongAnswers, setWrongAnswers] = React.useState<WrongAnswer[]>([])
  const [score, setScore] = React.useState(0)

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  const generateQuestions = () => {
    const shuffledItems = shuffleArray(wasteItems)
    const selectedItems = shuffledItems.slice(0, QUESTION_COUNT)

    const quizQuestions: QuizQuestion[] = selectedItems.map(item => {
      const correctCategory = categories.find(c => c.type === item.category)!
      const otherCategories = categories.filter(c => c.type !== item.category)
      const shuffledOthers = shuffleArray(otherCategories).slice(0, 3)
      const allOptions = shuffleArray([
        { type: correctCategory.type, label: correctCategory.name, emoji: correctCategory.emoji },
        ...shuffledOthers.map(c => ({ type: c.type, label: c.name, emoji: c.emoji }))
      ])
      return { item, options: allOptions }
    })

    setQuestions(quizQuestions)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers(new Map())
    setShowResult(false)
    setWrongAnswers([])
    setScore(0)
  }

  React.useEffect(() => {
    generateQuestions()
  }, [])

  const handleSelectAnswer = (type: CategoryType) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(type)
    const newAnswers = new Map(answers)
    newAnswers.set(currentIndex, type)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(answers.get(currentIndex + 1) ?? null)
    } else {
      calculateResult()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedAnswer(answers.get(currentIndex - 1) ?? null)
    }
  }

  const calculateResult = () => {
    let correctCount = 0
    const wrong: WrongAnswer[] = []

    questions.forEach((q, index) => {
      const userAnswer = answers.get(index)
      if (userAnswer === q.item.category) {
        correctCount++
      } else if (userAnswer) {
        wrong.push({
          item: q.item,
          correctCategory: q.item.category,
          userAnswer: userAnswer
        })
      }
    })

    setScore(correctCount)
    setWrongAnswers(wrong)
    setShowResult(true)
  }

  const getScoreEmoji = () => {
    const percentage = (score / QUESTION_COUNT) * 100
    if (percentage >= 90) return '🏆'
    if (percentage >= 70) return '🎉'
    if (percentage >= 50) return '👍'
    return '💪'
  }

  const getScoreMessage = () => {
    const percentage = (score / QUESTION_COUNT) * 100
    if (percentage >= 90) return '太棒了！你是垃圾分类达人！'
    if (percentage >= 70) return '做得不错！继续加油！'
    if (percentage >= 50) return '还可以，多练习会更好！'
    return '继续努力，多看看分类指南吧！'
  }

  if (questions.length === 0) {
    return (
      <div className="container fade-in">
        <div className="empty-state">
          <div className="icon">⏳</div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="container fade-in">
        <button className="btn-back" onClick={onBack}>← 返回</button>

        <div className="detail-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{getScoreEmoji()}</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>测验完成！</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{getScoreMessage()}</p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline',
            gap: 4,
            marginBottom: 24 
          }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary)' }}>{score}</span>
            <span style={{ fontSize: 24, color: 'var(--text-secondary)' }}>/ {QUESTION_COUNT}</span>
          </div>

          <div className="confidence-bar" style={{ maxWidth: 300, margin: '0 auto 24px' }}>
            <div 
              className="confidence-fill" 
              style={{ 
                width: `${(score / QUESTION_COUNT) * 100}%`,
                background: (score / QUESTION_COUNT) >= 0.6 ? 'var(--kitchen)' : 'var(--harmful)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={generateQuestions}>
              🔄 再来一次
            </button>
            <button className="btn btn-outline" onClick={onBack}>
              返回首页
            </button>
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="detail-card">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📝 错题回顾</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              共 {wrongAnswers.length} 道错题，点击物品可查看详细说明
            </p>
            
            {wrongAnswers.map((wa, i) => {
              const correctCat = categoryMap[wa.correctCategory]
              const userCat = categoryMap[wa.userAnswer]
              return (
                <div 
                  key={i} 
                  className="result-item harmful-border"
                  style={{ marginBottom: 12 }}
                  onClick={() => onDetailClick(wa.item.id)}
                >
                  <div className="info">
                    <div className="name">{wa.item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                      <span style={{ color: 'var(--harmful)' }}>❌ 你的答案：</span>
                      <span className={`tag tag-${wa.userAnswer}`} style={{ marginLeft: 6 }}>
                        {userCat.emoji} {userCat.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      <span style={{ color: 'var(--kitchen)' }}>✅ 正确答案：</span>
                      <span className={`tag tag-${wa.correctCategory}`} style={{ marginLeft: 6 }}>
                        {correctCat.emoji} {correctCat.name}
                      </span>
                    </div>
                  </div>
                  <span className="tag tag-harmful">错题</span>
                </div>
              )
            })}
          </div>
        )}

        {wrongAnswers.length === 0 && (
          <div className="detail-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎊</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--kitchen)' }}>
              全对！你已经完全掌握了垃圾分类知识！
            </p>
          </div>
        )}
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentItem = currentQuestion.item
  const isAnswered = selectedAnswer !== null

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>🧠 知识测验</h2>
        <span className="tag tag-recycle">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="confidence-bar" style={{ marginBottom: 24 }}>
        <div 
          className="confidence-fill" 
          style={{ 
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            background: 'var(--primary)'
          }}
        />
      </div>

      <div className="detail-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            第 {currentIndex + 1} 题
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            「{currentItem.name}」属于哪类垃圾？
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            请从以下四个选项中选择正确答案
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {currentQuestion.options.map(opt => {
            const isSelected = selectedAnswer === opt.type
            const isCorrect = isAnswered && opt.type === currentItem.category
            const isWrong = isAnswered && isSelected && opt.type !== currentItem.category

            let borderColor = 'var(--border)'
            let bgColor = 'var(--bg-card)'

            if (isCorrect) {
              borderColor = 'var(--kitchen)'
              bgColor = 'var(--kitchen-bg)'
            } else if (isWrong) {
              borderColor = 'var(--harmful)'
              bgColor = 'var(--harmful-bg)'
            } else if (isSelected) {
              borderColor = 'var(--primary)'
              bgColor = 'var(--primary-light)'
            }

            return (
              <button
                key={opt.type}
                className="btn btn-outline"
                style={{
                  padding: '20px 16px',
                  fontSize: 16,
                  borderColor,
                  background: bgColor,
                  flexDirection: 'column',
                  gap: 8,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: isAnswered ? 'default' : 'pointer'
                }}
                onClick={() => handleSelectAnswer(opt.type)}
                disabled={isAnswered}
              >
                <span style={{ fontSize: 32 }}>{opt.emoji}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                {isCorrect && <span style={{ color: 'var(--kitchen)', fontSize: 12 }}>✓ 正确</span>}
                {isWrong && <span style={{ color: 'var(--harmful)', fontSize: 12 }}>✗ 错误</span>}
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <div 
            className={`info-box ${
              selectedAnswer === currentItem.category 
                ? 'info-box-green' 
                : 'info-box-red'
            }`}
            style={{ marginTop: 20 }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {selectedAnswer === currentItem.category ? '✅ 回答正确！' : '❌ 回答错误'}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {currentItem.description}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button 
          className="btn btn-outline" 
          style={{ flex: 1 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← 上一题
        </button>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentIndex < questions.length - 1 ? '下一题 →' : '查看结果'}
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 6, 
        justifyContent: 'center', 
        marginTop: 20,
        flexWrap: 'wrap'
      }}>
        {questions.map((_, i) => {
          const answered = answers.has(i)
          const isCurrent = i === currentIndex
          let bg = 'var(--border)'
          if (answered) {
            const isCorrect = answers.get(i) === questions[i].item.category
            bg = isCorrect ? 'var(--kitchen)' : 'var(--harmful)'
          }
          if (isCurrent) {
            bg = 'var(--primary)'
          }
          return (
            <div
              key={i}
              onClick={() => {
                setCurrentIndex(i)
                setSelectedAnswer(answers.get(i) ?? null)
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: bg,
                color: answered || isCurrent ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Quiz
