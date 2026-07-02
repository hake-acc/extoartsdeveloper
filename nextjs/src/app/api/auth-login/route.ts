import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ ok: false, message: 'Authentication service unavailable.' }, { status: 503 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, supabaseKey)

    const { data: authData, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error || !authData.session) {
      return NextResponse.json({ ok: false, message: 'Invalid email or password.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('ea_session', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: 'Invalid credentials format.' }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ ok: false, message: 'Authentication failed.' }, { status: 500 })
  }
}
