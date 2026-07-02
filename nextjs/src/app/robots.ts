import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/register', '/logout', '/hq-portal', '/apply', '/api/'],
      },
      {
        userAgent: [
          'GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-ai', 'Claude-Web',
          'CCBot', 'cohere-ai', 'PerplexityBot', 'Applebot-Extended', 'Bytespider',
          'PetalBot', 'YouBot', 'AI2Bot',
        ],
        disallow: '/',
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  }
}
