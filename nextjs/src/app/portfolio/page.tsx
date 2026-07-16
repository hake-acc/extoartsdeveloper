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
    .map(({ file }) => {
      // Derive descriptive alt text from the filename so each image is unique
      // and meaningful for screen readers and image search indexing.
      const base = file
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
      const alt =
        sub === 'Logos'
          ? `${base} - YouTube channel logo designed by ExtoArts`
          : sub === 'Banners'
            ? `${base} - YouTube channel banner designed by ExtoArts`
            : `${base} - YouTube thumbnail designed by ExtoArts`
      return {
        src: `/portfolio/${sub}/${file}`,
        alt,
        width: sub === 'Banners' ? 2560 : sub === 'Logos' ? 800 : 1280,
        height: sub === 'Banners' ? 1440 : sub === 'Logos' ? 800 : 720,
      }
    })
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
  '@id': 'https://extoarts.in/portfolio',
  name: 'ExtoArts Portfolio - YouTube Thumbnails, Logos & Channel Banners',
  description: 'YouTube thumbnails built for CTR, brand logos, and channel banners created by ExtoArts specialist designers for real creators.',
  url: 'https://extoarts.in/portfolio',
  inLanguage: 'en-US',
  isPartOf: { '@id': 'https://extoarts.in/#website' },
  about: { '@id': 'https://extoarts.in/#organization' },
  publisher: { '@id': 'https://extoarts.in/#organization' },
}

export default async function PortfolioPage() {
  const { thumbnails, logos, banners } = await getPortfolioData()

  return (
    <>
      <JsonLd data={portfolioSchema} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://extoarts.in/' },
          { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://extoarts.in/portfolio' },
        ],
      }} />
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

      {/* Portfolio context — visible to crawlers and readers */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 min(20px,5%) min(48px,5vw)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          <div className="glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 10, letterSpacing: '-0.2px' }}>YouTube Thumbnails</h2>
            <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              Custom thumbnail designs for gaming, vlog, educational, and faceless channels. Each thumbnail is engineered for CTR using composition theory, contrast, and emotion-driven visual hierarchy. We produce A/B-ready variants so creators can test and iterate.
            </p>
          </div>
          <div className="glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 10, letterSpacing: '-0.2px' }}>Channel Logos</h2>
            <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              Brand identity marks designed for YouTube channel icons. A strong logo works at 98×98px and still communicates the channel personality instantly. Our logo designs are delivered in multiple formats for use across platforms.
            </p>
          </div>
          <div className="glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 10, letterSpacing: '-0.2px' }}>Channel Banners</h2>
            <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              YouTube channel art optimized for the 2560×1440px banner format with safe zones for all device sizes. Banners establish the visual identity of the channel and signal professionalism to first-time visitors. See our <a href="/services" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>full services</a> for video editing work.
            </p>
          </div>
        </div>
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
