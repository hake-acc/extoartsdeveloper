/**
 * Fallback route for /_vercel/insights/script.js
 *
 * On a Vercel deployment with Speed Insights enabled, Vercel's CDN intercepts
 * this path before Next.js ever sees it.  On any other environment (or when
 * Speed Insights is disabled in the Vercel dashboard), the request falls through
 * to Next.js and would normally 404 with a text/html body, which the browser
 * then refuses to execute and logs a MIME-type error.
 *
 * This handler proxies the real script from Vercel's public CDN so the browser
 * always gets executable JavaScript — no dashboard toggle required.
 */

import { NextResponse } from 'next/server'

const UPSTREAM = 'https://va.vercel-scripts.com/v1/speed-insights.js'

export const runtime = 'edge'

export async function GET() {
  try {
    const upstream = await fetch(UPSTREAM, {
      // Reuse the CDN's own cache signal
      next: { revalidate: 86400 },
    })

    const js = await upstream.text()

    return new Response(js, {
      status: 200,
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=86400, stale-while-revalidate=3600',
        'x-content-type-options': 'nosniff',
      },
    })
  } catch {
    // Silent failure — Speed Insights is non-critical
    return new Response('', {
      status: 200,
      headers: { 'content-type': 'application/javascript; charset=utf-8' },
    })
  }
}
