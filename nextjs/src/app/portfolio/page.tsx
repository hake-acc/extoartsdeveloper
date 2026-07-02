'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import portfolioData from '@/data/portfolio.json'
import type { PortfolioCategory, PortfolioItem } from '@/types'

const categories = portfolioData as PortfolioCategory[]

function LightboxModal({ item, category, onClose }: { item: PortfolioItem; category: PortfolioCategory; onClose: () => void }) {
  return (
    <div
      className="modal open"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} preview`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <div style={{ maxWidth: 900, width: '95vw', position: 'relative' }}>
        <button
          onClick={onClose}
          aria-label="Close preview"
          style={{ position: 'absolute', top: -44, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1rem', zIndex: 10 }}
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
        <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            sizes="(max-width: 900px) 95vw, 900px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div style={{ padding: '16px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#fff', margin: 0, fontSize: '0.9rem' }}>{item.title}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>{category.name}</p>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', padding: '4px 12px', borderRadius: 999 }}>
            {item.project_type === 'video' ? 'Video' : 'Image'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightbox, setLightbox] = useState<{ item: PortfolioItem; category: PortfolioCategory } | null>(null)

  const filtered = activeCategory === 'all'
    ? categories
    : categories.filter((c) => c.slug === activeCategory)

  return (
    <>
      {lightbox && (
        <LightboxModal
          item={lightbox.item}
          category={lightbox.category}
          onClose={() => setLightbox(null)}
        />
      )}

      <h1 className="sr-only">ExtoArts Creative Portfolio - YouTube Thumbnails and Video Edits</h1>

      {/* Page hero */}
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(40px,4vw)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Real Work. Real Results.
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Our Creative <span className="sweep-text">Portfolio.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.72 }}>
          Gaming thumbnails, video edits, motion graphics, and channel artwork - all produced for real YouTube creators.
        </p>
      </section>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', padding: '0 20px 40px', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => setActiveCategory('all')}
          style={{ padding: '7px 18px', borderRadius: 999, border: '1px solid var(--border)', background: activeCategory === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: activeCategory === 'all' ? '#000' : 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
          aria-pressed={activeCategory === 'all'}
        >
          All Work
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            style={{ padding: '7px 18px', borderRadius: 999, border: '1px solid var(--border)', background: activeCategory === cat.slug ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: activeCategory === cat.slug ? '#000' : 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
            aria-pressed={activeCategory === cat.slug}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Portfolio grid */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', position: 'relative', zIndex: 10 }}>
        {filtered.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
                {cat.name}
              </h2>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                {cat.meta}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  className="preview-card"
                  onClick={() => setLightbox({ item, category: cat })}
                  style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 16, cursor: 'pointer', background: 'var(--surface)', border: 'none', padding: 0, display: 'block', width: '100%' }}
                  aria-label={`View ${item.title}`}
                >
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1)' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s', zIndex: 1 }} className="port-overlay" aria-hidden="true" />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 2, opacity: 0, transition: 'opacity 0.3s' }} className="port-label" aria-hidden="true">
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</p>
                  </div>
                  {item.project_type === 'video' && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} aria-hidden="true">
                      <i className="ti ti-player-play-filled" style={{ color: '#fff', fontSize: '1.1rem' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .preview-card:hover .port-overlay,
        .preview-card:focus .port-overlay { opacity: 1 !important; }
        .preview-card:hover .port-label,
        .preview-card:focus .port-label { opacity: 1 !important; }
        .preview-card:hover img { transform: scale(1.04); }
      `}</style>
    </>
  )
}
