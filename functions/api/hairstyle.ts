interface Env {
  ANTHROPIC_API_KEY: string
  PEXELS_API_KEY?: string
}

interface HairstyleStyle {
  name: string
  emoji: string
  description: string
  reason: string
  difficulty: string
  mood: string
  tip: string
  imageKeyword: string
  imageUrl?: string
}

interface HairstyleResult {
  faceAnalysis: string
  styles: HairstyleStyle[]
}

async function fetchPexelsImage(keyword: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=portrait`
    const res = await fetch(url, { headers: { Authorization: apiKey } })
    if (!res.ok) return null
    const data = await res.json() as { photos: Array<{ src: { medium: string } }> }
    return data.photos[0]?.src?.medium || null
  } catch {
    return null
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const env = context.env
  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }), { status: 500 })
  }

  let body: { photo?: string }
  try {
    body = await context.request.json()
  } catch {
    return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), { status: 400 })
  }

  const { photo } = body
  if (!photo) {
    return new Response(JSON.stringify({ error: '사진이 필요합니다.' }), { status: 400 })
  }

  const match = photo.match(/^data:(image\/\w+);base64,(.+)$/)
  if (!match) {
    return new Response(JSON.stringify({ error: '잘못된 이미지 형식입니다.' }), { status: 400 })
  }

  const [, mediaType, base64Data] = match

  const prompt = `당신은 세계 최고의 헤어스타일리스트입니다. 이 사람의 얼굴을 분석하여 가장 잘 어울리는 헤어스타일 9가지를 추천해주세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트나 마크다운 없이 JSON만 출력하세요:
{
  "faceAnalysis": "얼굴형과 특징 분석 (2-3문장, 구체적으로)",
  "styles": [
    {
      "name": "헤어스타일 이름",
      "emoji": "이모지 1개",
      "description": "스타일 설명 (1-2문장)",
      "reason": "이 얼굴에 어울리는 이유 (1문장)",
      "difficulty": "쉬움",
      "mood": "캐주얼",
      "tip": "스타일링 팁 (1문장)",
      "imageKeyword": "English search keyword for this hairstyle style (e.g. 'korean bob haircut woman', 'long wavy hair asian')"
    }
  ]
}

difficulty는 반드시 쉬움/보통/어려움 중 하나.
mood는 반드시 캐주얼/포멀/트렌디/클래식/청순/시크 중 하나.
imageKeyword는 Pexels 이미지 검색에 쓸 영문 키워드 (구체적이고 사실적인 헤어스타일 사진이 나오도록).
styles 배열에 정확히 9개의 스타일을 포함하세요.`

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
          { type: 'text', text: prompt }
        ]
      }]
    })
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    return new Response(JSON.stringify({ error: `Claude API 오류: ${err}` }), { status: anthropicRes.status })
  }

  const claudeData = await anthropicRes.json() as { content: Array<{ type: string; text: string }> }
  const text = claudeData.content[0]?.text || ''

  let parsed: HairstyleResult
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON을 찾을 수 없습니다')
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    return new Response(JSON.stringify({ error: 'AI 응답 파싱 실패', raw: text }), { status: 500 })
  }

  // Fetch Pexels images in parallel if API key is available
  if (env.PEXELS_API_KEY) {
    const imageUrls = await Promise.all(
      parsed.styles.map(s => fetchPexelsImage(s.imageKeyword, env.PEXELS_API_KEY!))
    )
    parsed.styles = parsed.styles.map((s, i) => ({ ...s, imageUrl: imageUrls[i] || undefined }))
  }

  return new Response(JSON.stringify(parsed), {
    headers: { 'content-type': 'application/json' }
  })
}
