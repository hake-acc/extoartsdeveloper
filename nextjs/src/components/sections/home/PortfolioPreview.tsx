import Link from 'next/link'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { PortfolioPreviewItem } from '@/types'

export function PortfolioPreview({ categories }: { categories: PortfolioPreviewItem[] }) {
  const featured = categories.slice(0, 4)

  return (
    <section
      aria-labelledby="portfolio-preview-heading"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <SectionHeader
        label="Our Work"
        title={<>Built for <span className="sweep-text">Creators.</span></>}
        subtitle="From gaming thumbnails to cinematic video edits - every piece is crafted for real performance."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
        }}
      >
        {featured.map((cat, i) => (
          <article
            key={cat.id}
            className={`preview-card sr${i % 2 === 0 ? ' sr-left' : ' sr-right'}`}
            style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 20, cursor: 'pointer' }}
          >
            <Link href="/portfolio" style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', position: 'relative' }} tabIndex={0}>
              <Image
                src={cat.thumb}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
              {/* Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 55%)',
                  zIndex: 1,
                }}
                aria-hidden="true"
              />
              {/* Label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '18px 18px 20px',
                  zIndex: 2,
                }}
              >
                <p style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.2px', marginBottom: 3 }}>
                  {cat.name}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 600 }}>
                  {cat.meta}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link href="/portfolio" className="btn btn-glass">
          <i className="ti ti-photo" aria-hidden="true" /> View Full Portfolio
        </Link>
      </div>
    </section>
  )
}
