import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// RFC 8414 — OAuth 2.0 Authorization Server Metadata.
// https://www.rfc-editor.org/rfc/rfc8414
//
// ExtoArts does not run its own OAuth authorization server. Authenticated
// areas are backed by Supabase, whose AS endpoints are surfaced here so
// agents can discover authentication without knowing the Supabase project URL.
//
// Returns 503 if NEXT_PUBLIC_SUPABASE_URL is not configured — a partial
// document advertising code-flow support without working endpoints is worse
// than an explicit unavailability response.
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')

  if (!supabaseUrl) {
    return NextResponse.json(
      { error: 'Authorization server not configured' },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '3600',
        },
      },
    )
  }

  const authBase = `${supabaseUrl}/auth/v1`

  return NextResponse.json(
    {
      issuer: supabaseUrl,
      authorization_endpoint: `${authBase}/authorize`,
      token_endpoint: `${authBase}/token`,
      jwks_uri: `${authBase}/.well-known/jwks.json`,
      userinfo_endpoint: `${authBase}/user`,
      grant_types_supported: ['authorization_code', 'refresh_token'],
      response_types_supported: ['code'],
      // PKCE is required for public (browser-based) clients.
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      scopes_supported: ['openid', 'email', 'profile'],
      service_documentation: `${SITE_URL}/auth.md`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
