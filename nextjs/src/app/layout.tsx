import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ClientScripts } from '@/components/ClientScripts'
import { ClientProviders } from '@/components/ClientProviders'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from '@/lib/constants'
import { JsonLd } from '@/components/JsonLd'
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | YouTube Video Editing Agency & Thumbnail Design`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'YouTube video editing agency for creators who want real results. High-retention editing, thumbnail design, TikTok editing, and channel automation.',
  keywords: [
    'YouTube video editing agency',
    'thumbnail design service',
    'retention editing',
    'TikTok video editing',
    'YouTube automation',
    'ExtoArts',
    'gaming video editing',
    'faceless YouTube channel',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 2048,
        height: 1144,
        alt: 'ExtoArts - Elite YouTube Video Editing Agency',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    language: 'English',
    'msapplication-TileColor': '#030305',
    'msapplication-TileImage': '/favicon-192.png',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'en-US',
  description:
    'YouTube-focused video editing agency offering retention editing, thumbnail design, TikTok short-form editing, and YouTube automation.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/faq?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  // Single @type: Organization. ProfessionalService extends LocalBusiness which
  // requires address fields ExtoArts (fully remote) cannot provide — using the
  // array caused 29 validation errors in Google Rich Results Test.
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: ['ExtoArts Agency', 'Exto Arts'],
  url: `${SITE_URL}/`,
  mainEntityOfPage: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/favicon-192.png`,
    contentUrl: `${SITE_URL}/favicon-192.png`,
    width: 192,
    height: 192,
    caption: SITE_NAME,
    name: 'ExtoArts Logo',
  },
  image: {
    '@type': 'ImageObject',
    url: DEFAULT_OG_IMAGE,
    width: 2048,
    height: 1144,
    caption: 'ExtoArts YouTube Video Editing Agency',
  },
  description:
    "ExtoArts is a YouTube video editing agency founded in 2024 that provides high-retention video editing, thumbnail design, YouTube Shorts and TikTok editing, motion graphics, and full YouTube channel automation. ExtoArts charges a flat 10% agency fee - 90% of a creator's budget goes directly to the specialist editor.",
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'Rehan',
    alternateName: 'RehanSigma',
    jobTitle: 'Founder & Creative Director',
    url: `${SITE_URL}/about`,
    image: 'https://iili.io/BZ0qsef.jpg',
    sameAs: [
      'https://x.com/extoarts',
      'https://www.instagram.com/extoarts',
      'https://youtube.com/@extoarts',
    ],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  },
  // aggregateRating without itemReviewed — self-referencing via @id caused
  // circular-reference validation warnings. Rating applies to this entity.
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '7',
  },
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 6, maxValue: 12 },
  slogan: '90% to your editor. Always.',
  inLanguage: 'en',
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'Pakistan' },
    { '@type': 'Country', name: 'Nigeria' },
    { '@type': 'Country', name: 'Philippines' },
    { '@type': 'AdministrativeArea', name: 'Worldwide' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'YouTube Creative Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'YouTube Video Editing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Thumbnail Design' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'YouTube Shorts Editing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gaming Video Editing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'YouTube Channel Automation' } },
    ],
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://discord.gg/extoarts-1402333030827425922',
      availableLanguage: 'English',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${SITE_URL}/contact`,
      availableLanguage: 'English',
    },
  ],
  sameAs: [
    'https://x.com/extoarts',
    'https://www.threads.net/@extoarts',
    'https://youtube.com/@extoarts',
    'https://www.instagram.com/extoarts',
    'https://www.facebook.com/share/1J1UA6Txqr/',
    'https://discord.gg/extoarts-1402333030827425922',
    'https://www.trustpilot.com/review/extoarts.in',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        {/* Tabler Icons — self-hosted subset (55 icons, 12 KB vs 807 KB CDN).
            Served from /fonts/ with 1yr immutable cache; preloaded so the font
            is in-flight before the CSS parser requests it. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/tabler-icons-subset.woff2"
        />
        <link rel="stylesheet" href="/tabler-icons-subset.css" />
        {/* Background image — preloaded early; dark is the default theme.
            Both divs now use display:none so only the active theme fetches its image. */}
        <link rel="preload" as="image" href="/backgrounds/darkModeBg.webp" />
        <link rel="preconnect" href="https://iili.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://iili.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Critical font preloads — served from /fonts/ with 1yr immutable cache */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/plus-jakarta-sans.woff2"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/PaperInko.woff2"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/caveat.woff2"
        />
        <link rel="alternate" type="application/rss+xml" title="ExtoArts Creator Insights" href="/rss" />
        <link rel="alternate" type="application/json" title="ExtoArts Creator Insights" href="/feed.json" />
        <link rel="search" type="application/opensearchdescription+xml" title="ExtoArts" href="/opensearch.xml" />
        <link rel="llms.txt" type="text/plain" title="LLM Information" href="/llms.txt" />
        <meta name="theme-color" content="#030305" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <meta property="og:locale:alternate" content="en_GB" />
        <meta property="og:locale:alternate" content="en_AU" />
        <meta property="og:locale:alternate" content="en_CA" />
        <meta property="og:locale:alternate" content="en_IN" />
        <meta property="og:locale:alternate" content="en_NG" />
        <meta property="og:locale:alternate" content="en_PK" />
        <meta property="og:locale:alternate" content="en_PH" />
        <meta property="og:locale:alternate" content="en_ZA" />
        <meta property="og:locale:alternate" content="en_SG" />
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </head>
      <body>
        <Script id="ea-theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('ea-theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme:light)').matches))document.documentElement.setAttribute('data-theme','light');}catch(e){}document.documentElement.classList.replace('no-js','js');})();`}</Script>
        {/* Tabler Icons CSS is now a static <link> above — no Script needed */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="bg-image-layer bg-image-light" aria-hidden="true" />
        <div className="bg-image-layer bg-image-dark" aria-hidden="true" />
        <ClientProviders>
          <div className="mesh-glow" aria-hidden="true" />
          <div id="page-progress-container" aria-hidden="true">
            <div id="page-progress-arrow">
              <svg width="24" height="20" viewBox="0 0 24 20" className="fire-trail" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="fire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 75, 31, 0)" />
                    <stop offset="50%" stopColor="#ff4b1f" />
                    <stop offset="100%" stopColor="#ff9068" />
                  </linearGradient>
                </defs>
                <path className="flame-main" d="M 24,10 Q 15,2 5,8 Q 0,10 0,10 Q 0,10 5,12 Q 15,18 24,10 Z" fill="url(#fire-grad)" />
                <path className="flame-inner" d="M 24,10 Q 18,6 10,9 Q 6,10 6,10 Q 6,10 10,11 Q 18,14 24,10 Z" fill="#ffc371" />
              </svg>
              <svg width="60" height="20" viewBox="0 0 60 20" fill="url(#brush-gradient)" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="brush-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--purple)" />
                    <stop offset="50%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
                <g>
                  <path d="M 2,8.5 L 40,8.5 L 40,11.5 L 2,11.5 Z" />
                  <rect x="40" y="7.5" width="3" height="5" rx="1" />
                  <rect x="43" y="8.5" width="2" height="3" />
                  <rect x="45" y="7.5" width="3" height="5" rx="1" />
                  <path d="M 48,7.5 C 51,7 55,9.5 60,10 C 55,10.5 51,13 48,12.5 Z" />
                </g>
              </svg>
            </div>
          </div>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <ClientScripts />
        </ClientProviders>
        {/* Vercel Analytics + Speed Insights — zero runtime impact, loaded after paint */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
