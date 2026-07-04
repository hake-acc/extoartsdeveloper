import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import type { GalleryImage } from './PortfolioClient'
import { PortfolioClient } from './PortfolioClient'

export const metadata: Metadata = buildMetadata({
  title: 'Portfolio - YouTube Thumbnails, Logos & Channel Banners | ExtoArts',
  description: 'Browse ExtoArts creative work: YouTube thumbnails, brand logos, and channel banners designed for real creators.',
  path: '/portfolio',
})

const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

function readFolder(sub: string): GalleryImage[] {
  const dir = path.join(process.cwd(), 'public', 'portfolio', sub)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => ALLOWED_EXT.test(f))
    .map((f) => ({
      src: `/portfolio/${sub}/${f}`,
      alt: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      width: sub === 'Banners' ? 2560 : sub === 'Logos' ? 800 : 1280,
      height: sub === 'Banners' ? 1440 : sub === 'Logos' ? 800 : 720,
    }))
}

// Merge CDN thumbnails from portfolio.json with local uploads
async function getPortfolioData() {
  const local = readFolder('Thumbnails')
  const logos = readFolder('Logos')
  const banners = readFolder('Banners')

  // Pull CDN images from existing portfolio.json
  let cdnThumbnails: GalleryImage[] = []
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'src', 'data', 'portfolio.json'),
      'utf8'
    )
    const cats = JSON.parse(raw) as Array<{
      name: string
      items: Array<{ title: string; thumbnail_url: string }>
    }>
    cdnThumbnails = cats.flatMap((cat) =>
      cat.items.map((item) => ({
        src: item.thumbnail_url,
        alt: item.title,
        width: 1280,
        height: 720,
      }))
    )
  } catch {
    // portfolio.json unavailable — skip CDN images
  }

  return {
    thumbnails: [...local, ...cdnThumbnails],
    logos,
    banners,
  }
}

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'ExtoArts Portfolio',
  description: 'YouTube thumbnails, brand logos, and channel banners created by ExtoArts specialist designers.',
  url: 'https://extoarts.in/portfolio',
}

export default async function PortfolioPage() {
  const { thumbnails, logos, banners } = await getPortfolioData()

  return (
    <>
      <JsonLd data={portfolioSchema} />
      <h1 className="sr-only">ExtoArts Portfolio</h1>

      {/* Hero */}
      <section style={{
        padding: 'min(20vh,160px) min(20px,5%) min(56px,6vw)',
        textAlign: 'center',
        maxWidth: 860,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Real Work. Real Results.
        </span>
        <h1 style={{
          fontSize: 'clamp(2.6rem,7vw,5rem)',
          fontWeight: 900,
          letterSpacing: '-2.5px',
          lineHeight: 1.0,
          marginBottom: 20,
          color: 'var(--text-main)',
        }}>
          Our <span className="sweep-text">Portfolio</span>
        </h1>
        <p style={{
          fontSize: 'clamp(0.95rem,1.8vw,1.1rem)',
          color: 'var(--text-muted)',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.72,
        }}>
          Thumbnails built for CTR. Logos built for identity. Banners built for first impressions.
        </p>
      </section>

      {/* Tabs + grid */}
      <PortfolioClient
        thumbnails={thumbnails}
        logos={logos}
        banners={banners}
      />
    </>
  )
}
