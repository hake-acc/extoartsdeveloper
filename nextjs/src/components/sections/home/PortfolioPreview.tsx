import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { HomePortfolioFilter } from './HomePortfolioFilter'

interface Item { src: string; alt: string }

interface Props {
  thumbnails: Item[]
  logos: Item[]
  banners: Item[]
}

export function PortfolioPreview({ thumbnails, logos, banners }: Props) {
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

      <HomePortfolioFilter thumbnails={thumbnails} logos={logos} banners={banners} />

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link href="/portfolio" className="btn btn-glass">
          <i className="ti ti-photo" aria-hidden="true" /> View Full Portfolio
        </Link>
      </div>
    </section>
  )
}
