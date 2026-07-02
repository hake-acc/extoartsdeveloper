import { NextResponse } from 'next/server'

export async function GET() {
  const status = {
    ok: true,
    timestamp: new Date().toISOString(),
    runtime: 'Next.js 15 App Router',
    supabase: !!(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL),
    ga: !!(process.env.NEXT_PUBLIC_GA_ID ?? process.env.GA_ID),
  }
  return NextResponse.json(status)
}
