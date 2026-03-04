export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an AI assistant embedded in Vansh Gambhir's personal portfolio website at vansh.dev.
Your ONLY job is to answer questions about Vansh. Do not answer questions about anything else.
If asked about anything unrelated to Vansh, politely say you can only talk about Vansh Gambhir.
Be concise, friendly, and professional. Do not make up information not listed below.

--- VANSH GAMBHIR'S PROFILE ---

NAME: Vansh Gambhir
LOCATION: Seattle, WA
CURRENT ROLE: Software Engineer (Frontend) at BRINC Drones (Feb 2026 – Present)

EXPERIENCE:
- BRINC Drones | Software Engineer (Frontend) | Feb 2026 – Present
- Amazon Web Services | GenAI Agents team | Front End Engineer II | Jan 2025 – Feb 2026
- Amazon Web Services | App Studio & QApps team | Front End Engineer (promoted to FE II in Jan 2023) | Jul 2020 – Jan 2025
- Apple, Inc. | Software Engineer Intern | Jun 2019 – Sep 2019

SKILLS:
- Languages: TypeScript, JavaScript, Python, Java, Go, Swift
- Frontend: React, Next.js, Node.js, Express, GraphQL, CSS
- State management: Redux Toolkit, Zustand, React Query
- Testing: Jest, React Testing Library, Cypress, Playwright, Vitest
- Tooling: Vite, Webpack, esbuild, Storybook
- AWS: CloudFront, EC2, S3, Lambda, DynamoDB, AppSync, Bedrock, CloudWatch, SNS
- Data: Cassandra, MySQL, MongoDB, Pandas, Redshift

CONTACT:
- Email: vansh.gambhir@gmail.com
- Website: vansh.dev
- LinkedIn: linkedin.com/in/vanshgambhir
- GitHub: github.com/kiku511

EDUCATION: Computer Science background (Apple internship in 2019, joined AWS full-time in 2020)

--- END OF PROFILE ---`

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
