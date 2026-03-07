export const config = { runtime: 'edge' }

// Per-IP rate limiter: max 3 requests per hour
const ipRequests = new Map<string, number[]>()
const RATE_LIMIT = 3
const WINDOW_MS  = 60 * 60_000

function isRateLimited(ip: string): boolean {
  const now        = Date.now()
  const timestamps = (ipRequests.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  ipRequests.set(ip, [...timestamps, now])
  return false
}

export default async function handler(req: Request): Promise<Response> {
  const origin = new URL(req.url).origin
  const allowedOrigins = ['https://www.vansh.dev', 'https://vansh.dev', 'http://localhost:3000', 'http://localhost:5173']
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'GET')    return new Response('Method Not Allowed', { status: 405 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit reached. Try again in an hour.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    const res = await fetch('https://wttr.in/Seattle?T', {
      headers: { 'User-Agent': 'curl/8.0', 'Accept': 'text/plain' },
    })
    const text = await res.text()
    return new Response(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch weather.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}
