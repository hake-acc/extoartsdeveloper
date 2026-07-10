import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// OpenID Connect Discovery 1.0 — Provider Configuration.
// http://openid.net/specs/openid-connect-discovery-1_0.html
//
// Companion to /.well-known/oauth-authorization-server; follows the OIDC
// convention for provider discovery. Both documents describe the same
// Supabase-backed authorization server.
//
// Returns 503 if NEXT_PUBLIC_SUPABASE_URL is not configured — an OIDC
// discovery document missing required fields (authorization_endpoint, jwks_uri)
// is invalid per spec, so we prefer an explicit error over partial metadata.
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')

  if (!supabaseUrl) {
    return NextResponse.json(
      { error: 'OIDC provider not configured' },
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
      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid', 'email', 'profile'],
      token_endpoint_auth_methods_supported: ['none'],
      claims_supported: ['sub', 'email', 'email_verified', 'aud', 'iss', 'iat', 'exp'],
      code_challenge_methods_supported: ['S256'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
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
