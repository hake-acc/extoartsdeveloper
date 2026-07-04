import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/hq-portal', '/admin', '/dashboard', '/login', '/register', '/logout',
          '/apply', '/api/', '/order/', '/chat', '/health', '/*?*',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/hq-portal', '/admin', '/dashboard', '/api/', '/order/', '/*?*'],
      },
      {
        userAgent: [
          'Google-Extended', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'anthropic-ai',
          'ClaudeBot', 'PerplexityBot', 'DuckDuckBot', 'Applebot', 'Applebot-Extended',
          'CohereBot', 'Meta-ExternalAgent',
        ],
        allow: ['/', '/llms.txt'],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  }
}
