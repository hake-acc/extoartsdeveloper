import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { FAQAccordion } from '@/components/ui/Accordion'
import { FAQ_SECTIONS } from '@/data/faq'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing FAQ - ExtoArts Questions Answered',
  description: 'Complete FAQ for ExtoArts YouTube video editing agency. Pricing, turnaround, process, revisions, gaming editing, faceless channels, and getting started.',
  path: '/faq',
})

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap(s =>
    s.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
}

export default function FAQPage() {
  const total = FAQ_SECTIONS.reduce((acc, s) => acc + s.items.length, 0)

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section
        style={{
          padding: 'min(20vh,160px) min(20px,5%) min(56px,5vw)',
          textAlign: 'center',
          maxWidth: 720,
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}>
          <span className="gradient-dot" aria-hidden="true" />
          {total} Questions Answered
        </span>
        <h1
          style={{
            fontSize: 'clamp(2.6rem,7vw,5rem)',
            fontWeight: 900,
            letterSpacing: '-2.5px',
            lineHeight: 1.0,
            marginBottom: 20,
            color: 'var(--text-main)',
          }}
          className="font-hero"
        >
          Frequently Asked<br />
          <span className="sweep-text">Questions.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.12rem)', color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
          Everything you need to know about working with ExtoArts - from first contact to final delivery.
        </p>
      </section>

      {/* FAQ Sections */}
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 min(20px,5%) min(100px,10vw)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {FAQ_SECTIONS.map((section) => (
          <div key={section.section} style={{ marginBottom: 56 }}>
            {/* Section heading */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                paddingBottom: 14,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                className="icon-box"
                style={{ width: 32, height: 32, borderRadius: 9, fontSize: '0.85rem' }}
                aria-hidden="true"
              >
                <i className={`ti ${section.icon}`} />
              </div>
              <h2
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  color: 'var(--primary)',
                  margin: 0,
                }}
              >
                {section.section}
              </h2>
            </div>

            {/* Radix accordion */}
            <FAQAccordion items={section.items} />
          </div>
        ))}

        {/* Still have questions CTA */}
        <div
          className="tilt-card glass-card"
          style={{
            border: '1px solid rgba(105,221,255,0.18)',
            borderRadius: 24,
            padding: 'min(44px,5vw)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="ea-card-ring ea-ring-always" aria-hidden="true" />
          <div className="tilt-inner">
            <div
              className="icon-box"
              style={{ width: 52, height: 52, borderRadius: 15, fontSize: '1.3rem', margin: '0 auto 18px' }}
              aria-hidden="true"
            >
              <i className="ti ti-help-circle" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 10, letterSpacing: '-0.3px' }}>
              Still have questions?
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 28px' }}>
              Join our Discord server and ask directly. A team lead will answer personally within hours.
            </p>
            <a
              href="https://discord.gg/extoarts-1402333030827425922"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#5865f2',
                color: '#fff',
                padding: '12px 26px',
                borderRadius: 14,
                fontSize: '0.84rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(88,101,242,0.3)',
                transition: 'box-shadow 0.25s, transform 0.25s',
              }}
            >
              <i className="ti ti-brand-discord" aria-hidden="true" />
              Ask on Discord
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
