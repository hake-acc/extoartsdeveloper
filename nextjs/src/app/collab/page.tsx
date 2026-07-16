import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { DiscordButton } from '@/components/ui/DiscordButton'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'Brand Partnerships & Creative Collabs',
  description: 'Motion graphics, VFX, thumbnails, and video editing from ExtoArts. One-off creative work for brands and creators who want a high quality bar.',
  path: '/collab',
})

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/collab`,
  url: `${SITE_URL}/collab`,
  name: 'Brand Partnerships & Creative Collaborations | ExtoArts',
  description: 'Motion graphics, VFX, thumbnails, and video editing from ExtoArts. One-off creative work for brands and creators who want a high quality bar.',
  inLanguage: 'en-US',
  publisher: { '@id': `${SITE_URL}/#organization` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
}

const WHAT_WE_BUILD = [
  'Motion Graphics', 'VFX', 'Thumbnails', 'Video Editing',
  'Sound Design', 'Post-Production', '3D Design', 'Intro / Outro',
]

export default function CollabPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <p className="sr-only">Brand Partnerships &amp; Creative Collaborations | ExtoArts</p>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'min(20vh,180px) min(20px,5%) min(100px,10vw)', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 22, alignItems: 'center', gap: 8 }}>
            <span className="gradient-dot" aria-hidden="true" />
            Work With Us
          </span>
          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: 22, color: 'var(--text-main)' }}>
            Creative{' '}
            <span className="sweep-text">
              <span className="cycle-stack" aria-label="Partnerships.">
                <span className="cycle-phrase is-active">Partnerships.</span>
                <span className="cycle-phrase" aria-hidden="true">Collabs.</span>
                <span className="cycle-phrase" aria-hidden="true">Commissions.</span>
              </span>
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 620, margin: '0 auto', lineHeight: 1.72 }}>
            We don&apos;t take every brief. We take the ones where there&apos;s a clear vision, real scope, and room to do the work properly.
          </p>
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch' }}>
          {/* Left — How It Works */}
          <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 40, padding: 'min(50px,5vw) min(40px,4vw)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="tilt-inner">
              <div style={{ width: 70, height: 70, background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: 25, color: 'var(--primary)' }}>
                <i className="ti ti-send" aria-hidden="true" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 20, letterSpacing: '-1px', color: 'var(--text-main)' }}>How It Works</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 16 }}>
                Open a ticket in our Discord server with your brief. Include what you&apos;re building, visual references, and what success looks like for the finished deliverable. We review every brief the same day.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                If the project is the right fit, we&apos;ll quote it and give you a clear timeline. If it isn&apos;t, we&apos;ll say so directly — no ghosting, no polite deflection. That&apos;s the only way to keep the quality bar where it needs to be.
              </p>
            </div>
          </div>

          {/* Right — What We Build + Pricing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* What We Build */}
            <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 40, padding: 'min(50px,5vw) min(40px,4vw)' }}>
              <div className="tilt-inner">
                <div style={{ width: 70, height: 70, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: 25, color: 'var(--purple, #7c3aed)' }}>
                  <i className="ti ti-sparkles" aria-hidden="true" style={{ color: 'var(--purple, #7c3aed)' }} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px', color: 'var(--text-main)' }}>What We Build</h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.65 }}>
                  Every deliverable goes through an internal review before it leaves our hands. We don&apos;t hand off rough cuts and call them first passes.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {WHAT_WE_BUILD.map((tag) => (
                    <span key={tag} style={{ background: 'var(--bg, #09090b)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', color: 'var(--text-main)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 40, padding: 40 }}>
              <div className="tilt-inner">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  <i className="ti ti-receipt" aria-hidden="true" style={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                  Pricing
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.72, margin: 0 }}>
                  We quote based on what the work actually requires — not what the client hopes to spend. Most one-off collab projects land between{' '}
                  <strong style={{ color: 'var(--text-main)' }}>$80 and $800</strong> depending on scope and turnaround. We don&apos;t publish a rate card because creative scope varies too much to pre-price it honestly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Is this right for you */}
        <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 40, padding: 'min(50px,5vw) min(40px,4vw)', marginTop: 40 }}>
          <div className="tilt-inner">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: 20, color: 'var(--text-main)' }}>Is This Right For You?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 16 }}>
              Collab and commission work at ExtoArts is not the same as our standard creator services. For ongoing YouTube editing, thumbnail design, or channel automation, visit our <a href="/services" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>services page</a> and <a href="/pricing" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>pricing model</a>.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 16 }}>
              Collab projects are right for you if you have a specific one-off deliverable — a custom intro animation, a VFX sequence for a single video, a set of thumbnails for a new series, a channel rebrand, or a short-form content package outside of a regular editing retainer. These are scoped, quoted, and delivered as standalone projects.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 0 }}>
              We also work with brands and businesses that need video production, motion graphics, or creative assets for campaigns, product launches, and social media content — not just YouTube creators. The same quality standard applies regardless of the client type. If you are unsure whether your brief fits, send it anyway. We will tell you directly.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <DiscordButton className="galaxy-btn">
            <span className="gb-inner">
              <i className="ti ti-brand-discord" aria-hidden="true" /> Send a Brief
            </span>
          </DiscordButton>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .collab-grid-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
