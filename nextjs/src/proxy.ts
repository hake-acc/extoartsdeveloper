import { NextRequest, NextResponse } from 'next/server'
import TurndownService from 'turndown'

// Skip static assets, API routes, and Next internals — only negotiate
// markdown for actual page routes.
export const config = {
  matcher: '/((?!api|_next|\\.well-known).*)',
}

let turndownService: TurndownService | null = null

function getTurndown() {
  if (!turndownService) {
    turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    })
  }
  return turndownService
}

function wantsMarkdown(accept: string): boolean {
  if (!accept) return false
  // Only negotiate markdown when it's explicitly requested and preferred
  // over (or equal to) html — never hijack a plain browser request.
  const entries = accept.split(',').map((part) => {
    const [type, ...params] = part.trim().split(';')
    const qParam = params.find((p) => p.trim().startsWith('q='))
    const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1
    return { type: type.trim().toLowerCase(), q }
  })

  const markdown = entries.find((e) => e.type === 'text/markdown')
  if (!markdown) return false

  const html = entries.find((e) => e.type === 'text/html' || e.type === '*/*')
  if (!html) return true

  return markdown.q >= html.q
}

export async function proxy(request: NextRequest) {
  const accept = request.headers.get('accept') || ''

  // Explicit recursion guard: the internal self-fetch below always carries
  // this header, so a second pass through the proxy short-circuits here
  // rather than relying solely on the rewritten Accept header.
  if (request.headers.get('x-markdown-passthrough') === '1') {
    return NextResponse.next()
  }

  if (request.method !== 'GET' || !wantsMarkdown(accept)) {
    return NextResponse.next()
  }

  // Never transform personalized/authenticated responses — cookie-bearing
  // requests must not be converted and (especially) must not be cached.
  if (request.headers.get('cookie')) {
    return NextResponse.next()
  }

  // Pin the internal fetch to this app's own trusted origin (never a
  // client-controlled Host/X-Forwarded-Host header) to remove any
  // SSRF/host-confusion risk.
  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `http://127.0.0.1:${process.env.PORT || 5000}`)

  const forwardedHeaders = new Headers()
  forwardedHeaders.set('accept', 'text/html')
  // Avoid this proxy recursing on the internal fetch.
  forwardedHeaders.set('x-markdown-passthrough', '1')
  const userAgent = request.headers.get('user-agent')
  if (userAgent) forwardedHeaders.set('user-agent', userAgent)

  let htmlResponse: Response
  try {
    htmlResponse = await fetch(url.toString(), {
      headers: forwardedHeaders,
      redirect: 'manual',
    })
  } catch {
    return NextResponse.next()
  }

  if (!htmlResponse.ok || !(htmlResponse.headers.get('content-type') || '').includes('text/html')) {
    return NextResponse.next()
  }

  const html = await htmlResponse.text()

  const bodyMatch = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .match(/<body[^>]*>([\s\S]*)<\/body>/i)

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)

  const decodeEntities = (s: string) =>
    s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

  const bodyHtml = (bodyMatch ? bodyMatch[1] : html)
    // Tabler icon <i> tags render as private-use-area glyphs (e.g. 証) once
    // converted to text — drop them, they carry no semantic content.
    .replace(/<i\b[^>]*class=["'][^"']*\bti\b[^"']*["'][^>]*>[\s\S]*?<\/i>/gi, '')

  let markdown = getTurndown().turndown(bodyHtml)

  // Collapse excess blank lines left behind by stripped layout chrome.
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim()

  const frontmatter: string[] = []
  if (titleMatch) frontmatter.push(`# ${decodeEntities(titleMatch[1].trim())}`)
  if (descMatch) frontmatter.push(`\n> ${decodeEntities(descMatch[1].trim())}`)

  const body = [...frontmatter, markdown].join('\n\n').trim() + '\n'
  const approxTokens = Math.ceil(body.length / 4)

  const response = new NextResponse(body, { status: 200 })

  // Carry over the site's baseline security headers (CSP, frame options,
  // HSTS, etc. from next.config.ts) instead of only setting markdown-
  // specific ones — a transformed response shouldn't lose protections a
  // normal HTML response gets.
  const skip = new Set(['content-type', 'content-length', 'content-encoding', 'transfer-encoding'])
  htmlResponse.headers.forEach((value, key) => {
    if (!skip.has(key.toLowerCase())) response.headers.set(key, value)
  })

  response.headers.set('Content-Type', 'text/markdown; charset=utf-8')
  response.headers.set('X-Markdown-Tokens', String(approxTokens))
  response.headers.set('Vary', 'Accept')
  // The upstream fetch already excluded cookie-bearing requests, but stay
  // conservative: no shared/public caching for a derived response.
  response.headers.set('Cache-Control', 'private, max-age=60')

  return response
}
