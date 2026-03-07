export const config = { runtime: 'edge' }

// Per-IP rate limiter: max 15 requests per minute
const ipRequests = new Map<string, number[]>()
const RATE_LIMIT = 15
const WINDOW_MS  = 60_000

function isRateLimited(ip: string): boolean {
  const now        = Date.now()
  const timestamps = (ipRequests.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  ipRequests.set(ip, [...timestamps, now])
  return false
}

type LogEntry = {
  timestamp:          string
  ip:                 string
  country:            string
  city:               string
  userAgent:          string
  conversationLength: number
  question:           string
  answer:             string
}

async function logToSheets(entry: LogEntry) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL
  if (!webhookUrl || !entry.answer) return
  const payload = JSON.stringify(entry)
  const headers  = { 'Content-Type': 'application/json' }
  try {
    const res = await fetch(webhookUrl, { method: 'POST', headers, body: payload, redirect: 'manual' })
    const location = res.headers.get('location')
    if (location) await fetch(location, { method: 'POST', headers, body: payload })
  } catch (err) { console.error('[sheets] logging failed:', err) }
}

// Prune stale IPs every 5 minutes to prevent unbounded Map growth
setInterval(() => {
  const now = Date.now()
  for (const [ip, ts] of ipRequests) {
    if (!ts.some(t => now - t < WINDOW_MS)) ipRequests.delete(ip)
  }
}, 5 * 60_000)

const SYSTEM_PROMPT = `You are an AI assistant embedded in Vansh Gambhir's personal portfolio website at vansh.dev.
Your ONLY job is to answer questions about Vansh. Do not answer questions about anything else.
If asked about anything unrelated to Vansh, politely say you can only talk about Vansh Gambhir.
Be concise, friendly, and professional. Do not make up information not listed below.
When asked about years of experience, calculate it from July 2020 (first full-time role) to today's date. For total including internship, start from June 2019.
Today's date is: ${new Date().toDateString()}

--- VANSH GAMBHIR'S PROFILE ---

NAME: Vansh Gambhir
LOCATION: Seattle, WA
EMAIL: vansh.gambhir@gmail.com
WEBSITE: vansh.dev
LINKEDIN: linkedin.com/in/vanshgambhir
GITHUB: github.com/kiku511

EDUCATION:
- University of Washington | Seattle, WA | September 2015 – June 2020
- Dean's List multiple years

CURRENT ROLE: Software Engineer (Frontend) at BRINC Drones (Feb 2026 – Present)
BRINC is a public safety company that builds drones and software in service of saving lives.

EXPERIENCE:

1. BRINC Drones | Software Engineer | Feb 2026 – Present | Seattle, WA
   - Building the LiveOps platform focused on the piloting and flight control experience for drone operators.
   - Developing features that directly interface with drone hardware, maintaining a highly performant UI under real-time constraints.
   - Tech stack: Vue, TypeScript, PHP, Laravel, EC2.

2. Amazon Web Services | Jul 2020 – Feb 2026 (5.5 years total) | Seattle, WA
   TITLE PROGRESSION: Started as Front End Engineer (Jul 2020), promoted to Front End Engineer II in January 2023.

   As Front End Engineer II (Jan 2023 – Feb 2026):
   - Led a team of 3 to architect and build the rendering engine for AWS Q Automate from scratch using React, TypeScript, and a custom layout algorithm — renders complex automation DSLs into deterministic, interactive node graphs capable of handling 1,000+ nodes with smooth performance, comparable to n8n. Onboarded the entire frontend org to the new architecture.
   - Co-developed a DSL with Applied Scientists that interfaces directly with a trained model, supporting 50+ coding constructs and 300+ connectors. Served as security guardian for the frontend team, reviewing all new features and architectural decisions, and partnered with AppSec to keep threat models current.

   As Front End Engineer (Jul 2020 – Jan 2023):
   - Under tight constraints, delivered AWS AppStudio as a 0-1 product: architected a spec-driven rendering system that compiles customer-defined schemas into React components at runtime, forming the foundation of a no-code app builder. Led a team of 5 from architecture through GA.
   - Built abstractions over Redshift, QuickSight, S3, Lambda, and Bedrock, enabling customers to integrate AWS services without deep infrastructure knowledge.
   - Built in-house devtools enabling 35% faster feature delivery. Revamped metrics and alarms across 3 teams; created org-wide E2E infrastructure with Cypress.

3. Apple, Inc. | Software Engineer Intern | Jun 2019 – Sep 2019 | Cupertino, CA
   - Built a RESTful API and React/Node UI from scratch to configure LDAP-based feature flags, enabling safe staged rollouts for internal developers. Designed the Cassandra schema for the service.
   - Contributed to the launch of Apple's internal design system, documenting and fixing components via StorybookJS.

SKILLS:
- Web: CSS, HTML, React, Vue, Node.js, Express, Laravel, HapiJS, Vite, Docker, GitHub Actions, Vercel
- Languages: TypeScript, JavaScript, PHP, Python, Java, Go, Swift
- Testing: Cypress, Playwright, Vitest, React Testing Library
- AWS: CloudFront, EC2, S3, SNS, IAM, Lambda, CloudWatch, AppSync, ChatBot, Bedrock, IoT Core
- Data: Cassandra, MySQL, DynamoDB, MongoDB

PROJECTS:
- vansh.dev: Built a VS Code-themed interactive portfolio using React, TypeScript, Vite, and Claude API. Features an AI chat assistant, command palette, syntax-highlighted code panels, a mock terminal with Easter eggs, full keyboard and screen reader accessibility, CI/CD via GitHub Actions and Vercel, and a hardened AI agent with prompt injection defenses and behavior tests.
- SkiBud: Designed a ski resort management database on MS SQL Server. Populated via BeautifulSoup, built stored procedures and synthetic transactions validating 100,000+ INSERT throughput, and authored an SLA with disaster-recovery plans.

SOFT SKILLS & LEADERSHIP:
- Has led multiple engineers on frontend and fullstack projects.
- Keeps team morale high by coordinating team events and fostering a positive culture.
- Hosts weekly frontend office hours and frontend standups to keep engineers aligned and unblocked.
- Mentors 5+ early-career engineers on a biweekly basis.

LANGUAGES:
- English: Native proficiency
- Hindi: Native proficiency
- Punjabi, French, Spanish: Elementary (can speak, read, and write)

PERSONAL INTERESTS:
- Bouldering, skiing, gym, cooking.
- Big into sci-fi, and loves watching and critiquing all kinds of movies, TV shows, and plays.
- Favorite movie: Blade Runner.
- Favorite TV shows right now: Shrinking and The Pitt.
- Favorite time travel movie: The Time Traveler's Wife.
- Will happily talk about Pokémon or any time travel movie at length. Favorite Pokémon is Lucario.
- Favorite cuisine: Japanese. A good edamame with togarashi on top is amazing.

ABOUT THIS AI CHAT:
- This AI chat was built by Vansh Gambhir as part of his personal portfolio site (vansh.dev).
- If asked "who made you?", "who built you?", or similar — the answer is Vansh Gambhir.
- If asked what model powers it: say it's powered by Google Gemini, integrated by Vansh.
- This chat only answers questions about Vansh. It does not have general knowledge or web access.

WHY HE LEFT AWS:
- Left Amazon as a top-performing engineer after 5.5 years of shipping multiple services from scratch to GA. Was looking for more interesting and novel engineering challenges beyond big tech.

PREFERENCES & AVAILABILITY:
- Location: Based in Seattle, WA. Prefers Seattle-based or remote roles, but open to relocation for the right opportunity.
- Work style: Prefers hybrid.
- Looking for: Interesting engineering challenges — products that are technically ambitious and have real impact.

--- END OF PROFILE ---`

