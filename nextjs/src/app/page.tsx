import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { SITE_URL, DISCORD_URL } from '@/lib/constants'
import { JsonLd } from '@/components/JsonLd'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { ServicesSection } from '@/components/sections/home/ServicesSection'
import { PortfolioPreview } from '@/components/sections/home/PortfolioPreview'
import { ReviewsSection } from '@/components/sections/home/ReviewsSection'
import { FounderSection } from '@/components/sections/home/FounderSection'
import { WhoWeServe } from '@/components/sections/home/WhoWeServe'
import { WhyExtoArts } from '@/components/sections/home/WhyExtoArts'
import { OrganicDivider } from '@/components/ui/OrganicDivider'
import type { PortfolioPreviewItem } from '@/types'

const THUMB_DIR = path.join(process.cwd(), 'public', 'portfolio', 'Thumbnails')
const IMG_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png'])

function getLatestThumbnails(count = 4): PortfolioPreviewItem[] {
  try {
    const files = fs.readdirSync(THUMB_DIR)
      .filter(f => IMG_EXT.has(path.extname(f).toLowerCase()))
      .map(f => ({
        name: f,
        mtime: fs.statSync(path.join(THUMB_DIR, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, count)

    return files.map((f, i) => ({
      id: `thumb-${i}`,
      thumb: `/portfolio/Thumbnails/${f.name}`,
      name: path.basename(f.name, path.extname(f.name)).replace(/[-_]/g, ' '),
      meta: 'Thumbnail Design',
    }))
  } catch (err) {
    console.error('[getLatestThumbnails] failed to read thumbnails dir:', err)
    return []
  }
}

export const metadata: Metadata = {
  title: 'YouTube Video Editing & Thumbnail Design | ExtoArts',
  description:
    'ExtoArts is a YouTube video editing agency for creators. High-retention edits, thumbnail design, Shorts editing, and channel automation. Flat-fee pricing.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: 'ExtoArts - YouTube Editing Agency',
    description: 'YouTube editing agency for creators. High-retention edits, flat-fee pricing.',
    url: `${SITE_URL}/`,
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
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.services-hero', '.stat-item', '.services-section'] },
}

export default function HomePage() {
  const latestThumbs = getLatestThumbnails(4)

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={webPageSchema} />

      <p className="sr-only">ExtoArts - YouTube Video Editing Agency & Thumbnail Design</p>

      <HeroSection />
      <StatsSection />
      <OrganicDivider />
      <ServicesSection />
      <PortfolioPreview categories={latestThumbs} />
      <OrganicDivider />
      <ReviewsSection />
      <WhoWeServe />
      <WhyExtoArts />
      <FounderSection />
    </>
  )
}
