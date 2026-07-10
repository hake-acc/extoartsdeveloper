import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// Served directly (instead of via next-sitemap's postbuild-only output) so
// it's present in dev too, and so it can carry Content-Signal directives
// (https://contentsignals.org/) that next-sitemap doesn't support.
export const dynamic = 'force-static'

// User preference, confirmed with the site owner: allow AI training and
// allow AI assistants to use content as live-answer input; search indexing
// stays allowed as normal.
const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-train=yes, ai-input=yes'

const COMMON_DISALLOW = [
  '/hq-portal',
  '/admin',
  '/dashboard',
  '/login',
  '/register',
  '/logout',
  '/apply',
  '/api/',
  '/order/',
  '/chat',
  '/health',
]

const body = `User-agent: *
${CONTENT_SIGNAL}
Allow: /
Allow: /faq?q=
${COMMON_DISALLOW.map((p) => `Disallow: ${p}`).join('\n')}
Disallow: /*?*

User-agent: Googlebot
${CONTENT_SIGNAL}
Allow: /
${['/hq-portal', '/admin', '/dashboard', '/api/', '/order/'].map((p) => `Disallow: ${p}`).join('\n')}
Disallow: /*?*

User-agent: Bingbot
${CONTENT_SIGNAL}
Allow: /
${['/hq-portal', '/admin', '/dashboard', '/api/', '/order/'].map((p) => `Disallow: ${p}`).join('\n')}
Disallow: /*?*

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
${CONTENT_SIGNAL}
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
