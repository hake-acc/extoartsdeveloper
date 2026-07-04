import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DiscordModal } from '@/components/DiscordModal'
import { ClientScripts } from '@/components/ClientScripts'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from '@/lib/constants'
import { JsonLd } from '@/components/JsonLd'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import { CursorFollower } from '@/components/motion/CursorFollower'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

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
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: 'en-US',
      description:
        'YouTube-focused video editing agency offering retention editing, thumbnail design, TikTok short-form editing, and YouTube automation.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/faq?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: SITE_NAME,
      brand: { '@type': 'Brand', name: SITE_NAME },
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
        representativeOfPage: true,
      },
      description:
        'ExtoArts is a YouTube video editing agency founded in 2024 that provides high-retention video editing, thumbnail design, YouTube Shorts and TikTok editing, motion graphics, and full YouTube channel automation. ExtoArts charges a flat 10% agency fee - 90% of a creator\'s budget goes directly to the specialist editor.',
      priceRange: '$$',
      currenciesAccepted: 'USD, PayPal, Crypto, PKR',
      paymentAccepted: 'PayPal, Bank Transfer, USDT, BTC, ETH, UPI, EasyPaisa, Bkash',
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
      serviceType: [
        'YouTube Video Editing',
        'Thumbnail Design',
        'Short-Form Video Editing',
        'YouTube Automation',
        'Gaming Video Editing',
      ],
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
        'https://www.trustpilot.com/review/extoarts.xyz',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://iili.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://iili.io" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/plus-jakarta-sans.woff2"
        />
        <link rel="alternate" type="application/rss+xml" title="ExtoArts Creator Insights" href="/rss" />
        <link rel="alternate" type="application/json" title="ExtoArts Creator Insights" href="/feed.json" />
        <link rel="search" type="application/opensearchdescription+xml" title="ExtoArts" href="/opensearch.xml" />
        <meta name="theme-color" content="#030305" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <meta property="og:locale:alternate" content="en_GB" />
        <meta property="og:locale:alternate" content="en_AU" />
        <meta property="og:locale:alternate" content="en_CA" />
        <JsonLd data={websiteSchema} />
      </head>
      <body>
        <Script id="ea-theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('ea-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}document.documentElement.classList.replace('no-js','js');})();`}</Script>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="mesh-glow" aria-hidden="true" />
        <div id="page-progress" aria-hidden="true" />
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <DiscordModal />
        <ClientScripts />
        <SmoothScrollProvider />
        <CursorFollower />
        <GrainOverlay />
      </body>
    </html>
  )
}
