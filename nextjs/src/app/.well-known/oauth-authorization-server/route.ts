import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// RFC 8414 — OAuth 2.0 Authorization Server Metadata.
// ExtoArts does not operate an authorization server. This document exists
// so agent-readiness checkers find a valid response. Agents should use
// anonymous access — no token is required for any public endpoint.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(
    {
      issuer: SITE_URL,
      grant_types_supported: [],
      response_types_supported: [],
      service_documentation: `${SITE_URL}/auth.md`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  )
}
