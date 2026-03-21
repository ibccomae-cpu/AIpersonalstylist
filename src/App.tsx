import { useState } from 'react'
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

const TOTAL_STEPS = 8

// ===== Reusable Visual Option Card =====
function VisualCard({
  label, svg, selected, onClick, wide,
}: {
  label: string
  svg: React.ReactNode
  selected: boolean
  onClick: () => void
  wide?: boolean
}) {
  return (
    <button className={`visual-card ${selected ? 'selected' : ''} ${wide ? 'wide' : ''}`} onClick={onClick}>
      <div className="visual-svg-wrap">{svg}</div>
      <span className="visual-label">{label}</span>
    </button>
  )
}

// ===== SVG Definitions =====

const faceShapes = [
  {
    id: '타원형',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="40" cy="54" rx="28" ry="42" />
        <circle cx="29" cy="46" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="51" cy="46" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '둥근형',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="40" cy="54" r="34" />
        <circle cx="28" cy="48" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="52" cy="48" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '각진형',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="8" y="12" width="64" height="74" rx="6" />
        <circle cx="28" cy="48" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="52" cy="48" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '하트형',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M40 88 C18 66,6 44,10 28 C14 12,28 8,40 18 C52 8,66 12,70 28 C74 44,62 66,40 88Z" />
        <circle cx="28" cy="44" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="52" cy="44" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '역삼각형',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M8 18 C10 8,28 4,40 4 C52 4,70 8,72 18 C80 36,62 72,40 90 C18 72,0 36,8 18Z" />
        <circle cx="28" cy="42" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="52" cy="42" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

const hairStyles = [
  {
    id: '짧은 단발',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 56 C16 30,25 10,40 10 C55 10,64 30,64 56 L64 78 L16 78Z"
          fill="currentColor" fillOpacity="0.25" />
        <ellipse cx="40" cy="62" rx="21" ry="27" strokeDasharray="3 2" />
        <circle cx="31" cy="55" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="55" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '긴 생머리',
    svg: (
      <svg viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 54 C16 28,25 8,40 8 C55 8,64 28,64 54 L66 100 C66 106,56 110,50 110 L30 110 C24 110,14 106,14 100Z"
          fill="currentColor" fillOpacity="0.25" />
        <ellipse cx="40" cy="58" rx="21" ry="28" strokeDasharray="3 2" />
        <circle cx="31" cy="52" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="52" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '웨이브',
    svg: (
      <svg viewBox="0 0 80 110" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 54 C16 28,25 8,40 8 C55 8,64 28,64 54 L67 84 C62 78,58 86,54 80 C50 86,46 78,42 84 C38 78,34 86,30 80 C26 86,22 78,13 84Z"
          fill="currentColor" fillOpacity="0.25" />
        <ellipse cx="40" cy="58" rx="21" ry="28" strokeDasharray="3 2" />
        <circle cx="31" cy="52" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="52" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '짧은 커트',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 58 C20 34,27 14,40 14 C53 14,60 34,60 58 C60 62,59 65,58 66 L22 66 C21 65,20 62,20 58Z"
          fill="currentColor" fillOpacity="0.25" />
        <ellipse cx="40" cy="64" rx="20" ry="26" strokeDasharray="3 2" />
        <circle cx="31" cy="57" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="57" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '업스타일',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="40" cy="14" rx="13" ry="9" fill="currentColor" fillOpacity="0.3" />
        <line x1="34" y1="22" x2="32" y2="30" />
        <line x1="40" y1="23" x2="40" y2="31" />
        <line x1="46" y1="22" x2="48" y2="30" />
        <path d="M20 58 C20 34,27 12,40 12 C53 12,60 34,60 58" />
        <ellipse cx="40" cy="64" rx="20" ry="26" strokeDasharray="3 2" />
        <circle cx="31" cy="57" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="57" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '곱슬머리',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 58 C8 44,10 28,14 22 C16 16,14 10,18 7 C22 4,24 7,24 7 C26 3,30 3,32 6 C34 3,38 2,40 2 C42 2,46 3,48 6 C50 3,54 4,56 7 C60 10,58 16,62 22 C66 30,68 44,70 58 C70 72,60 82,40 82 C20 82,10 72,10 58Z"
          fill="currentColor" fillOpacity="0.25" />
        <ellipse cx="40" cy="60" rx="20" ry="26" strokeDasharray="3 2" />
        <circle cx="31" cy="54" r="2" fill="currentColor" stroke="none" />
        <circle cx="49" cy="54" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

const glassesOptions = [
  {
    id: '없음',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="25" y1="18" x2="55" y2="32" strokeOpacity="0.25" />
        <line x1="55" y1="18" x2="25" y2="32" strokeOpacity="0.25" />
        <text x="40" y="30" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.4" stroke="none">없음</text>
      </svg>
    ),
  },
  {
    id: '원형',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="22" cy="25" r="13" />
        <circle cx="58" cy="25" r="13" />
        <line x1="35" y1="25" x2="45" y2="25" />
        <line x1="5" y1="20" x2="9" y2="25" />
        <line x1="75" y1="20" x2="71" y2="25" />
      </svg>
    ),
  },
  {
    id: '사각형',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="6" y="12" width="28" height="22" rx="3" />
        <rect x="46" y="12" width="28" height="22" rx="3" />
        <line x1="34" y1="23" x2="46" y2="23" />
        <line x1="4" y1="17" x2="6" y2="23" />
        <line x1="76" y1="17" x2="74" y2="23" />
      </svg>
    ),
  },
  {
    id: '고양이눈형',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M6 30 C6 30,8 14,22 12 C34 10,38 22,36 30 C34 36,18 36,10 32Z" />
        <path d="M74 30 C74 30,72 14,58 12 C46 10,42 22,44 30 C46 36,62 36,70 32Z" />
        <line x1="36" y1="22" x2="44" y2="22" />
        <line x1="4" y1="22" x2="6" y2="30" />
        <line x1="76" y1="22" x2="74" y2="30" />
      </svg>
    ),
  },
  {
    id: '오버사이즈',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="8" width="34" height="30" rx="6" />
        <rect x="43" y="8" width="34" height="30" rx="6" />
        <line x1="37" y1="23" x2="43" y2="23" />
        <line x1="2" y1="14" x2="3" y2="23" />
        <line x1="78" y1="14" x2="77" y2="23" />
      </svg>
    ),
  },
]

const bodyTypes = [
  {
    id: '슬림형',
    svg: (
      <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="25" cy="11" r="8" />
        <path d="M18 20 C16 30,16 42,17 54 C18 64,18 72,18 80 L32 80 C32 72,32 64,33 54 C34 42,34 30,32 20Z"
          fill="currentColor" fillOpacity="0.2" />
        <line x1="20" y1="80" x2="17" y2="106" />
        <line x1="30" y1="80" x2="33" y2="106" />
      </svg>
    ),
  },
  {
    id: '표준형',
    svg: (
      <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="25" cy="11" r="8" />
        <path d="M16 20 C12 30,12 44,14 56 C16 64,17 72,17 80 L33 80 C33 72,34 64,36 56 C38 44,38 30,34 20Z"
          fill="currentColor" fillOpacity="0.2" />
        <line x1="19" y1="80" x2="16" y2="106" />
        <line x1="31" y1="80" x2="34" y2="106" />
      </svg>
    ),
  },
  {
    id: '근육형',
    svg: (
      <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="25" cy="11" r="8" />
        <path d="M10 22 C8 30,10 44,14 56 C17 64,18 72,18 80 L32 80 C32 72,33 64,36 56 C40 44,42 30,40 22 C36 18,30 16,25 16 C20 16,14 18,10 22Z"
          fill="currentColor" fillOpacity="0.2" />
        <line x1="19" y1="80" x2="16" y2="106" />
        <line x1="31" y1="80" x2="34" y2="106" />
      </svg>
    ),
  },
  {
    id: '통통형',
    svg: (
      <svg viewBox="0 0 50 110" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="25" cy="11" r="8" />
        <path d="M14 20 C8 30,6 44,8 58 C10 66,14 74,16 80 L34 80 C36 74,40 66,42 58 C44 44,42 30,36 20Z"
          fill="currentColor" fillOpacity="0.2" />
        <line x1="18" y1="80" x2="15" y2="106" />
        <line x1="32" y1="80" x2="35" y2="106" />
      </svg>
    ),
  },
]

// ===== Main App =====
export default function App() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<ProfileData>({
    gender: '', age: '', height: '', weight: '',
    skinTone: '', faceShape: '', hairStyle: '', glasses: '',
    bodyType: '', style: '',
  })

  const update = (field: keyof ProfileData, value: string) =>
    setProfile(prev => ({ ...prev, [field]: value }))

  const canNext = () => {
    if (step === 1) return !!profile.gender
    if (step === 2) return !!profile.age && !!profile.height && !!profile.weight
    if (step === 3) return !!profile.skinTone
    if (step === 4) return !!profile.faceShape
    if (step === 5) return !!profile.hairStyle
    if (step === 6) return !!profile.glasses
    if (step === 7) return !!profile.bodyType
    if (step === 8) return !!profile.style
    return false
  }

  const stepTitles = ['성별', '기본 정보', '피부색', '얼굴형', '헤어스타일', '안경', '체형', '선호 스타일']

  const reset = () => {
    setStep(1)
    setProfile({ gender: '', age: '', height: '', weight: '', skinTone: '', faceShape: '', hairStyle: '', glasses: '', bodyType: '', style: '' })
  }

  return (
    <div className="stylist-app">
      <header className="app-header">
        <span className="logo-text">✦ AI Personal Stylist</span>
      </header>

      <main className="main-content">
        {step <= TOTAL_STEPS && (
          <>
            <div className="step-info">
              <span className="step-label">{stepTitles[step - 1]}</span>
              <span className="step-count">{step} / {TOTAL_STEPS}</span>
            </div>
            <div className="progress-bar">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
                <div key={n} className={`progress-dot ${step >= n ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}

        {/* Step 1: Gender */}
        {step === 1 && (
          <section className="card-section">
            <h2>안녕하세요!</h2>
            <p className="subtitle">나만을 위한 스타일 추천을 시작해볼게요.<br />먼저 성별을 알려주세요.</p>
            <div className="gender-grid">
              {[{ id: '여성', icon: '👩' }, { id: '남성', icon: '👨' }].map(({ id, icon }) => (
                <button key={id} className={`gender-btn ${profile.gender === id ? 'selected' : ''}`} onClick={() => update('gender', id)}>
                  <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                  <span>{id}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <section className="card-section">
            <h2>기본 정보</h2>
            <p className="subtitle">체형에 맞는 스타일을 추천해드릴게요.</p>
            {[
              { field: 'age' as const, label: '나이', unit: '세', placeholder: '예: 28' },
              { field: 'height' as const, label: '키', unit: 'cm', placeholder: '예: 165' },
              { field: 'weight' as const, label: '몸무게', unit: 'kg', placeholder: '예: 55' },
            ].map(({ field, label, unit, placeholder }) => (
              <div key={field} className="input-group">
                <label>{label}</label>
                <div className="input-with-unit">
                  <input type="number" placeholder={placeholder} value={profile[field]} onChange={e => update(field, e.target.value)} />
                  <span>{unit}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Step 3: Skin Tone */}
        {step === 3 && (
          <section className="card-section">
            <h2>피부색</h2>
            <p className="subtitle">본인의 피부톤과 가장 가까운 색을 선택해주세요.</p>
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
        )}

        {/* Step 4: Face Shape */}
        {step === 4 && (
          <section className="card-section">
            <h2>얼굴형</h2>
            <p className="subtitle">얼굴형을 선택해주세요.</p>
            <div className="visual-grid col3">
              {faceShapes.map(({ id, svg }) => (
                <VisualCard key={id} label={id} svg={svg} selected={profile.faceShape === id} onClick={() => update('faceShape', id)} />
              ))}
            </div>
          </section>
        )}

        {/* Step 5: Hair Style */}
        {step === 5 && (
          <section className="card-section">
            <h2>헤어스타일</h2>
            <p className="subtitle">현재 헤어스타일을 선택해주세요.</p>
            <div className="visual-grid col3">
              {hairStyles.map(({ id, svg }) => (
                <VisualCard key={id} label={id} svg={svg} selected={profile.hairStyle === id} onClick={() => update('hairStyle', id)} />
              ))}
            </div>
          </section>
        )}

        {/* Step 6: Glasses */}
        {step === 6 && (
          <section className="card-section">
            <h2>안경</h2>
            <p className="subtitle">안경 스타일을 선택해주세요.</p>
            <div className="visual-grid col3">
              {glassesOptions.map(({ id, svg }) => (
                <VisualCard key={id} label={id} svg={svg} selected={profile.glasses === id} onClick={() => update('glasses', id)} wide />
              ))}
            </div>
          </section>
        )}

        {/* Step 7: Body Type */}
        {step === 7 && (
          <section className="card-section">
            <h2>체형</h2>
            <p className="subtitle">본인의 체형과 가장 가까운 것을 선택해주세요.</p>
            <div className="visual-grid col4">
              {bodyTypes.map(({ id, svg }) => (
                <VisualCard key={id} label={id} svg={svg} selected={profile.bodyType === id} onClick={() => update('bodyType', id)} />
              ))}
            </div>
          </section>
        )}

        {/* Step 8: Style Preference */}
        {step === 8 && (
          <section className="card-section">
            <h2>선호 스타일</h2>
            <p className="subtitle">평소 좋아하는 스타일을 선택해주세요.</p>
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
        )}

        {/* Result */}
        {step === TOTAL_STEPS + 1 && (
          <section className="card-section result-section">
            <div className="result-icon">✦</div>
            <h2>프로필 완성!</h2>
            <p className="subtitle">AI가 맞춤 스타일을 분석 중이에요...</p>
            <div className="profile-summary">
              {[
                { label: '성별', value: profile.gender },
                { label: '나이 / 키 / 몸무게', value: `${profile.age}세 / ${profile.height}cm / ${profile.weight}kg` },
                { label: '피부색', value: profile.skinTone },
                { label: '얼굴형', value: profile.faceShape },
                { label: '헤어스타일', value: profile.hairStyle },
                { label: '안경', value: profile.glasses },
                { label: '체형', value: profile.bodyType },
                { label: '선호 스타일', value: profile.style },
              ].map(({ label, value }) => (
                <div key={label} className="summary-item">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button className="next-btn" onClick={reset}>다시 시작하기</button>
          </section>
        )}

        {step <= TOTAL_STEPS && (
          <div className="btn-row">
            {step > 1 && <button className="back-btn" onClick={() => setStep(s => s - 1)}>← 이전</button>}
            <button className="next-btn" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              {step === TOTAL_STEPS ? '완료' : '다음 →'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