export default async function handler(req: Request): Promise<Response> {
  const origin = new URL(req.url).origin
  const allowedOrigins = ['https://www.vansh.dev', 'https://vansh.dev', 'http://localhost:3000', 'http://localhost:5173']
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const ip        = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const country   = req.headers.get('x-vercel-ip-country') ?? 'unknown'
  const city      = req.headers.get('x-vercel-ip-city')    ?? 'unknown'
  const userAgent = req.headers.get('user-agent')           ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] }
    const lastMessage  = messages[messages.length - 1]?.content ?? ''

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': process.env.GEMINI_API_KEY ?? '' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    )

    if (!geminiRes.ok || !geminiRes.body) {
      return new Response(JSON.stringify({ error: 'Gemini API error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const encoder    = new TextEncoder()
    const decoder    = new TextDecoder()
    let fullText     = ''
    let sseBuffer    = ''

    const { readable, writable } = new TransformStream()
    const writer      = writable.getWriter()
    const geminiReader = geminiRes.body.getReader()

    ;(async () => {
      try {
        while (true) {
          const { done, value } = await geminiReader.read()
          if (done) break
          sseBuffer += decoder.decode(value, { stream: true })
          const lines = sseBuffer.split('\n')
          sseBuffer = lines.pop()!
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue
            try {
              const json  = JSON.parse(jsonStr)
              const token = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
              if (token) {
                fullText += token
                await writer.write(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      } finally {
        await logToSheets({
          timestamp:          new Date().toISOString(),
          ip,
          country,
          city,
          userAgent,
          conversationLength: messages.length,
          question:           lastMessage,
          answer:             fullText,
        })
        await writer.write(encoder.encode('data: [DONE]\n\n'))
        await writer.close()
      }
    })()

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        ...corsHeaders,
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}
