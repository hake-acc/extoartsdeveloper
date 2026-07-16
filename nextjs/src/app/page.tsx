import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/JsonLd'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { getPortfolioData } from '@/lib/portfolio'

// Below-the-fold sections: deferred until after LCP
const GettingStartedRibbon = dynamic(() => import('@/components/sections/home/GettingStartedRibbon').then(m => ({ default: m.GettingStartedRibbon })), { ssr: true })
const WhyExtoArts = dynamic(() => import('@/components/sections/home/WhyExtoArts').then(m => ({ default: m.WhyExtoArts })), { ssr: true })
const StatsSection = dynamic(() => import('@/components/sections/home/StatsSection').then(m => ({ default: m.StatsSection })), { ssr: true })
const ServicesSection = dynamic(() => import('@/components/sections/home/ServicesSection').then(m => ({ default: m.ServicesSection })), { ssr: true })
const PortfolioPreview = dynamic(() => import('@/components/sections/home/PortfolioPreview').then(m => ({ default: m.PortfolioPreview })), { ssr: true })
const ProcessSection = dynamic(() => import('@/components/sections/home/ProcessSection').then(m => ({ default: m.ProcessSection })), { ssr: true })
const FounderSection = dynamic(() => import('@/components/sections/home/FounderSection').then(m => ({ default: m.FounderSection })), { ssr: true })
const ReviewsSection = dynamic(() => import('@/components/sections/home/ReviewsSection').then(m => ({ default: m.ReviewsSection })), { ssr: true })

export const metadata: Metadata = {
  title: { absolute: 'YouTube Video Editing & Thumbnail Design | ExtoArts' },
  description:
    'High-retention YouTube editing, thumbnail design, and Shorts editing for creators. Flat-fee pricing, real editors, fast turnaround.',
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      'en': `${SITE_URL}/`,
      'en-US': `${SITE_URL}/`,
      'en-GB': `${SITE_URL}/`,
      'en-IN': `${SITE_URL}/`,
      'en-AU': `${SITE_URL}/`,
      'en-CA': `${SITE_URL}/`,
      'en-NG': `${SITE_URL}/`,
      'en-PK': `${SITE_URL}/`,
      'en-PH': `${SITE_URL}/`,
      'en-ZA': `${SITE_URL}/`,
      'en-BD': `${SITE_URL}/`,
      'en-NZ': `${SITE_URL}/`,
      'en-SG': `${SITE_URL}/`,
      'x-default': `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'YouTube Video Editing & Thumbnail Design | ExtoArts',
    description: 'High-retention YouTube editing, thumbnail design, and Shorts editing for creators. Flat-fee pricing, real editors, fast turnaround.',
    url: `${SITE_URL}/`,
    siteName: 'ExtoArts',
    images: [
      {
        url: 'https://iili.io/BZ0qLb4.png',
        width: 2048,
        height: 1144,
        alt: 'ExtoArts - YouTube Video Editing Agency',
        type: 'image/png',
      },
    ],
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/`,
  url: `${SITE_URL}/`,
  name: 'ExtoArts | YouTube Video Editing Agency, Thumbnail Design & Shorts Editing',
  description: 'High-retention YouTube editing, thumbnail design, and Shorts editing for creators. Flat-fee pricing, real editors, fast turnaround.',
  inLanguage: 'en-US',
  datePublished: '2024-01-01',
  dateModified: '2026-07-15',
  about: { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.hero', '.torn-banner', '.services-grid', '.steps-grid'] },
}

export default async function HomePage() {
  const { thumbnails, logos, banners } = await getPortfolioData()

  return (
    <>
      <JsonLd data={webPageSchema} />

      <p className="sr-only">ExtoArts - YouTube Video Editing Agency & Thumbnail Design</p>

      {/* A. Hero Section ("FAQ Center") */}
      <HeroSection />

      {/* B. Getting Started Ribbon (Dark Banner with Accordions) */}
      <GettingStartedRibbon />

      {/* Why ExtoArts - real differentiators vs traditional agencies */}
      <WhyExtoArts />

      {/* Stats - track record numbers */}
      <StatsSection />

      {/* C. Services Grid ("Crafted for Creators") */}
      <ServicesSection />

      {/* Portfolio preview - real client work */}
      <PortfolioPreview thumbnails={thumbnails.slice(0, 9)} logos={logos.slice(0, 9)} banners={banners.slice(0, 9)} />

      {/* D. Process Steps ("Simple. Clear. Effective.") */}
      <ProcessSection />

      {/* Founder bio */}
      <FounderSection />

      {/* Client reviews */}
      <ReviewsSection />
    </>
  )
}
