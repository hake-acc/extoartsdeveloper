import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { DiscordButton } from '@/components/ui/DiscordButton'
import { BorderBeam } from '@/components/ui/BorderBeam'
import { InView } from '@/components/ui/InView'
import { COST_TIERS, RETAINER_PACKAGES } from '@/data/pricing'
import { TenPercentModelVisual } from '@/components/sections/pricing/TenPercentModelVisual'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing Pricing & Rates',
  description: 'ExtoArts charges a flat 10% agency fee - 90% goes to your editor. Transparent YouTube video editing rates, project pricing, and monthly retainer packages.',
  path: '/pricing',
})

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE_URL}/pricing` },
  ],
}

const pricingPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/pricing`,
  name: 'YouTube Video Editing Pricing & Rates - ExtoArts',
  description: 'ExtoArts charges a flat 10% agency fee. 90% of your editing budget goes directly to the specialist editor. Transparent rates, no hidden fees.',
  url: `${SITE_URL}/pricing`,
  inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  mainEntity: {
    '@type': 'Service',
    '@id': `${SITE_URL}/pricing#pricing-model`,
    name: 'YouTube Video Editing - Flat 10% Agency Fee Model',
    description: 'ExtoArts charges a flat 10% agency management fee on every project. The creator sets the editing budget, ExtoArts takes 10%, and 90% goes directly to the specialist editor assigned to the project.',
    provider: { '@id': `${SITE_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      description: 'Flat 10% agency fee on creator-set editing budget. No retainer, no setup costs.',
      priceSpecification: {
        '@type': 'PriceSpecification',
        description: '10% of creator-set editing budget',
        minPrice: '0',
        priceCurrency: 'USD',
      },
    },
    areaServed: { '@type': 'AdministrativeArea', name: 'Worldwide' },
  },
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={pricingPageSchema} />
      {/* Hero */}
      <section
        style={{
          padding: 'min(20vh,160px) min(20px,5%) min(60px,5vw)',
          textAlign: 'center',
          maxWidth: 720,
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}>
          <span className="gradient-dot" aria-hidden="true" />
          Radical Transparency
        </span>
        <h1 className="font-hero" style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 400, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 20, color: 'var(--text-main)' }}>
          Simple, Honest <span className="sweep-text">Pricing.</span>
        </h1>
        <p className="sr-only">ExtoArts Pricing - Flat 10% Agency Fee</p>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.12rem)', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 14px', lineHeight: 1.75 }}>
          You set the budget. We take 10%. Your editor gets 90%. That&apos;s the entire model.
        </p>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7, opacity: 0.8 }}>
          For YouTube creators who want specialist-quality editing without traditional agency fees.
        </p>
      </section>

      {/* The 10% model explainer — interactive motion graphic */}
      <TenPercentModelVisual />

      {/* Market comparison */}
      <section style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 14, alignItems: 'center', gap: 8 }}>
            <span className="gradient-dot" aria-hidden="true" />
            Market Comparison
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Where Does ExtoArts Fit?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="tier-grid">
          {COST_TIERS.map((tier, i) => (
            <InView
              key={tier.name}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`price-card${tier.featured ? ' featured' : ''}`}
              style={{
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 20,
                border: tier.featured ? '1px solid rgba(105,221,255,0.24)' : '1px solid var(--border)',
              } as React.CSSProperties}
            >
              {tier.featured && (
                <>
                  <BorderBeam size={100} duration={8} colorFrom="#69ddff" colorTo="#dbbadd" borderWidth={1} />
                  <div style={{ position: 'absolute', top: 14, right: 14 }}>
                    <span className="highlight-chip">
                      <i className="ti ti-star" aria-hidden="true" style={{ fontSize: '0.55rem' }} />
                      ExtoArts
                    </span>
                  </div>
                </>
              )}
              {tier.warning && (
                <div style={{ position: 'absolute', top: 14, right: 14 }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '3px 10px', borderRadius: 999 }}>
                    Low quality risk
                  </span>
                </div>
              )}
              <div className="tilt-inner">
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6, paddingRight: tier.featured || tier.warning ? '60px' : 0 }}>
                  {tier.name}
                </h3>
                <div style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, color: tier.featured ? 'var(--primary)' : 'var(--text-main)', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 8 }}>
                  {tier.range}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {tier.who}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                  {tier.includes}
                </p>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* Retainer packages */}
      <section style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 14, alignItems: 'center', gap: 8 }}>
            <span className="gradient-dot" aria-hidden="true" />
            Monthly Plans
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.2vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 12 }}>
            Retainer Packages
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto', lineHeight: 1.72 }}>
            Lock in a dedicated editor, priority delivery, and consistent quality every month.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="package-grid">
          {RETAINER_PACKAGES.map((pkg, i) => (
            <InView
              key={pkg.name}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`price-card${pkg.featured ? ' featured tilt-card glass-card' : ''}`}
              style={{
                padding: 'min(36px,3.5vw)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 22,
                border: pkg.featured ? '1px solid rgba(105,221,255,0.22)' : '1px solid var(--border)',
              } as React.CSSProperties}
            >
              {pkg.featured && (
                <>
                  <BorderBeam size={150} duration={9} delay={1} colorFrom="#69ddff" colorTo="#dbbadd" borderWidth={1} />
                  <div style={{ position: 'absolute', top: 18, right: 18 }}>
                    <span className="highlight-chip">Most Popular</span>
                  </div>
                </>
              )}
              <div className={pkg.featured ? 'tilt-inner' : undefined}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 6, letterSpacing: '-0.3px' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.65 }}>
                  {pkg.desc}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      <i className="ti ti-check" aria-hidden="true" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <DiscordButton
                  className={`btn ${pkg.featured ? 'btn-primary-glow' : 'btn-glass'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {pkg.cta}
                </DiscordButton>
              </div>
            </InView>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 24, opacity: 0.7 }}>
          All plans priced based on video length, complexity, and volume.{' '}
          <Link href="/estimate" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
            Use our estimator
          </Link>{' '}
          for a ballpark figure.
        </p>
      </section>

      {/* Payment methods */}
      <section style={{ padding: '0 min(20px,5%) min(100px,10vw)', maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}>
          <span className="gradient-dot" aria-hidden="true" />
          Payment Methods
        </span>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.5px' }}>
          Pay How You&apos;re Comfortable
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
          We work with creators worldwide - accepting payments in formats that work globally.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['PayPal', 'UPI', 'Bank Transfer', 'USDT', 'BTC', 'ETH', 'EasyPaisa', 'Bkash', 'PKR'].map((m) => (
            <span
              key={m}
              style={{
                padding: '8px 18px',
                border: '1px solid var(--border)',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.025)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              {m}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 20, opacity: 0.6 }}>
          50% deposit before work begins. Remaining balance due before final file delivery.
        </p>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: '0 min(20px,5%) min(100px,10vw)', maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="tilt-card glass-card" style={{ border: '1px solid rgba(105,221,255,0.18)', borderRadius: 24, padding: 'min(52px,5vw)' }}>
          <div className="tilt-inner">
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 12, color: 'var(--text-main)' }}>
              Ready to see an exact number?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.72, maxWidth: 420, margin: '0 auto 28px' }}>
              Share your footage length, upload frequency, and budget on Discord — you&apos;ll have a custom quote within hours. No commitment until you approve it.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <DiscordButton className="btn btn-main">
                <i className="ti ti-brand-discord" aria-hidden="true" /> Get a Custom Quote
              </DiscordButton>
              <Link href="/estimate" className="btn btn-glass">
                <i className="ti ti-calculator" aria-hidden="true" /> Cost Estimator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .fee-calc-grid { grid-template-columns: 1fr !important; }
          .tier-grid, .package-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .tier-grid, .package-grid { grid-template-columns: 1fr !important; }
        }
        /* Light mode: price cards readable over ink backgrounds */
        @media (max-width: 640px) {
          html[data-theme="light"] .price-card {
            background: rgba(255, 252, 246, 0.93) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
          }
          html[data-theme="light"] .price-card h2,
          html[data-theme="light"] .price-card h3,
          html[data-theme="light"] .price-card p,
          html[data-theme="light"] .price-card span,
          html[data-theme="light"] .price-card li {
            text-shadow: none !important;
            color: var(--text-main) !important;
          }
          html[data-theme="light"] .price-card p,
          html[data-theme="light"] .price-card li {
            color: var(--text-muted) !important;
          }
        }
      `}</style>
    </>
  )
}
