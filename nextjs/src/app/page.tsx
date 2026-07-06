import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/JsonLd'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { GettingStartedRibbon } from '@/components/sections/home/GettingStartedRibbon'
import { ServicesSection } from '@/components/sections/home/ServicesSection'
import { ProcessSection } from '@/components/sections/home/ProcessSection'

export const metadata: Metadata = {
  title: { absolute: 'YouTube Video Editing & Thumbnail Design | ExtoArts' },
  description:
    'ExtoArts is a YouTube video editing agency for creators. High-retention edits, thumbnail design, Shorts editing, and channel automation. Flat-fee pricing.',
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
    title: { absolute: 'YouTube Video Editing & Thumbnail Design | ExtoArts' },
    description: 'YouTube video editing agency for creators. High-retention edits, thumbnail design, Shorts editing, and channel automation. Flat-fee pricing.',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is ExtoArts?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts (extoarts.in) is a YouTube video editing agency founded in 2024 that provides high-retention video editing, thumbnail design, YouTube Shorts and TikTok editing, motion graphics, and full YouTube channel automation. ExtoArts operates on a 10% flat agency fee model, meaning 90% of a creator\'s editing budget goes directly to the specialist editor assigned to the project.' } },
    { '@type': 'Question', name: 'How much does ExtoArts charge for video editing?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts charges a flat 10% agency fee. If a creator\'s editing budget is $500 per video, ExtoArts takes $50 and the editor receives $450. Traditional agencies charge 30-50% commission. There are no hidden fees, retainer lock-ins, or setup costs.' } },
    { '@type': 'Question', name: 'How long does an ExtoArts video edit take?', acceptedAnswer: { '@type': 'Answer', text: 'Standard YouTube video edits take 3-5 business days. Rush delivery is available. Thumbnails are delivered within 24-48 hours. YouTube Shorts and TikTok edits take 1-2 business days.' } },
    { '@type': 'Question', name: 'Does ExtoArts work with gaming channels?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. ExtoArts has a dedicated gaming content team serving Roblox, Minecraft, PUBG, Free Fire, Fortnite, GTA V, and other gaming niches.' } },
    { '@type': 'Question', name: 'How do I start working with ExtoArts?', acceptedAnswer: { '@type': 'Answer', text: 'Join the ExtoArts Discord server at discord.gg/extoarts-1402333030827425922 and open a private ticket. Share your footage, niche, upload schedule, and style references.' } },
  ],
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/`,
  url: `${SITE_URL}/`,
  name: 'ExtoArts | YouTube Video Editing Agency, Thumbnail Design & Shorts Editing',
  description: 'YouTube video editing agency for creators. High-retention video editing, viral thumbnail design, TikTok and YouTube Shorts editing, channel automation, fair pricing, and real editors.',
  inLanguage: 'en-US',
  datePublished: '2024-01-01',
  dateModified: '2026-06-17',
  about: { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.hero', '.torn-banner', '.services-grid', '.steps-grid'] },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={webPageSchema} />

      <p className="sr-only">ExtoArts - YouTube Video Editing Agency & Thumbnail Design</p>

      {/* A. Hero Section ("FAQ Center") */}
      <HeroSection />

      {/* B. Getting Started Ribbon (Dark Banner with Accordions) */}
      <GettingStartedRibbon />

      {/* C. Services Grid ("Crafted for Creators") */}
      <ServicesSection />

      {/* D. Process Steps ("Simple. Clear. Effective.") */}
      <ProcessSection />
    </>
  )
}
