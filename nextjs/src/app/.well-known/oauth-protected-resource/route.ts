import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// RFC 9728 — OAuth 2.0 Protected Resource Metadata.
// ExtoArts has no protected APIs. Every endpoint is public and anonymous.
// This document exists so agent-readiness checkers can discover that fact
// without assuming auth is required.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(
    {
      resource: SITE_URL,
      // Point to our AS document so scanners can follow the full discovery
      // chain: PRM → AS → agent_auth block.  The issuer in the AS document
      // matches this URL per RFC 8414.
      authorization_servers: [SITE_URL],
      scopes_supported: [],
      // RFC 9728 requires "header" to be listed even for public resources —
      // it describes the bearer token transport method, not that tokens are
      // required.  All endpoints are public and anonymous.
      bearer_methods_supported: ['header'],
      resource_documentation: `${SITE_URL}/auth.md`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  )
}
