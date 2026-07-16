// @ts-check
'use strict'

const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://extoarts.in'
const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|avif)$/i

/**
 * Reads portfolio images from a subfolder and returns sitemap image entries.
 * @param {string} subfolder
 */
function getPortfolioImages(subfolder) {
  const dir = path.join(process.cwd(), 'public', 'portfolio', subfolder)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => ALLOWED_EXT.test(f))
    .slice(0, 100) // safety limit
    .map((f) => {
      const baseName = f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
      const labels = { Thumbnails: 'YouTube thumbnail design', Logos: 'YouTube channel logo', Banners: 'YouTube channel banner' }
      const label = labels[subfolder] ?? 'portfolio work'
      return {
        loc: `${SITE_URL}/portfolio/${subfolder}/${encodeURIComponent(f)}`,
        title: baseName.length > 2 ? `${label} by ExtoArts — ${baseName}` : `${label} by ExtoArts`,
      }
    })
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  // robots.txt is served by src/app/robots.txt/route.ts instead, so it
  // works in dev too (next-sitemap only writes it in the postbuild step)
  // and so it can carry Content-Signal directives next-sitemap doesn't
  // support natively.
  generateRobotsTxt: false,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  exclude: [
    '/hq-portal', '/admin', '/dashboard',
    '/login', '/register', '/logout',
    '/apply', '/api/*', '/health',
    '/auth/*', '/order/*', '/chat',
    '/rss', '/feed.json', '/discord',
    '/instagram', '/twitter', '/youtube', '/facebook', '/threads',
    // Technical/non-indexable paths that should not appear in sitemap
    '/.well-known/*',
    '/robots.txt',
    '/opensearch.xml',
    '/sitemap*.xml',
  ],
  // Non-emitting now that generateRobotsTxt is false — kept only as a
  // parity reference for the equivalent rules in src/app/robots.txt/route.ts.
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/', '/faq?q='],
        disallow: [
          '/hq-portal', '/admin', '/dashboard',
          '/login', '/register', '/logout',
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
          'Google-Extended', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
          'anthropic-ai', 'ClaudeBot', 'PerplexityBot', 'DuckDuckBot',
          'Applebot', 'Applebot-Extended', 'CohereBot', 'Meta-ExternalAgent',
        ],
        allow: ['/', '/llms.txt'],
      },
    ],
  },
  transform: async (cfg, pagePath) => {
    const priorities = {
      '/': 1.0,
      '/services': 0.9,
      '/pricing': 0.9,
      '/portfolio': 0.85,
      '/about': 0.85,
      '/contact': 0.8,
      '/workflow': 0.75,
      '/faq': 0.75,
      '/estimate': 0.7,
      '/collab': 0.65,
      '/ticket': 0.6,
      '/tos': 0.4,
      '/privacy': 0.4,
    }
    const changefreqs = {
      '/': 'weekly',
      '/portfolio': 'weekly',
      '/services': 'monthly',
      '/pricing': 'monthly',
    }

    const images = pagePath === '/portfolio'
      ? [
          ...getPortfolioImages('Thumbnails'),
          ...getPortfolioImages('Logos'),
          ...getPortfolioImages('Banners'),
        ]
      : undefined

    return {
      loc: pagePath,
      changefreq: changefreqs[pagePath] ?? cfg.changefreq,
      priority: priorities[pagePath] ?? cfg.priority,
      lastmod: cfg.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: cfg.alternateRefs ?? [],
      ...(images && images.length > 0 ? { images } : {}),
    }
  },
}

module.exports = config
