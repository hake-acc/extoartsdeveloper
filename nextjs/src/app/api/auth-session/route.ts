import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  access_token: z.string().min(10),
})

/**
 * Called by the OAuth callback page to persist the Supabase session
 * as an httpOnly server cookie so the dashboard can verify auth.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { access_token } = schema.parse(body)

    const response = NextResponse.json({ ok: true })
    response.cookies.set('ea_session', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid session data.' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('ea_session')
  return response
}
