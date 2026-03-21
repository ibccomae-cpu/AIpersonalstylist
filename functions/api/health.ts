interface Env {
  ANTHROPIC_API_KEY: string
}

export async function onRequestGet(context: { env: Env }) {
  const hasKey = !!context.env.ANTHROPIC_API_KEY
  const keyPreview = hasKey
    ? context.env.ANTHROPIC_API_KEY.slice(0, 7) + '...'
    : 'NOT SET'

  return new Response(
    JSON.stringify({ ok: hasKey, key: keyPreview }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
