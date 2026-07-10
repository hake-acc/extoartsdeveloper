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
      // agent_auth block — Auth.md spec, anonymous public site.
      // Shape mirrors public/auth.md exactly; claim_uri and revocation_uri are
      // top-level, not nested under the identity-type object.
      agent_auth: {
        skill: 'https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md',
        register_uri: null,
        identity_types_supported: ['anonymous'],
        anonymous: {
          credential_types_supported: [],
          scope: 'all endpoints',
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
