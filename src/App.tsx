import { useState, useEffect, useRef } from 'react'
import './App.css'

interface ProfileData {
  gender: string
  age: string
  height: string
  weight: string
  skinTone: string
  faceShape: string
  hairStyle: string
  glasses: string
  bodyType: string
  style: string
}

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

function VisualCard({ label, svg, selected, onClick }: {
  label: string; svg: React.ReactNode; selected: boolean; onClick: () => void
}) {
  return (
    <button className={`visual-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="visual-svg-wrap">{svg}</div>
      <span className="visual-label">{label}</span>
    </button>
  )
}

const faceShapes = [
  { id: '타원형', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5"><ellipse cx="40" cy="54" rx="28" ry="42"/><circle cx="29" cy="46" r="2.5" fill="currentColor" stroke="none"/><circle cx="51" cy="46" r="2.5" fill="currentColor" stroke="none"/></svg> },
  { id: '둥근형', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="40" cy="54" r="34"/><circle cx="28" cy="48" r="2.5" fill="currentColor" stroke="none"/><circle cx="52" cy="48" r="2.5" fill="currentColor" stroke="none"/></svg> },
  { id: '각진형', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="8" y="12" width="64" height="74" rx="6"/><circle cx="28" cy="48" r="2.5" fill="currentColor" stroke="none"/><circle cx="52" cy="48" r="2.5" fill="currentColor" stroke="none"/></svg> },
  { id: '하트형', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><path d="M40 88 C18 66,6 44,10 28 C14 12,28 8,40 18 C52 8,66 12,70 28 C74 44,62 66,40 88Z"/><circle cx="28" cy="44" r="2.5" fill="currentColor" stroke="none"/><circle cx="52" cy="44" r="2.5" fill="currentColor" stroke="none"/></svg> },
  { id: '역삼각형', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><path d="M8 18 C10 8,28 4,40 4 C52 4,70 8,72 18 C80 36,62 72,40 90 C18 72,0 36,8 18Z"/><circle cx="28" cy="42" r="2.5" fill="currentColor" stroke="none"/><circle cx="52" cy="42" r="2.5" fill="currentColor" stroke="none"/></svg> },
]

const hairStyles = [
  { id: '짧은 단발', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 56 C16 30,25 10,40 10 C55 10,64 30,64 56 L64 78 L16 78Z" fill="currentColor" fillOpacity="0.25"/><ellipse cx="40" cy="62" rx="21" ry="27" strokeDasharray="3 2"/><circle cx="31" cy="55" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="55" r="2" fill="currentColor" stroke="none"/></svg> },
  { id: '긴 생머리', svg: <svg viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 54 C16 28,25 8,40 8 C55 8,64 28,64 54 L66 100 C66 106,56 110,50 110 L30 110 C24 110,14 106,14 100Z" fill="currentColor" fillOpacity="0.25"/><ellipse cx="40" cy="58" rx="21" ry="28" strokeDasharray="3 2"/><circle cx="31" cy="52" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="52" r="2" fill="currentColor" stroke="none"/></svg> },
  { id: '웨이브', svg: <svg viewBox="0 0 80 110" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 54 C16 28,25 8,40 8 C55 8,64 28,64 54 L67 84 C62 78,58 86,54 80 C50 86,46 78,42 84 C38 78,34 86,30 80 C26 86,22 78,13 84Z" fill="currentColor" fillOpacity="0.25"/><ellipse cx="40" cy="58" rx="21" ry="28" strokeDasharray="3 2"/><circle cx="31" cy="52" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="52" r="2" fill="currentColor" stroke="none"/></svg> },
  { id: '짧은 커트', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 58 C20 34,27 14,40 14 C53 14,60 34,60 58 C60 62,59 65,58 66 L22 66 C21 65,20 62,20 58Z" fill="currentColor" fillOpacity="0.25"/><ellipse cx="40" cy="64" rx="20" ry="26" strokeDasharray="3 2"/><circle cx="31" cy="57" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="57" r="2" fill="currentColor" stroke="none"/></svg> },
  { id: '업스타일', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="40" cy="14" rx="13" ry="9" fill="currentColor" fillOpacity="0.3"/><line x1="34" y1="22" x2="32" y2="30"/><line x1="40" y1="23" x2="40" y2="31"/><line x1="46" y1="22" x2="48" y2="30"/><path d="M20 58 C20 34,27 12,40 12 C53 12,60 34,60 58"/><ellipse cx="40" cy="64" rx="20" ry="26" strokeDasharray="3 2"/><circle cx="31" cy="57" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="57" r="2" fill="currentColor" stroke="none"/></svg> },
  { id: '곱슬머리', svg: <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 58 C8 44,10 28,14 22 C16 16,14 10,18 7 C22 4,24 7,24 7 C26 3,30 3,32 6 C34 3,38 2,40 2 C42 2,46 3,48 6 C50 3,54 4,56 7 C60 10,58 16,62 22 C66 30,68 44,70 58 C70 72,60 82,40 82 C20 82,10 72,10 58Z" fill="currentColor" fillOpacity="0.25"/><ellipse cx="40" cy="60" rx="20" ry="26" strokeDasharray="3 2"/><circle cx="31" cy="54" r="2" fill="currentColor" stroke="none"/><circle cx="49" cy="54" r="2" fill="currentColor" stroke="none"/></svg> },
]

const glassesOptions = [
  { id: '없음', svg: <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="25" y1="18" x2="55" y2="32" strokeOpacity="0.2"/><line x1="55" y1="18" x2="25" y2="32" strokeOpacity="0.2"/></svg> },
  { id: '원형', svg: <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="22" cy="25" r="13"/><circle cx="58" cy="25" r="13"/><line x1="35" y1="25" x2="45" y2="25"/><line x1="5" y1="20" x2="9" y2="25"/><line x1="75" y1="20" x2="71" y2="25"/></svg> },
  { id: '사각형', svg: <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="12" width="28" height="22" rx="3"/><rect x="46" y="12" width="28" height="22" rx="3"/><line x1="34" y1="23" x2="46" y2="23"/><line x1="4" y1="17" x2="6" y2="23"/><line x1="76" y1="17" x2="74" y2="23"/></svg> },
  { id: '고양이눈형', svg: <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><path d="M6 30 C6 30,8 14,22 12 C34 10,38 22,36 30 C34 36,18 36,10 32Z"/><path d="M74 30 C74 30,72 14,58 12 C46 10,42 22,44 30 C46 36,62 36,70 32Z"/><line x1="36" y1="22" x2="44" y2="22"/><line x1="4" y1="22" x2="6" y2="30"/><line x1="76" y1="22" x2="74" y2="30"/></svg> },
  { id: '오버사이즈', svg: <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="8" width="34" height="30" rx="6"/><rect x="43" y="8" width="34" height="30" rx="6"/><line x1="37" y1="23" x2="43" y2="23"/><line x1="2" y1="14" x2="3" y2="23"/><line x1="78" y1="14" x2="77" y2="23"/></svg> },
]

const bodyTypes = [
  { id: '슬림형', svg: <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="25" cy="11" r="8"/><path d="M18 20 C16 30,16 42,17 54 C18 64,18 72,18 80 L32 80 C32 72,32 64,33 54 C34 42,34 30,32 20Z" fill="currentColor" fillOpacity="0.2"/><line x1="20" y1="80" x2="17" y2="106"/><line x1="30" y1="80" x2="33" y2="106"/></svg> },
  { id: '표준형', svg: <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="25" cy="11" r="8"/><path d="M16 20 C12 30,12 44,14 56 C16 64,17 72,17 80 L33 80 C33 72,34 64,36 56 C38 44,38 30,34 20Z" fill="currentColor" fillOpacity="0.2"/><line x1="19" y1="80" x2="16" y2="106"/><line x1="31" y1="80" x2="34" y2="106"/></svg> },
  { id: '근육형', svg: <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="25" cy="11" r="8"/><path d="M10 22 C8 30,10 44,14 56 C17 64,18 72,18 80 L32 80 C32 72,33 64,36 56 C40 44,42 30,40 22 C36 18,30 16,25 16 C20 16,14 18,10 22Z" fill="currentColor" fillOpacity="0.2"/><line x1="19" y1="80" x2="16" y2="106"/><line x1="31" y1="80" x2="34" y2="106"/></svg> },
  { id: '통통형', svg: <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="25" cy="11" r="8"/><path d="M14 20 C8 30,6 44,8 58 C10 66,14 74,16 80 L34 80 C36 74,40 66,42 58 C44 44,42 30,36 20Z" fill="currentColor" fillOpacity="0.2"/><line x1="18" y1="80" x2="15" y2="106"/><line x1="32" y1="80" x2="35" y2="106"/></svg> },
]

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

function ReportContent({ text, isGenerating }: { text: string; isGenerating: boolean }) {
  const lines = text.split('\n')
  return (
    <div className="report-body">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} className="report-heading">{line.slice(3)}</h3>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          return <li key={i} className="report-li" dangerouslySetInnerHTML={{ __html: content }} />
        }
        if (line.trim() === '') return <div key={i} className="report-gap" />
        const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} className="report-p" dangerouslySetInnerHTML={{ __html: content }} />
      })}
      {isGenerating && <span className="cursor-blink">▋</span>}
    </div>
  )
}

const difficultyColor: Record<string, string> = {
  '쉬움': '#6fcf97', '보통': '#f2994a', '어려움': '#eb5757',
}
const moodColor: Record<string, string> = {
  '캐주얼': '#56ccf2', '포멀': '#9b51e0', '트렌디': '#f2c94c',
  '클래식': '#c9a96e', '청순': '#f2b8d4', '시크': '#bdbdbd',
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
        <span className="style-tag" style={{ color: difficultyColor[style.difficulty] || '#fff', borderColor: difficultyColor[style.difficulty] || 'rgba(255,255,255,0.2)' }}>{style.difficulty}</span>
        <span className="style-tag" style={{ color: moodColor[style.mood] || '#fff', borderColor: moodColor[style.mood] || 'rgba(255,255,255,0.2)' }}>{style.mood}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [profile, setProfile] = useState<ProfileData>({
    gender: '', age: '', height: '', weight: '',
    skinTone: '', faceShape: '', hairStyle: '', glasses: '',
    bodyType: '', style: '',
  })
  const [photo, setPhoto] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Style report state
  const [report, setReport] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  // Hairstyle state
  const [hairstyle, setHairstyle] = useState<HairstyleResult | null>(null)
  const [hairstyleLoading, setHairstyleLoading] = useState(false)
  const [hairstyleError, setHairstyleError] = useState('')

  const reportRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof ProfileData, value: string) =>
    setProfile(prev => ({ ...prev, [field]: value }))

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setPhoto(await resizeImage(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  // Style consulting (streaming)
  useEffect(() => {
    if (!submitted) return
    setReport('')
    setGenError('')
    setIsGenerating(true)

    async function generate() {
      try {
        const res = await fetch('/api/consult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile, photo }),
        })
        if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`)
        if (!res.body) throw new Error('응답 스트림 없음')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setReport(prev => prev + decoder.decode(value, { stream: true }))
          reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      } catch (e) {
        setGenError(e instanceof Error ? e.message : '알 수 없는 오류')
      } finally {
        setIsGenerating(false)
      }
    }
    generate()
  }, [submitted])

  // Hairstyle recommendation (only if photo uploaded)
  useEffect(() => {
    if (!submitted || !photo) return
    setHairstyle(null)
    setHairstyleError('')
    setHairstyleLoading(true)

    async function fetchHairstyle() {
      try {
        const res = await fetch('/api/hairstyle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo }),
        })
        if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`)
        setHairstyle(await res.json())
      } catch (e) {
        setHairstyleError(e instanceof Error ? e.message : '오류 발생')
      } finally {
        setHairstyleLoading(false)
      }
    }
    fetchHairstyle()
  }, [submitted])

  const isComplete = Object.values(profile).every(v => v !== '')

  const reset = () => {
    setProfile({ gender: '', age: '', height: '', weight: '', skinTone: '', faceShape: '', hairStyle: '', glasses: '', bodyType: '', style: '' })
    setPhoto(null)
    setSubmitted(false)
    setReport('')
    setHairstyle(null)
  }

  if (submitted) {
    return (
      <div className="stylist-app">
        <header className="app-header">
          <span className="logo-text">✦ AI Personal Stylist</span>
          <button className="header-reset" onClick={reset}>← 처음으로</button>
        </header>
        <main className="report-page">
          {/* Profile summary */}
          <section className="profile-card">
            <div className="profile-card-header">
              <span className="result-icon">✦</span>
              <div>
                <h2>맞춤 스타일 컨설팅 보고서</h2>
                <p className="subtitle">{profile.gender} · {profile.age}세 · {profile.style} 스타일</p>
              </div>
            </div>
            <div className="profile-summary">
              {[
                { label: '체형', value: `${profile.bodyType} (${profile.height}cm / ${profile.weight}kg)` },
                { label: '피부색', value: profile.skinTone },
                { label: '얼굴형', value: profile.faceShape },
                { label: '헤어 / 안경', value: `${profile.hairStyle} / ${profile.glasses}` },
              ].map(({ label, value }) => (
                <div key={label} className="summary-item">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* Style report */}
          <section className="report-section">
            {isGenerating && !report && (
              <div className="generating-state">
                <div className="spinner" />
                <p>AI 스타일리스트가 분석 중이에요...</p>
              </div>
            )}
            {genError && <div className="error-box">{genError}</div>}
            {report && <ReportContent text={report} isGenerating={isGenerating} />}
            <div ref={reportRef} />
          </section>

          {/* Hairstyle recommendations (only if photo uploaded) */}
          {photo && (
            <section className="hairstyle-section">
              <div className="hairstyle-section-header">
                <span className="result-icon" style={{ fontSize: '1.4rem' }}>✂</span>
                <h2>추천 헤어스타일 9</h2>
              </div>

              {hairstyleLoading && (
                <div className="generating-state">
                  <div className="spinner" />
                  <p>헤어스타일 분석 중...</p>
                </div>
              )}

              {hairstyleError && <div className="error-box">{hairstyleError}</div>}

              {hairstyle && (
                <>
                  <p className="face-analysis">{hairstyle.faceAnalysis}</p>
                  <div className="hairstyle-grid">
                    {hairstyle.styles.slice(0, 9).map((style, i) => (
                      <StyleCard key={i} style={style} index={i} />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {!isGenerating && !hairstyleLoading && (report || genError) && (
            <button className="submit-btn" style={{ margin: '0 1.2rem 3rem' }} onClick={reset}>
              처음부터 다시 하기
            </button>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="stylist-app">
      <header className="app-header">
        <span className="logo-text">✦ AI Personal Stylist</span>
      </header>

      <main className="single-page">
        <div className="page-intro">
          <h1>나만의 스타일 프로필</h1>
          <p>아래 항목을 모두 선택하면 맞춤 스타일을 추천해드려요.</p>
        </div>

        {/* 사진 업로드 (선택) */}
        <section className="section-block photo-section">
          <div className="photo-section-top">
            <div className="photo-section-badge">📸 사진 업로드</div>
            <span className="photo-section-optional">선택</span>
          </div>
          <p className="photo-section-desc">
            사진을 올리면 AI가 실제 외모를 직접 분석해<br />
            <strong>더 정확한 스타일 제안 + 헤어스타일 9가지</strong>를 함께 추천해드려요
          </p>
          <div className="photo-benefits">
            <span>✦ 퍼스널컬러 정밀 분석</span>
            <span>✦ 실제 얼굴형 기반 추천</span>
            <span>✦ 헤어스타일 9종 추가 제공</span>
          </div>
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
                <p>클릭하거나 사진을 드래그하세요</p>
                <span>정면 사진일수록 더 정확해요</span>
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
          <div className="privacy-box">
            <div className="privacy-box-title">🔒 개인정보 보호 안내</div>
            <div className="privacy-box-items">
              <div className="privacy-item">✓ 사진은 AI 분석 목적으로만 사용됩니다</div>
              <div className="privacy-item">✓ 서버에 저장되지 않으며 분석 즉시 폐기됩니다</div>
              <div className="privacy-item">✓ 제3자 공유 및 외부 전송 없음</div>
            </div>
          </div>
        </section>

        {/* 성별 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">01</span>
            <h3>성별</h3>
          </div>
          <div className="gender-grid">
            {[{ id: '여성', icon: '👩' }, { id: '남성', icon: '👨' }].map(({ id, icon }) => (
              <button key={id} className={`gender-btn ${profile.gender === id ? 'selected' : ''}`} onClick={() => update('gender', id)}>
                <span style={{ fontSize: '2.2rem' }}>{icon}</span>
                <span>{id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 기본 정보 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">02</span>
            <h3>기본 정보</h3>
          </div>
          <div className="info-row">
            {[
              { field: 'age' as const, label: '나이', unit: '세', placeholder: '28' },
              { field: 'height' as const, label: '키', unit: 'cm', placeholder: '165' },
              { field: 'weight' as const, label: '몸무게', unit: 'kg', placeholder: '55' },
            ].map(({ field, label, unit, placeholder }) => (
              <div key={field} className="input-group">
                <label>{label}</label>
                <div className="input-with-unit">
                  <input type="number" placeholder={placeholder} value={profile[field]} onChange={e => update(field, e.target.value)} />
                  <span>{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 피부색 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">03</span>
            <h3>피부색</h3>
          </div>
          <div className="skin-grid">
            {[
              { id: '아주 밝음', color: '#FAEBD7' },
              { id: '밝음', color: '#F5CBA7' },
              { id: '중간', color: '#E59866' },
              { id: '중간 어두움', color: '#C68642' },
              { id: '어두움', color: '#8D5524' },
              { id: '매우 어두움', color: '#4A2912' },
            ].map(({ id, color }) => (
              <button key={id} className={`skin-btn ${profile.skinTone === id ? 'selected' : ''}`} onClick={() => update('skinTone', id)}>
                <span className="skin-circle" style={{ background: color }} />
                <span>{id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 얼굴형 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">04</span>
            <h3>얼굴형</h3>
          </div>
          <div className="visual-grid">
            {faceShapes.map(({ id, svg }) => (
              <VisualCard key={id} label={id} svg={svg} selected={profile.faceShape === id} onClick={() => update('faceShape', id)} />
            ))}
          </div>
        </section>

        {/* 헤어스타일 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">05</span>
            <h3>헤어스타일</h3>
          </div>
          <div className="visual-grid">
            {hairStyles.map(({ id, svg }) => (
              <VisualCard key={id} label={id} svg={svg} selected={profile.hairStyle === id} onClick={() => update('hairStyle', id)} />
            ))}
          </div>
        </section>

        {/* 안경 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">06</span>
            <h3>안경</h3>
          </div>
          <div className="visual-grid">
            {glassesOptions.map(({ id, svg }) => (
              <VisualCard key={id} label={id} svg={svg} selected={profile.glasses === id} onClick={() => update('glasses', id)} />
            ))}
          </div>
        </section>

        {/* 체형 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">07</span>
            <h3>체형</h3>
          </div>
          <div className="visual-grid">
            {bodyTypes.map(({ id, svg }) => (
              <VisualCard key={id} label={id} svg={svg} selected={profile.bodyType === id} onClick={() => update('bodyType', id)} />
            ))}
          </div>
        </section>

        {/* 선호 스타일 */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-num">08</span>
            <h3>선호 스타일</h3>
          </div>
          <div className="option-grid">
            {[
              { label: '캐주얼', icon: '👕' },
              { label: '미니멀', icon: '🖤' },
              { label: '스트릿', icon: '🧢' },
              { label: '클래식', icon: '👔' },
              { label: '페미닌', icon: '🌷' },
              { label: '스포티', icon: '🏃' },
            ].map(({ label, icon }) => (
              <button key={label} className={`option-btn ${profile.style === label ? 'selected' : ''}`} onClick={() => update('style', label)}>
                <span className="option-icon">{icon}</span>
                <span className="option-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="submit-area">
          {!isComplete && <p className="submit-hint">모든 항목을 선택해주세요</p>}
          <button className="submit-btn" disabled={!isComplete} onClick={() => setSubmitted(true)}>
            스타일 추천 받기 →
          </button>
        </div>
      </main>
    </div>
  )
}
