import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import type { GalleryImage } from './PortfolioClient'
import { PortfolioClient } from './PortfolioClient'
import { FocusSliceCarousel } from '@/components/ui/FocusSliceCarousel'

export const metadata: Metadata = buildMetadata({
  title: 'Portfolio — YouTube Thumbnails, Logos & Channel Banners',
  description: 'Browse ExtoArts creative work: YouTube thumbnails, brand logos, and channel banners designed for real creators.',
  path: '/portfolio',
})

const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

// Only ever load locally-uploaded "All Artists Samples" — legacy CDN links
// (old iili.io game-category thumbnails) must never be surfaced in the portfolio.
function readFolder(sub: string): GalleryImage[] {
  const dir = path.join(process.cwd(), 'public', 'portfolio', sub)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => ALLOWED_EXT.test(f))
    .map((f) => ({
      file: f,
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ file }) => ({
      src: `/portfolio/${sub}/${file}`,
      alt: sub === 'Logos' ? 'ExtoArts logo design' : sub === 'Banners' ? 'ExtoArts channel banner' : 'ExtoArts portfolio work',
      width: sub === 'Banners' ? 2560 : sub === 'Logos' ? 800 : 1280,
      height: sub === 'Banners' ? 1440 : sub === 'Logos' ? 800 : 720,
    }))
}

async function getPortfolioData() {
  return {
    thumbnails: readFolder('Thumbnails'),
    logos: readFolder('Logos'),
    banners: readFolder('Banners'),
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
      <p className="sr-only">ExtoArts Portfolio</p>

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
        <p
          className="hero-subtitle"
          style={{
            fontSize: 'clamp(0.95rem,1.8vw,1.1rem)',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.72,
          }}
        >
          Thumbnails built for CTR. Logos built for identity. Banners built for first impressions.
        </p>
      </section>

      {/* Featured samples carousel — newest "All Artists Samples" only */}
      {thumbnails.length > 0 && (
        <section
          aria-label="Featured samples"
          style={{ padding: '0 min(20px,5%) min(64px,7vw)' }}
        >
          <FocusSliceCarousel
            items={thumbnails.map((t) => ({
              src: t.src,
              alt: t.alt,
              subtitle: 'Thumbnail Design',
            }))}
            maxVisible={6}
          />
        </section>
      )}

      {/* Tabs + grid */}
      <PortfolioClient
        thumbnails={thumbnails}
        logos={logos}
        banners={banners}
      />
    </>
  )
}
