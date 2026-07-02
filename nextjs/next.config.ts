import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
      {
        protocol: 'https',
        hostname: 'freeimage.host',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/', permanent: true },
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
      { source: '/admin', destination: '/dashboard', permanent: true },
      { source: '/fb', destination: '/facebook', permanent: true },
      { source: '/ig', destination: '/instagram', permanent: true },
      { source: '/yt', destination: '/youtube', permanent: true },
      { source: '/x', destination: '/twitter', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
