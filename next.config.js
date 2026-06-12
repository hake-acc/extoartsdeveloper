/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Allow images from CDN domains used by the site
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'iili.io' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'imgbb.com' },
    ],
  },

  // Map legacy PHP-style URLs to Next.js pages
  async redirects() {
    return [
      { source: '/toc',                    destination: '/tos',      permanent: true },
      { source: '/support',                destination: '/ticket',   permanent: false },
      { source: '/admin',                  destination: '/dashboard',permanent: false },
      { source: '/youtube-editing',        destination: '/services', permanent: true },
      { source: '/discord-agency',         destination: '/services', permanent: true },
      { source: '/affordable-youtube-editing', destination: '/pricing', permanent: true },
      { source: '/video-editing-cost',     destination: '/pricing',  permanent: true },
      { source: '/youtube-channel-management', destination: '/services', permanent: true },
      { source: '/blog',                   destination: '/',         permanent: true },
      { source: '/blog/:path*',            destination: '/',         permanent: false },
      { source: '/discord',                destination: 'https://discord.gg/extoarts-1402333030827425922', permanent: false },
      { source: '/facebook',               destination: 'https://www.facebook.com/share/1J1UA6Txqr/', permanent: false },
      { source: '/fb',                     destination: 'https://www.facebook.com/share/1J1UA6Txqr/', permanent: false },
      { source: '/instagram',              destination: 'https://www.instagram.com/extoarts', permanent: false },
      { source: '/ig',                     destination: 'https://www.instagram.com/extoarts', permanent: false },
      { source: '/twitter',                destination: 'https://x.com/extoarts', permanent: false },
      { source: '/x',                      destination: 'https://x.com/extoarts', permanent: false },
      { source: '/youtube',                destination: 'https://youtube.com/@extoarts', permanent: false },
      { source: '/yt',                     destination: 'https://youtube.com/@extoarts', permanent: false },
      { source: '/threads',                destination: 'https://www.threads.com/@extoarts', permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
