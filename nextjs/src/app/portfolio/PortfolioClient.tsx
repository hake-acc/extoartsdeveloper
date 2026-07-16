'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export type PortfolioTab = 'thumbnails' | 'logos' | 'banners'

export interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

interface Props {
  thumbnails: GalleryImage[]
  logos: GalleryImage[]
  banners: GalleryImage[]
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ image, tab, onClose }: { image: GalleryImage; tab: PortfolioTab; onClose: () => void }) {
  const isCircle = tab === 'logos'
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', maxWidth: isCircle ? 400 : tab === 'banners' ? 1100 : 900, width: '100%' }}
      >
        <button
          onClick={onClose}
          aria-label="Close preview"
          style={{
            position: 'absolute', top: -46, right: 0,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 999, width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', fontSize: '1rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
        <div style={{
          borderRadius: isCircle ? '50%' : 16,
          overflow: 'hidden',
          aspectRatio: isCircle ? '1/1' : tab === 'banners' ? '2560/1440' : '16/9',
          width: '100%',
          background: '#111',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}>
          <Image
            src={image.src}
            alt={image.alt}
            width={isCircle ? 800 : tab === 'banners' ? 2560 : 1280}
            height={isCircle ? 800 : 720}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            unoptimized={false}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Section grid ──────────────────────────────────────────────────────────────
function SectionGrid({
  items,
  tab,
  onSelect,
}: {
  items: GalleryImage[]
  tab: PortfolioTab
  onSelect: (img: GalleryImage, tab: PortfolioTab) => void
}) {
  if (items.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns:
          tab === 'logos'
            ? 'repeat(auto-fill, minmax(160px, 1fr))'
            : tab === 'banners'
            ? '1fr'
            : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: tab === 'logos' ? 20 : tab === 'banners' ? 24 : 16,
      }}
    >
      {items.map((img, i) => (
        <motion.button
          key={img.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.035, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onSelect(img, tab)}
          aria-label={`View ${img.alt}`}
          style={{
            display: 'block',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: tab === 'logos' ? '50%' : 12,
            overflow: 'hidden',
            aspectRatio: tab === 'logos' ? '1/1' : tab === 'banners' ? '32/9' : '16/9',
            position: 'relative',
            transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i < 3}
            sizes={
              tab === 'logos' ? '200px' :
              tab === 'banners' ? '100vw' :
              '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
            style={{ objectFit: 'cover' }}
            unoptimized={false}
          />
          <span
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
              borderRadius: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.28)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)' }}
          >
            <i className="ti ti-zoom-in" aria-hidden="true" style={{ color: '#fff', fontSize: '1.4rem', opacity: 0 }} />
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function PortfolioClient({ thumbnails, logos, banners }: Props) {
  const [lightbox, setLightbox] = useState<{ image: GalleryImage; tab: PortfolioTab } | null>(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  function handleSelect(img: GalleryImage, tab: PortfolioTab) {
    setLightbox({ image: img, tab })
  }

  const SECTIONS: { id: PortfolioTab; label: string; icon: string; ratio: string; items: GalleryImage[] }[] = [
    { id: 'thumbnails', label: 'Thumbnails', icon: 'ti-photo', ratio: '16:9', items: thumbnails },
    { id: 'logos', label: 'Logos', icon: 'ti-circle-letter-e', ratio: '1:1 circular', items: logos },
    { id: 'banners', label: 'Banners', icon: 'ti-panorama', ratio: 'Channel Banner', items: banners },
  ]

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', display: 'flex', flexDirection: 'column', gap: 72 }}>
        {SECTIONS.map((sec) => (
          sec.items.length > 0 && (
            <section key={sec.id} aria-labelledby={`sec-${sec.id}`}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontSize: '1rem', flexShrink: 0,
                }}>
                  <i className={`ti ${sec.icon}`} aria-hidden="true" />
                </div>
                <div>
                  <h2 id={`sec-${sec.id}`} style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.3px' }}>
                    {sec.label}
                  </h2>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {sec.ratio} · {sec.items.length} piece{sec.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <SectionGrid items={sec.items} tab={sec.id} onSelect={handleSelect} />
            </section>
          )
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox image={lightbox.image} tab={lightbox.tab} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
