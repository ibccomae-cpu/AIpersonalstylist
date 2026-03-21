import { useState } from 'react'
import './App.css'

interface ProfileData {
  gender: string
  age: string
  height: string
  weight: string
  bodyType: string
  style: string
}

export default function App() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<ProfileData>({
    gender: '',
    age: '',
    height: '',
    weight: '',
    bodyType: '',
    style: '',
  })

  const update = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const canNext = () => {
    if (step === 1) return profile.gender !== ''
    if (step === 2) return profile.age !== '' && profile.height !== '' && profile.weight !== ''
    if (step === 3) return profile.bodyType !== ''
    if (step === 4) return profile.style !== ''
    return false
  }

  return (
    <div className="stylist-app">
      <header className="app-header">
        <span className="logo-text">✦ AI Personal Stylist</span>
      </header>

      <main className="main-content">
        <div className="progress-bar">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`progress-dot ${step >= n ? 'active' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <section className="card-section">
            <h2>안녕하세요!</h2>
            <p className="subtitle">나만을 위한 스타일 추천을 시작해볼게요.<br />먼저 성별을 알려주세요.</p>
            <div className="gender-grid">
              {['여성', '남성', '논바이너리'].map(g => (
                <button
                  key={g}
                  className={`gender-btn ${profile.gender === g ? 'selected' : ''}`}
                  onClick={() => update('gender', g)}
                >
                  {g === '여성' ? '👩' : g === '남성' ? '👨' : '🧑'}
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="card-section">
            <h2>기본 정보</h2>
            <p className="subtitle">체형에 맞는 스타일을 추천해드릴게요.</p>
            <div className="input-group">
              <label>나이</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  placeholder="예: 28"
                  value={profile.age}
                  onChange={e => update('age', e.target.value)}
                />
                <span>세</span>
              </div>
            </div>
            <div className="input-group">
              <label>키</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  placeholder="예: 165"
                  value={profile.height}
                  onChange={e => update('height', e.target.value)}
                />
                <span>cm</span>
              </div>
            </div>
            <div className="input-group">
              <label>몸무게</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  placeholder="예: 55"
                  value={profile.weight}
                  onChange={e => update('weight', e.target.value)}
                />
                <span>kg</span>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="card-section">
            <h2>체형</h2>
            <p className="subtitle">본인의 체형과 가장 가까운 것을 선택해주세요.</p>
            <div className="option-grid">
              {[
                { label: '슬림형', desc: '마른 편이에요', icon: '🌿' },
                { label: '표준형', desc: '평균적인 체형이에요', icon: '⚖️' },
                { label: '근육형', desc: '근육질 체형이에요', icon: '💪' },
                { label: '통통형', desc: '통통한 편이에요', icon: '🌸' },
              ].map(({ label, desc, icon }) => (
                <button
                  key={label}
                  className={`option-btn ${profile.bodyType === label ? 'selected' : ''}`}
                  onClick={() => update('bodyType', label)}
                >
                  <span className="option-icon">{icon}</span>
                  <span className="option-label">{label}</span>
                  <span className="option-desc">{desc}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
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
                <button
                  key={label}
                  className={`option-btn ${profile.style === label ? 'selected' : ''}`}
                  onClick={() => update('style', label)}
                >
                  <span className="option-icon">{icon}</span>
                  <span className="option-label">{label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="card-section result-section">
            <div className="result-icon">✦</div>
            <h2>프로필 완성!</h2>
            <p className="subtitle">AI가 맞춤 스타일을 분석 중이에요...</p>
            <div className="profile-summary">
              <div className="summary-item"><span>성별</span><strong>{profile.gender}</strong></div>
              <div className="summary-item"><span>나이</span><strong>{profile.age}세</strong></div>
              <div className="summary-item"><span>키 / 몸무게</span><strong>{profile.height}cm / {profile.weight}kg</strong></div>
              <div className="summary-item"><span>체형</span><strong>{profile.bodyType}</strong></div>
              <div className="summary-item"><span>선호 스타일</span><strong>{profile.style}</strong></div>
            </div>
            <button className="next-btn" onClick={() => { setStep(1); setProfile({ gender: '', age: '', height: '', weight: '', bodyType: '', style: '' }) }}>
              다시 시작하기
            </button>
          </section>
        )}

        {step < 5 && (
          <div className="btn-row">
            {step > 1 && (
              <button className="back-btn" onClick={() => setStep(s => s - 1)}>← 이전</button>
            )}
            <button
              className="next-btn"
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
            >
              {step === 4 ? '완료' : '다음 →'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
