import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const __filename = fileURLToPath(import.meta.url)
const __dir = dirname(__filename)

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Extract critical (above-the-fold) CSS inline; load the rest non-blocking.
    // Requires `critters` to be installed. Only runs during `next build`.
    optimizeCss: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co', '*.pike.replit.dev', '127.0.0.1'],
  turbopack: {
    root: __dir,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'iili.io' },
      { protocol: 'https', hostname: 'freeimage.host' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/', permanent: true },
      { source: '/blog/:slug*', destination: '/', permanent: true },
      { source: '/video-editing-cost', destination: '/pricing', permanent: true },
      { source: '/hire-video-editor', destination: '/services', permanent: true },
      { source: '/gaming-video-editing', destination: '/services', permanent: true },
      { source: '/faceless-youtube-channel', destination: '/services', permanent: true },
      { source: '/youtube-shorts-editing', destination: '/services', permanent: true },
      { source: '/thumbnail-design', destination: '/services', permanent: true },
      { source: '/youtube-editing', destination: '/services', permanent: true },
      { source: '/discord-agency', destination: '/services', permanent: true },
      { source: '/affordable-youtube-editing', destination: '/pricing', permanent: true },
      { source: '/support', destination: '/ticket', permanent: true },
      { source: '/toc', destination: '/tos', permanent: true },
      { source: '/feed', destination: '/rss', permanent: true },
      { source: '/fb', destination: '/facebook', permanent: true },
      { source: '/ig', destination: '/instagram', permanent: true },
      { source: '/yt', destination: '/youtube', permanent: true },
      { source: '/x', destination: '/twitter', permanent: true },
    ]
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https://iili.io https://freeimage.host https://www.googletagmanager.com",
      "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://*.vercel-analytics.com https://vitals.vercel-insights.com",
      "frame-src 'self' https://discord.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
          // Content-Signal belongs in HTTP headers, not in robots.txt.
          // Non-standard robots.txt directives cause validator "formatting problem" errors.
          { key: 'X-Content-Signal', value: 'search=yes, ai-train=yes, ai-input=yes' },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</llms.txt>; rel="service-doc"',
              '</sitemap.xml>; rel="index"',
              '</.well-known/api-catalog>; rel="api-catalog"',
              '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
              '</auth.md>; rel="auth-md"',
              '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
              '</.well-known/openid-configuration>; rel="openid-configuration"',
              '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
            ].join(', '),
          },
        ],
      },
      // Vary: Accept on all navigable pages so CDNs and proxies serve
      // separate cached copies for HTML vs text/markdown requests.
      {
        source: '/((?!_next|api/|fonts/|favicon\\.ico).*)',
        headers: [
          { key: 'Vary', value: 'Accept' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default withAnalyzer(nextConfig)
