interface Env {
  ANTHROPIC_API_KEY: string
}

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

function buildPrompt(p: ProfileData): string {
  return `다음 고객 정보를 분석하여 맞춤 스타일 컨설팅 보고서를 작성해주세요.

**고객 프로필**
- 성별: ${p.gender}
- 나이: ${p.age}세
- 키 / 몸무게: ${p.height}cm / ${p.weight}kg
- 피부색: ${p.skinTone}
- 얼굴형: ${p.faceShape}
- 헤어스타일: ${p.hairStyle}
- 안경: ${p.glasses}
- 체형: ${p.bodyType}
- 선호 스타일: ${p.style}

아래 구조로 보고서를 작성해주세요:

## 체형 & 실루엣 분석
체형의 특징과 이를 살리거나 보완하는 핵심 실루엣 원칙을 설명해주세요.

## 퍼스널 컬러 팔레트
피부톤에 어울리는 베스트 컬러, 포인트 컬러, 피해야 할 컬러를 구체적으로 알려주세요.

## 얼굴형 & 헤어 / 액세서리 팁
얼굴형을 살리는 네크라인, 헤어스타일, 안경 프레임, 액세서리를 제안해주세요.

## 추천 베이직 아이템
옷장에 꼭 있어야 할 10가지 핵심 아이템을 상의, 하의, 아우터, 신발, 가방 카테고리로 나눠 설명해주세요.

## 시즌별 코디 제안
봄/여름 2가지, 가을/겨울 2가지 완성된 코디를 구체적으로 제안해주세요.

## 스타일리스트 총평
이 고객만을 위한 핵심 스타일 조언을 친근하게 마무리해주세요.`
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (!env.ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 })
  }

  let profile: ProfileData
  try {
    profile = await request.json() as ProfileData
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  // Call Anthropic API directly with fetch (more compatible with Cloudflare Workers)
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      stream: true,
      system: '당신은 10년 경력의 전문 퍼스널 스타일리스트입니다. 고객의 신체적 특성과 개인 취향을 깊이 분석하여 실용적이고 구체적인 스타일 컨설팅 보고서를 작성합니다. 보고서는 따뜻하고 전문적인 어조로, 즉시 실행 가능한 조언을 담아 작성하세요.',
      messages: [{ role: 'user', content: buildPrompt(profile) }],
    }),
  })

  if (!anthropicRes.ok || !anthropicRes.body) {
    const errText = await anthropicRes.text()
    return new Response(`Anthropic API error ${anthropicRes.status}: ${errText}`, { status: 502 })
  }

  // Parse SSE stream and forward only text_delta content
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  async function processStream() {
    const reader = anthropicRes.body!.getReader()
    let buffer = ''
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              typeof parsed.delta.text === 'string'
            ) {
              await writer.write(encoder.encode(parsed.delta.text))
            }
          } catch { /* skip malformed lines */ }
        }
      }
    } catch (e) {
      // Stream interrupted
    } finally {
      writer.close()
    }
  }

  processStream()

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
