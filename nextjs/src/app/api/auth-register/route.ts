import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().refine((e) => e.endsWith('@gmail.com') || e.endsWith('@yahoo.com')),
  password: z.string().min(8),
  role: z.enum(['client', 'editor']),
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

    const { data: authData, error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          role: data.role,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({ ok: false, message: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 })
    }

    const notifyWebhook = process.env.DISCORD_WEBHOOK_REGISTER
    if (notifyWebhook) {
      fetch(notifyWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: 'New Registration',
            color: 0x22d3ee,
            fields: [
              { name: 'Username', value: data.username, inline: true },
              { name: 'Role', value: data.role, inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      }).catch(() => {})
    }

    const response = NextResponse.json({ ok: true, message: 'Account created. Please check your email to verify.' })
    if (authData.session) {
      response.cookies.set('ea_session', authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: 'Invalid registration data.' }, { status: 400 })
    }
    console.error('Register error:', error)
    return NextResponse.json({ ok: false, message: 'Registration failed.' }, { status: 500 })
  }
}
