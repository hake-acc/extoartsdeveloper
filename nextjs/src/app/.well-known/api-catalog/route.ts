import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/constants'

// RFC 9727 API catalog — machine-readable index of this site's programmatic
// / syndication endpoints, so agents can discover them without crawling
// every page. See https://www.rfc-editor.org/rfc/rfc9727
export const dynamic = 'force-static'

const linkset = [
  {
    anchor: `${SITE_URL}/rss`,
    'service-desc': [{ href: `${SITE_URL}/rss`, type: 'application/rss+xml', title: 'ExtoArts RSS feed' }],
    'service-doc': [{ href: `${SITE_URL}/faq`, type: 'text/html', title: 'ExtoArts FAQ' }],
    status: [{ href: `${SITE_URL}/rss`, type: 'application/rss+xml' }],
  },
  {
    anchor: `${SITE_URL}/feed.json`,
    'service-desc': [{ href: `${SITE_URL}/feed.json`, type: 'application/feed+json', title: 'ExtoArts JSON Feed' }],
    'service-doc': [{ href: `${SITE_URL}/faq`, type: 'text/html', title: 'ExtoArts FAQ' }],
    status: [{ href: `${SITE_URL}/feed.json`, type: 'application/feed+json' }],
  },
  {
    anchor: `${SITE_URL}/opensearch.xml`,
    'service-desc': [
      { href: `${SITE_URL}/opensearch.xml`, type: 'application/opensearchdescription+xml', title: 'ExtoArts OpenSearch description' },
    ],
    'service-doc': [{ href: SITE_URL, type: 'text/html', title: 'ExtoArts home' }],
    status: [{ href: `${SITE_URL}/opensearch.xml`, type: 'application/opensearchdescription+xml' }],
  },
  {
    anchor: `${SITE_URL}/llms.txt`,
    'service-desc': [{ href: `${SITE_URL}/llms.txt`, type: 'text/plain', title: 'ExtoArts LLM knowledge file' }],
    'service-doc': [{ href: SITE_URL, type: 'text/html', title: 'ExtoArts home' }],
    status: [{ href: `${SITE_URL}/llms.txt`, type: 'text/plain' }],
  },
  {
    anchor: `${SITE_URL}/sitemap.xml`,
    'service-desc': [{ href: `${SITE_URL}/sitemap.xml`, type: 'application/xml', title: 'ExtoArts sitemap' }],
    'service-doc': [{ href: SITE_URL, type: 'text/html', title: 'ExtoArts home' }],
    status: [{ href: `${SITE_URL}/sitemap.xml`, type: 'application/xml' }],
  },
]

export async function GET() {
  return NextResponse.json(
    { linkset },
    {
      headers: {
        'Content-Type': 'application/linkset+json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
