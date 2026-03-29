interface Env {
  ANTHROPIC_API_KEY: string
  PEXELS_API_KEY?: string
}

export async function onRequestGet(context: { env: Env }) {
  const hasKey = !!context.env.ANTHROPIC_API_KEY
  const hasPexels = !!context.env.PEXELS_API_KEY

  return new Response(
    JSON.stringify({
      ok: hasKey,
      anthropic: hasKey ? context.env.ANTHROPIC_API_KEY.slice(0, 7) + '...' : 'NOT SET',
      pexels: hasPexels ? context.env.PEXELS_API_KEY!.slice(0, 6) + '...' : 'NOT SET',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
