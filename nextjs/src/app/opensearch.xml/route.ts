import { NextResponse } from 'next/server'
import { SITE_URL, SITE_NAME } from '@/lib/constants'

export const dynamic = 'force-static'

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${SITE_NAME}</ShortName>
  <Description>Search ExtoArts — YouTube video editing guides, pricing, and FAQ</Description>
  <Tags>youtube editing thumbnail agency video creator</Tags>
  <Url type="text/html" method="get" template="${SITE_URL}/faq?q={searchTerms}"/>
  <Image height="16" width="16" type="image/x-icon">${SITE_URL}/favicon.ico</Image>
  <Image height="32" width="32" type="image/png">${SITE_URL}/favicon-32.png</Image>
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
  <Language>en-US</Language>
  <LongName>ExtoArts YouTube Agency Search</LongName>
</OpenSearchDescription>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
