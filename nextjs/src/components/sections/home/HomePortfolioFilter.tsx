'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Tab = 'thumbnails' | 'logos' | 'banners'

interface Item { src: string; alt: string }
interface Props {
  thumbnails: Item[]
  logos: Item[]
  banners: Item[]
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'thumbnails', label: 'Thumbnails', icon: 'ti-photo' },
  { id: 'logos',      label: 'Logos',      icon: 'ti-circle-letter-e' },
  { id: 'banners',    label: 'Banners',    icon: 'ti-panorama' },
]

export function HomePortfolioFilter({ thumbnails, logos, banners }: Props) {
  const [active, setActive] = useState<Tab>('thumbnails')

  const data: Record<Tab, Item[]> = { thumbnails, logos, banners }
  const items = data[active].slice(0, 6)

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        {TABS.map((tab) => {
          const isActive = active === tab.id
          const count = data[tab.id].length
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              aria-pressed={isActive}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 20px',
                borderRadius: 999,
                border: isActive ? '1px solid rgba(34,211,238,0.45)' : '1px solid var(--border)',
                background: isActive ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.03)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
              }}
            >
              <i className={`ti ${tab.icon}`} aria-hidden="true" style={{ fontSize: '0.85rem' }} />
              {tab.label}
              {count > 0 && (
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  padding: '1px 6px', borderRadius: 999,
                  background: isActive ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', padding: '40px 0' }}>
          Coming soon
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: active === 'logos'
            ? 'repeat(auto-fill, minmax(160px,1fr))'
            : active === 'banners'
            ? '1fr'
            : 'repeat(auto-fit, minmax(260px,1fr))',
          gap: 16,
        }}>
          {items.map((item, i) => (
            <Link
              key={item.src}
              href="/portfolio"
              style={{
                display: 'block',
                position: 'relative',
                aspectRatio: active === 'logos' ? '1/1' : active === 'banners' ? '32/9' : '16/9',
                overflow: 'hidden',
                borderRadius: active === 'logos' ? '50%' : 16,
                cursor: 'pointer',
                transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
                textDecoration: 'none',
              }}
              className="portfolio-home-item"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={active === 'logos' ? '200px' : '(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw'}
                style={{ objectFit: 'cover' }}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(0deg,rgba(0,0,0,0.55) 0%,transparent 50%)',
                zIndex: 1, transition: 'opacity 0.2s',
              }} />
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .portfolio-home-item:hover { transform: scale(1.025); box-shadow: 0 16px 40px rgba(0,0,0,0.45); }
      `}</style>
    </div>
  )
}
