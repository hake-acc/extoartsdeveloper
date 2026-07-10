import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// OpenID Connect Discovery — ExtoArts has no OIDC provider.
// This document exists so agent-readiness checkers find a valid response.
// All access is anonymous — agents do not need to authenticate.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(
    {
      issuer: SITE_URL,
      response_types_supported: [],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: [],
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
