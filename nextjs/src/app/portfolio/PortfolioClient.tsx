'use client'

import { useState, useCallback } from 'react'
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
      aria-label={`${image.alt} preview`}
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
            unoptimized={image.src.includes('iili.io')}
          />
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{image.alt}</p>
      </motion.div>
    </motion.div>
  )
}

// ── Tab pill ──────────────────────────────────────────────────────────────────
const TAB_CONFIG: { id: PortfolioTab; label: string; icon: string; ratio: string }[] = [
  { id: 'thumbnails', label: 'Thumbnails', icon: 'ti-photo', ratio: '16:9' },
  { id: 'logos',      label: 'Logos',      icon: 'ti-circle-letter-e', ratio: '1:1' },
  { id: 'banners',    label: 'Banners',    icon: 'ti-panorama', ratio: 'Channel Banner' },
]

export function PortfolioClient({ thumbnails, logos, banners }: Props) {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('thumbnails')
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const data = { thumbnails, logos, banners }
  const current = data[activeTab]
  const currentTabConfig = TAB_CONFIG.find(t => t.id === activeTab)!

  return (
    <>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        padding: '0 min(20px,5%) 48px',
        flexWrap: 'wrap',
      }}>
        {TAB_CONFIG.map((tab) => {
          const count = data[tab.id].length
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px',
                borderRadius: 999,
                border: isActive ? '1px solid rgba(34,211,238,0.4)' : '1px solid var(--border)',
                background: isActive ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.03)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
              }}
            >
              <i className={`ti ${tab.icon}`} aria-hidden="true" style={{ fontSize: '0.9rem' }} />
              {tab.label}
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                background: isActive ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                letterSpacing: 0,
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Ratio badge */}
      <div style={{ textAlign: 'center', marginBottom: 32, marginTop: -24 }}>
        <span style={{
          fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '3px', color: 'var(--text-muted)', opacity: 0.6,
        }}>
          {currentTabConfig.ratio} format
        </span>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)' }}>
        <AnimatePresence mode="wait">
          {current.length === 0 ? (
            <motion.div
              key={`empty-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.5rem',
              }}>
                <i className={`ti ${currentTabConfig.icon}`} aria-hidden="true" />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                Coming soon
              </p>
              <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>
                {activeTab === 'logos' ? 'Brand logos' : 'YouTube channel banners'} will appear here shortly
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: activeTab === 'logos'
                  ? 'repeat(auto-fill, minmax(160px, 1fr))'
                  : activeTab === 'banners'
                  ? '1fr'
                  : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: activeTab === 'logos' ? 20 : activeTab === 'banners' ? 24 : 16,
              }}
            >
              {current.map((img, i) => (
                <motion.button
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightbox(img)}
                  aria-label={`View ${img.alt}`}
                  style={{
                    display: 'block',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    borderRadius: activeTab === 'logos' ? '50%' : 12,
                    overflow: 'hidden',
                    aspectRatio: activeTab === 'logos' ? '1/1' : activeTab === 'banners' ? '32/9' : '16/9',
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
                      activeTab === 'logos' ? '200px' :
                      activeTab === 'banners' ? '100vw' :
                      '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    }
                    style={{ objectFit: 'cover' }}
                    unoptimized={img.src.includes('iili.io')}
                  />
                  {/* Hover overlay */}
                  <span style={{
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
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox image={lightbox} tab={activeTab} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
