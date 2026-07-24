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
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co', '*.pike.replit.dev', '127.0.0.1'],
  turbopack: {
    root: __dir,
  },
  experimental: {
    // Tree-shake framer-motion, lucide-react, and radix so only the
    // primitives actually imported end up in the browser bundle.
    optimizePackageImports: ['framer-motion', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
  },
  images: {
    // No external remote patterns needed — all images are self-hosted.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
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
      // Social redirects — handled at edge (zero compute, zero cold-start)
      { source: '/discord', destination: 'https://discord.gg/extoarts-1402333030827425922', permanent: true },
      { source: '/youtube', destination: 'https://youtube.com/@extoarts?si=po6tre_ZAY7i_LFz', permanent: true },
      { source: '/instagram', destination: 'https://www.instagram.com/extoarts?igsh=enVlYm9hczNiYjgw', permanent: true },
      { source: '/twitter', destination: 'https://x.com/extoarts', permanent: true },
      { source: '/facebook', destination: 'https://www.facebook.com/share/1J1UA6Txqr/', permanent: true },
      { source: '/threads', destination: 'https://www.threads.net/@extoarts', permanent: true },
      // Short aliases → direct to external (single-hop, no page render)
      { source: '/fb', destination: 'https://www.facebook.com/share/1J1UA6Txqr/', permanent: true },
      { source: '/ig', destination: 'https://www.instagram.com/extoarts?igsh=enVlYm9hczNiYjgw', permanent: true },
      { source: '/yt', destination: 'https://youtube.com/@extoarts?si=po6tre_ZAY7i_LFz', permanent: true },
      { source: '/x', destination: 'https://x.com/extoarts', permanent: true },
    ]
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'

    const csp = [
      "default-src 'self'",
      // unsafe-eval: React requires eval() in development mode for error overlay,
      // call-stack reconstruction, and HMR. It is never used in production builds.
      // In production: unsafe-eval is omitted (strict).
      // See: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
      // 'unsafe-inline' is required by Next.js App Router. The framework injects
      // several dynamic per-request inline scripts during SSR (router state, React
      // flight payload, chunk manifests) whose content changes every request, making
      // static SHA-256 hashing impossible.
      // static.cloudflareinsights.com: Cloudflare injects beacon.min.js when the
      // site is proxied through Cloudflare (even without Cloudflare Web Analytics
      // enabled). Without this allowlist the beacon is CSP-blocked and logs a
      // console error on every page load for real users.
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://static.cloudflareinsights.com"
        : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://www.googletagmanager.com",
      // cloudflareinsights.com: beacon.min.js POSTs analytics data here.
      "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://*.vercel-analytics.com https://vitals.vercel-insights.com https://cloudflareinsights.com",
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
          // X-Frame-Options removed — CSP frame-ancestors 'self' supersedes it in all
          // modern browsers and is the authoritative directive. Keeping both is redundant
          // and adds response size with no security benefit.
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
      // Static images in /public/images/ — long cache, no hash needed (filenames stable)
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      // Portfolio images — client work uploaded to /public/portfolio/; 30-day cache
      // matches the ISR revalidation window so CDN and browser caches stay in sync.
      {
        source: '/portfolio/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

export default withAnalyzer(nextConfig)
