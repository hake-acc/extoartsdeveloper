import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DiscordButton } from '@/components/ui/DiscordButton'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing Pricing & Rates | ExtoArts',
  description: 'ExtoArts charges a flat 10% agency fee - 90% goes to your editor. Transparent YouTube video editing rates, project pricing, and monthly retainer packages.',
  path: '/pricing',
})

const COST_TIERS = [
  { name: 'Basic Editing', range: '$20 - $80', who: 'Freelancer (Low-tier)', includes: 'Simple cuts, basic transitions, minimal color. Suitable for low-budget or beginner channels.', warning: true },
  { name: 'Mid-Tier Specialist', range: '$100 - $350', who: 'Experienced Freelancer / ExtoArts', includes: 'Retention-focused editing, motion graphics, professional color grading, thumbnail design.', featured: true },
  { name: 'Premium Agency', range: '$400 - $1,200+', who: 'Large Agency', includes: 'Full-service production, multiple rounds, dedicated account management, licensed music.', warning: false },
]

const RETAINER_PACKAGES = [
  {
    name: 'Starter',
    price: 'Custom',
    period: '/month',
    desc: 'For new creators getting consistent professional quality from the start.',
    features: ['4 videos per month', 'Standard turnaround (3-5 days)', '2 revisions per video', 'Thumbnail design included', 'Discord priority support'],
    featured: false,
    cta: 'Get a Quote',
  },
  {
    name: 'Creator',
    price: 'Custom',
    period: '/month',
    desc: 'For active YouTubers who upload weekly and need reliable, fast delivery.',
    features: ['8-12 videos per month', 'Priority queue (2-3 days)', 'Unlimited revisions', 'Thumbnails included', 'Short-form repurposing included', 'Dedicated editor assigned'],
    featured: true,
    cta: 'Most Popular - Get a Quote',
  },
  {
    name: 'Agency',
    price: 'Custom',
    period: '/month',
    desc: 'For content businesses, brands, and multi-channel networks.',
    features: ['Unlimited projects', 'Rush delivery available', 'Multiple editor team', 'Full production pipeline', 'White-label available', 'Monthly strategy call'],
    featured: false,
    cta: 'Get a Quote',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much does YouTube video editing cost in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'YouTube video editing ranges from $20-$80 for basic freelancer work, $100-$350 for specialist mid-tier editing, and $400-$1,200+ for premium agency productions. ExtoArts operates on a flat 10% fee - you set the budget, ExtoArts takes 10%, and 90% goes to the specialist editor.' } },
    { '@type': 'Question', name: 'How much does ExtoArts charge for video editing?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts charges a flat 10% agency management fee. A creator with a $200 per video budget pays ExtoArts $20 and their assigned specialist editor receives $180. No retainer fees, no setup costs, no hidden charges.' } },
    { '@type': 'Question', name: 'What payment methods does ExtoArts accept?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts accepts PayPal, bank transfer, USDT, BTC, ETH, UPI, EasyPaisa, Bkash, and PKR transfer. Most projects require a 50% deposit before work begins.' } },
  ],
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <h1 className="sr-only">ExtoArts Pricing - Flat 10% Agency Fee</h1>

      {/* Page hero */}
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Flat 10% Agency Fee
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Transparent Pricing.<br /><span className="sweep-text">No Surprises.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.72 }}>
          You set your editing budget. We take 10%. Your editor gets 90%. It&apos;s that simple.
          No retainer lock-in, no hidden fees, no setup costs.
        </p>

        {/* Main pricing model card */}
        <div
          className="tilt-card glass-card"
          style={{ border: '1px solid rgba(34,211,238,0.25)', borderRadius: 24, padding: 'min(48px,5vw)', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}
        >
          <div className="tilt-inner">
            <div style={{ fontSize: 'clamp(3.5rem,8vw,5.5rem)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>
              <span className="gradient-num">10%</span>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '16px 0 24px', lineHeight: 1.6 }}>
              Flat agency fee. Nothing more.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 10px', fontWeight: 700 }}>Example calculation</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Your editing budget</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>$200 / video</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ExtoArts fee (10%)</span>
                  <span style={{ color: 'var(--warm)', fontWeight: 700 }}>-$20</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.96rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Your editor receives</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 900 }}>$180</span>
                </div>
              </div>
            </div>
            <DiscordButton
              className="btn btn-main"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <i className="ti ti-brand-discord" aria-hidden="true" /> Get a Custom Quote
            </DiscordButton>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 12 }}>
              No commitment until you approve the quote. Custom pricing for every project.
            </p>
          </div>
        </div>
      </section>

      {/* Market comparison */}
      <section style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionHeader
          label="Market Context"
          title={<>What Does YouTube Editing <span className="sweep-text">Actually Cost?</span></>}
          subtitle="How ExtoArts compares to freelancers and traditional agencies in 2026."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {COST_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card sr${tier.featured ? ' tilt-card' : ''}`}
              style={{
                border: tier.featured ? '1px solid rgba(34,211,238,0.28)' : '1px solid var(--border)',
                borderRadius: 20,
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              {tier.featured && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#000', fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                  ExtoArts Range
                </span>
              )}
              <div className={tier.featured ? 'tilt-inner' : undefined}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>{tier.name}</h3>
                <div style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, color: tier.featured ? 'var(--primary)' : 'var(--text-main)', letterSpacing: '-1px', marginBottom: 8 }}>{tier.range}</div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>{tier.who}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{tier.includes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Retainer packages */}
      <section style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionHeader
          label="Monthly Packages"
          title={<>Retainer Packages for <span className="sweep-text">Regular Creators.</span></>}
          subtitle="Lock in priority queue placement and a dedicated editor for consistent monthly volume."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
          {RETAINER_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`price-card${pkg.featured ? ' featured tilt-card' : ' glass-card'} sr`}
              style={{ padding: 'min(36px,4vw)', position: 'relative' }}
            >
              {pkg.featured && (
                <div aria-hidden="true" className="ea-card-ring ea-ring-always" />
              )}
              <div className={pkg.featured ? 'tilt-inner' : undefined}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>{pkg.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>{pkg.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <i className="ti ti-check" aria-hidden="true" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <DiscordButton
                  className={`btn ${pkg.featured ? 'btn-main' : 'btn-glass'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {pkg.cta}
                </DiscordButton>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 24 }}>
          All retainer packages are priced based on your video length, complexity, and monthly volume. <Link href="/estimate" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Use our estimator</Link> to get a ballpark figure.
        </p>
      </section>

      {/* Payment methods */}
      <section style={{ padding: '0 min(20px,5%) min(100px,10vw)', maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}>
          <span className="gradient-dot" aria-hidden="true" />
          Payment Methods
        </span>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px' }}>Pay How You&apos;re Comfortable</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
          We work with creators worldwide. That means accepting payments in formats that work globally.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['PayPal', 'UPI', 'Bank Transfer', 'USDT', 'BTC', 'ETH', 'EasyPaisa', 'Bkash', 'PKR'].map((m) => (
            <span key={m} style={{ padding: '7px 16px', border: '1px solid var(--border)', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}>
              {m}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 18 }}>50% deposit before work begins. Remaining balance due before final file delivery.</p>
      </section>

    </>
  )
}
