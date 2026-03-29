import { useState, useRef } from 'react'
import './App.css'

interface HairstyleStyle {
  name: string
  emoji: string
  description: string
  reason: string
  difficulty: string
  mood: string
  tip: string
}

interface HairstyleResult {
  faceAnalysis: string
  styles: HairstyleStyle[]
}

async function resizeImage(file: File, maxSize = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
        else { w = Math.round(w * maxSize / h); h = maxSize }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = url
  })
}

const difficultyColor: Record<string, string> = {
  '쉬움': '#6fcf97',
  '보통': '#f2994a',
  '어려움': '#eb5757',
}

const moodColor: Record<string, string> = {
  '캐주얼': '#56ccf2',
  '포멀': '#9b51e0',
  '트렌디': '#f2c94c',
  '클래식': '#c9a96e',
  '청순': '#f2b8d4',
  '시크': '#bdbdbd',
}

function StyleCard({ style, index }: { style: HairstyleStyle; index: number }) {
  return (
    <div className="style-card">
      <div className="style-card-top">
        <span className="style-emoji">{style.emoji}</span>
        <span className="style-index">#{index + 1}</span>
      </div>
      <h4 className="style-name">{style.name}</h4>
      <p className="style-desc">{style.description}</p>
      <p className="style-reason">✓ {style.reason}</p>
      <p className="style-tip">💡 {style.tip}</p>
      <div className="style-tags">
        <span className="style-tag" style={{ color: difficultyColor[style.difficulty] || '#fff', borderColor: difficultyColor[style.difficulty] || 'rgba(255,255,255,0.2)' }}>
          {style.difficulty}
        </span>
        <span className="style-tag" style={{ color: moodColor[style.mood] || '#fff', borderColor: moodColor[style.mood] || 'rgba(255,255,255,0.2)' }}>
          {style.mood}
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HairstyleResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const resized = await resizeImage(file)
    setPhoto(resized)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  const analyze = async () => {
    if (!photo) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/hairstyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`[${res.status}] ${errText}`)
      }
      const data: HairstyleResult = await res.json()
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPhoto(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="stylist-app">
      <header className="app-header">
        <span className="logo-text">✂ AI 헤어스타일리스트</span>
        {(result || error) && (
          <button className="header-reset" onClick={reset}>← 다시하기</button>
        )}
      </header>

      <main className="single-page">
        {!result && !loading && (
          <>
            <div className="page-intro">
              <h1>나에게 어울리는<br />헤어스타일 추천</h1>
              <p>사진을 올리면 AI가 얼굴형을 분석해<br />최적의 헤어스타일 9가지를 추천해드려요</p>
            </div>

            <section className="section-block">
              <div
                className={`photo-drop-zone ${isDragOver ? 'dragover' : ''} ${photo ? 'has-photo' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !photo && fileInputRef.current?.click()}
              >
                {photo ? (
                  <div className="photo-preview">
                    <img src={photo} alt="업로드된 사진" />
                    <button className="photo-remove" onClick={e => { e.stopPropagation(); setPhoto(null) }}>✕ 삭제</button>
                  </div>
                ) : (
                  <div className="photo-placeholder">
                    <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="8" width="34" height="26" rx="4"/>
                      <circle cx="20" cy="21" r="7"/>
                      <path d="M14 8 L16 4 L24 4 L26 8"/>
                    </svg>
                    <p>사진을 드래그하거나 클릭하여 업로드</p>
                    <span>정면 사진일수록 정확해요</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }}
              />
              <p className="privacy-notice">
                🔒 이 사진은 스타일 분석에만 사용되며 서버에 저장되지 않습니다. AI 분석 후 즉시 폐기되며, 제3자에게 공유되지 않습니다.
              </p>
            </section>

            {error && <div className="error-box">{error}</div>}

            <div className="submit-area">
              <button className="submit-btn" disabled={!photo} onClick={analyze}>
                헤어스타일 추천받기 →
              </button>
            </div>
          </>
        )}

        {loading && (
          <div className="generating-state" style={{ minHeight: '60vh', justifyContent: 'center' }}>
            <div className="spinner" />
            <p>AI 스타일리스트가 분석 중이에요...</p>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>얼굴형·이목구비를 분석하고 있어요</span>
          </div>
        )}

        {result && (
          <>
            <div className="page-intro">
              <h1>추천 헤어스타일 9</h1>
              <p className="face-analysis">{result.faceAnalysis}</p>
            </div>

            {photo && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={photo} alt="분석된 사진" className="result-photo" />
              </div>
            )}

            <div className="hairstyle-grid">
              {result.styles.slice(0, 9).map((style, i) => (
                <StyleCard key={i} style={style} index={i} />
              ))}
            </div>

            <div className="submit-area">
              <button className="submit-btn" onClick={reset}>다른 사진으로 해보기 →</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
