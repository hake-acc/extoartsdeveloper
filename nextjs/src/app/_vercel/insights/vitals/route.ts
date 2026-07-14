/**
 * Fallback route for /_vercel/insights/vitals  (Vercel Speed Insights vitals beacons)
 *
 * Forwards Core Web Vitals payloads to Vercel's real endpoint so data is
 * collected regardless of whether Speed Insights is toggled in the dashboard.
 */

import { NextRequest } from 'next/server'

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
