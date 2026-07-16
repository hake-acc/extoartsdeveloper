import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'
import { EstimateClient } from './EstimateClient'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing Cost Estimator — Instant Price Calculator',
  description: 'Estimate your YouTube video editing cost instantly. Choose video length, complexity level, and add-ons to calculate a ballpark price before your custom Discord quote.',
  path: '/estimate',
})

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/estimate`,
  url: `${SITE_URL}/estimate`,
  name: 'YouTube Video Editing Cost Estimator — ExtoArts',
  description: 'Instantly estimate what professional YouTube video editing costs through ExtoArts. Select video length, complexity, and add-ons for a real ballpark figure.',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
}

export default function EstimatePage() {
  return (
    <>
      <JsonLd data={webPageSchema} />

      {/* SEO-visible context — server rendered for crawlers */}
      <div className="sr-only">
        <h2>How ExtoArts Pricing Works</h2>
        <p>
          ExtoArts operates on a flat 10% agency fee model. You set the editing budget for your project,
          ExtoArts takes 10% for agency management, and 90% goes directly to the specialist editor
          assigned to your video. This makes ExtoArts one of the most cost-effective professional editing
          agencies available for YouTube creators.
        </p>
        <p>
          Use this estimator to calculate a realistic ballpark for your project before opening a Discord
          ticket. The estimate covers video length, editing complexity, and optional add-ons like thumbnail
          design, rush delivery, captions, B-roll sourcing, custom motion graphics, and channel branding packs.
        </p>
        <p>
          Typical editing budgets through ExtoArts range from $50-$100 for short-form content (YouTube
          Shorts, TikTok under 5 minutes), $100-$300 for standard 10-20 minute YouTube videos with
          standard production quality, and $300-$800+ for complex long-form productions with heavy motion
          graphics or advanced VFX work. Thumbnail design adds $25-$80 depending on complexity.
        </p>
        <p>
          This estimator gives you a ballpark figure. Your actual quote, confirmed via Discord, may differ
          based on your specific footage, style requirements, and editor match. All final quotes are itemized
          and transparent with no hidden fees.
        </p>
        <p>
          ExtoArts also offers monthly retainer packages for creators who upload consistently. Retainer
          clients receive priority scheduling, a dedicated editor, and unlimited revisions. Contact us on
          Discord for retainer pricing after reviewing your estimate.
        </p>
      </div>

      <EstimateClient />
    </>
  )
}
