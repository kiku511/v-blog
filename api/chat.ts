export const config = { runtime: 'edge' }

// Per-IP rate limiter: max 5 requests per minute
const ipRequests = new Map<string, number[]>()
const RATE_LIMIT = 15
const WINDOW_MS  = 60_000

function isRateLimited(ip: string): boolean {
  const now       = Date.now()
  const timestamps = (ipRequests.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  ipRequests.set(ip, [...timestamps, now])
  return false
}

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

1. BRINC Drones | Software Engineer (Frontend) | Feb 2026 – Present | Seattle, WA
   - On the LiveOps team, building software that helps pilots monitor and manage drone missions in the field.
   - BRINC serves public safety agencies — helping first responders use drones to save lives.

2. Amazon Web Services – GenAI Agents | Front End Engineer II | Jan 2025 – Feb 2026 | Seattle, WA
   - Built a brand new stealth service to create AI Agents as part of the AWS GenAI org.
   - Created a custom layout engine to allow users to build and visualize agentic workflows supporting 50+ coding constructs and 300+ first and third-party connectors.
   - Partnered with Applied Scientists to co-develop a DSL that interfaces directly with a trained model, enabling both human and AI-based edits to workflows.

3. Amazon Web Services – App Studio & QApps | Front End Engineer | Jul 2020 – Jan 2025 | Seattle, WA
   - Promoted to Front End Engineer II in January 2023.
   - Launched an S-Team goal from vision to GA (General Availability).
   - Led a team of 5 engineers to deliver AI-enriched React components for a new stealth low-code service within AWS, including schema design, architecture, and code generation.
   - Built smart abstractions over AWS Redshift, QuickSight, S3, Lambda, and Bedrock for customers.
   - Created in-house devtools and scripts that improved engineering velocity, enabling 35% faster feature delivery.
   - Revamped metrics dashboards and alarms for 3 teams; built end-to-end infrastructure for the org using Cypress.

4. Apple, Inc. | Software Engineer Intern | Jun 2019 – Sep 2019 | Cupertino, CA
   - Built a RESTful API and UI using ReactJS, NodeJS, and Express to configure feature flags based on LDAP groups and users from scratch, enabling safe staged rollouts.
   - Designed a Cassandra database schema for the service.
   - Fixed UI issues in the internal CI/CD platform, including error handling for misconfigured webhooks.
   - Helped launch the first version of an internal design system, fixing style issues and documenting components with StorybookJS.

SKILLS:
- Web: CSS, HTML, JSX, React, Next.js, Node.js, Express, GraphQL, Vega
- Languages: TypeScript, JavaScript, Python, Java, Go, Swift, R
- State: Redux Toolkit, Zustand, React Query
- Testing: Jest, React Testing Library, Cypress, Playwright, Vitest
- Tooling: Vite, Webpack, esbuild, Storybook
- AWS: CloudFront, EC2, S3, SNS, IAM, Lambda, CloudWatch, AppSync, Bedrock, DynamoDB
- Data: Cassandra, MySQL, MongoDB, DynamoDB, Redshift, Pandas, Tableau

PROJECTS:
- Data Analysis for Pratham (non-profit): Cleaned and analyzed large datasets using R; created interactive Tableau visualizations on educational app usage among rural Indian students.
- SkiBud: Designed and coded a ski resort management database in MS SQL Server; built stored procedures and synthetic transactions validating 100,000+ INSERTS; developed disaster-recovery plans.

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
- Left Amazon as a top-performing engineer after 4.5+ years of shipping multiple services from scratch to GA. Was looking for more interesting and novel engineering challenges beyond big tech.

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

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': process.env.GEMINI_API_KEY ?? '' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
        }),
      }
    )

    const data = await geminiRes.json() as {
      candidates?: { content: { parts: { text: string }[] } }[]
      error?: { message: string }
    }

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.'

    // Fire-and-forget log to Google Sheets
    const webhookUrl = process.env.SHEETS_WEBHOOK_URL
    console.log('[sheets] webhookUrl present:', !!webhookUrl)
    if (webhookUrl) {
      const question = messages[messages.length - 1]?.content ?? ''
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, question, answer: text }),
        redirect: 'follow',
      })
        .then(r => console.log('[sheets] status:', r.status))
        .catch(err => console.log('[sheets] error:', err))
    }

    return new Response(JSON.stringify({ content: text }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}
