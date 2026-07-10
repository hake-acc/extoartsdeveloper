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
      // scopes_supported is required by scanners that validate this document
      // after following the PRM authorization_servers chain.
      scopes_supported: [],
      service_documentation: `${SITE_URL}/auth.md`,
      // agent_auth block — Auth.md spec, anonymous public site.
      // `skill` points to this service's own auth.md (the recipe agents read),
      // per the reference spec — not an external skill URL.
      agent_auth: {
        skill: `${SITE_URL}/auth.md`,
        register_uri: null,
        identity_types_supported: ['anonymous'],
        anonymous: {
          credential_types_supported: [],
          claim_uri: null,
        },
        claim_uri: null,
        revocation_uri: null,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  )
}
