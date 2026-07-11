import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// Served via Route Handler so robots.txt is available in dev too.
// Content-Signal directives belong in HTTP response headers, not robots.txt
// (non-standard lines cause validator errors). Those headers are set in
// next.config.ts under the Vary/discovery header block instead.
//
// Removed: Disallow: /*?* — that pattern blocks all query-param URLs
// (portfolio tabs, estimate filters, etc.) and was flagged as 106 blocked
// resources by Semrush. Specific admin paths are sufficient.
export const dynamic = 'force-static'

const ADMIN_PATHS = [
  '/hq-portal',
  '/admin',
  '/dashboard',
  '/api/',
  '/order/',
]

const body = `User-agent: *
Allow: /
Allow: /_next/static/
Allow: /_next/image
Disallow: /login
Disallow: /register
Disallow: /logout
Disallow: /chat
Disallow: /health
${ADMIN_PATHS.map((p) => `Disallow: ${p}`).join('\n')}

User-agent: Googlebot
Allow: /
Allow: /_next/static/
Allow: /_next/image
${ADMIN_PATHS.map((p) => `Disallow: ${p}`).join('\n')}

User-agent: Bingbot
Allow: /
Allow: /_next/static/
Allow: /_next/image
${ADMIN_PATHS.map((p) => `Disallow: ${p}`).join('\n')}

User-agent: Google-Extended
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: anthropic-ai
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: DuckDuckBot
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: CohereBot
User-agent: Meta-ExternalAgent
Allow: /
Allow: /llms.txt

Sitemap: ${SITE_URL}/sitemap.xml
`

export async function GET() {
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
