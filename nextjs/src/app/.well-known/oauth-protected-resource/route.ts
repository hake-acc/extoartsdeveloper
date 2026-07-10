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
      authorization_servers: [],
      scopes_supported: [],
      bearer_methods_supported: [],
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
