export const SITE_URL = 'https://extoarts.in'
export const SITE_NAME = 'ExtoArts'
export const SITE_TAGLINE = 'YouTube Video Editing Agency & Thumbnail Design'
export const DEFAULT_OG_IMAGE = 'https://iili.io/BZ0qLb4.png'
export const GA_ID = 'G-WTFPZB9Y4C'
export const DISCORD_URL = 'https://discord.gg/extoarts-1402333030827425922'
export const FOUNDER_PHOTO = 'https://iili.io/BZ0qsef.jpg'
export const SUPPORT_EMAIL = 'support@extoarts.in'
export const TWITTER_HANDLE = '@extoarts'

export const YTJOBS_URL = 'https://ytjobs.co/talent/profile/528947'
export const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/extoarts.in'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Workflow', href: '/workflow' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const SOCIAL_LINKS = [
  {
    platform: 'Discord',
    href: DISCORD_URL,
    label: 'ExtoArts on Discord',
  },
  {
    platform: 'YouTube',
    href: 'https://youtube.com/@extoarts?si=po6tre_ZAY7i_LFz',
    label: 'ExtoArts on YouTube',
  },
  {
    platform: 'X',
    href: 'https://x.com/extoarts',
    label: 'ExtoArts on X (Twitter)',
  },
  {
    platform: 'Threads',
    href: 'https://www.threads.net/@extoarts',
    label: 'ExtoArts on Threads',
  },
  {
    platform: 'Instagram',
    href: 'https://www.instagram.com/extoarts',
    label: 'ExtoArts on Instagram',
  },
  {
    platform: 'Facebook',
    href: 'https://www.facebook.com/share/1J1UA6Txqr/',
    label: 'ExtoArts on Facebook',
  },
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/company/extoarts',
    label: 'ExtoArts on LinkedIn',
  },
]

export const PAYMENT_METHODS = ['PayPal', 'UPI', 'Crypto', 'EasyPaisa', 'Bkash', 'Bank Transfer']

export const HREFLANG_LOCALES = [
  'en', 'en-US', 'en-GB', 'en-IN', 'en-AU', 'en-CA',
  'en-NG', 'en-PK', 'en-PH', 'en-ZA', 'en-BD', 'en-NZ', 'en-SG',
]

export const SITEMAP_URLS = [
  { url: '/', changeFrequency: 'weekly' as const, priority: 1.0 },
  { url: '/services', changeFrequency: 'monthly' as const, priority: 0.9 },
  { url: '/portfolio', changeFrequency: 'weekly' as const, priority: 0.9 },
  { url: '/pricing', changeFrequency: 'monthly' as const, priority: 0.85 },
  { url: '/about', changeFrequency: 'monthly' as const, priority: 0.85 },
  { url: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
  { url: '/workflow', changeFrequency: 'monthly' as const, priority: 0.75 },
  { url: '/faq', changeFrequency: 'monthly' as const, priority: 0.75 },
  { url: '/estimate', changeFrequency: 'monthly' as const, priority: 0.7 },
  { url: '/collab', changeFrequency: 'monthly' as const, priority: 0.65 },
  { url: '/tos', changeFrequency: 'yearly' as const, priority: 0.4 },
  { url: '/privacy', changeFrequency: 'yearly' as const, priority: 0.4 },
]
