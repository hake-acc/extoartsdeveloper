/**
 * Fallback route for /_vercel/insights/view  (Vercel Web Analytics pageview events)
 *
 * Same reasoning as script.js/route.ts — Vercel's CDN handles this in production
 * when Analytics is enabled; this handler prevents 404 errors in every other case.
 */

import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM = 'https://vitals.vercel-insights.com/v1/vitals'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const res = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
    return new Response(null, { status: res.ok ? 204 : res.status })
  } catch {
    return new Response(null, { status: 204 })
  }
}
