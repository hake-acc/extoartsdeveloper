import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// RFC 9728 — OAuth 2.0 Protected Resource Metadata.
// https://www.rfc-editor.org/rfc/rfc9728
//
// Describes ExtoArts as a protected resource so agents can discover:
//   - The public MCP server (/mcp) and all marketing pages are accessible
//     without any credential (anonymous access).
//   - Authenticated areas (login-required pages) are backed by Supabase as
//     the authorization server.
//
// Returns 503 if NEXT_PUBLIC_SUPABASE_URL is not configured, so agents never
// receive incomplete metadata that implies support without a working AS.
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

  return NextResponse.json(
    {
      resource: SITE_URL,
      // Supabase is the AS that issues tokens for login-required pages.
      authorization_servers: [supabaseUrl],
      bearer_methods_supported: ['header'],
      scopes_supported: ['openid', 'email', 'profile'],
      resource_documentation: `${SITE_URL}/auth.md`,
      resource_signing_alg_values_supported: ['RS256'],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
