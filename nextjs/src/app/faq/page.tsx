import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { FAQAccordion } from '@/components/ui/Accordion'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing FAQ - ExtoArts Questions Answered',
  description: 'Complete FAQ for ExtoArts YouTube video editing agency. Pricing, turnaround, process, revisions, gaming editing, faceless channels, and getting started.',
  path: '/faq',
})

const FAQ_SECTIONS = [
  {
    section: 'Getting Started',
    icon: 'ti-rocket',
    items: [
      { q: 'How do I get started with ExtoArts?', a: 'Join our Discord server at discord.gg/extoarts and open a private support ticket. Tell us your niche, editing style, upload frequency, and budget. A team lead will reply within hours with editor recommendations and a custom quote.' },
      { q: 'Do I need to sign a contract?', a: 'No long-term contracts required. We work project-by-project unless you choose a monthly retainer plan. A simple order confirmation is exchanged for each project, but there are no minimum commitments.' },
      { q: 'Can I request a trial edit?', a: 'Yes. We can do a short trial edit (usually 1-2 minutes of your footage) so you can see the editing quality before committing to a full project. Trial edits are priced at our standard rate.' },
      { q: 'What information do you need to get started?', a: 'We need: (1) your YouTube channel link or niche description, (2) style references (channels you want to sound/look like), (3) raw footage or brief, (4) your editing budget, and (5) your upload schedule and deadlines.' },
    ],
  },
  {
    section: 'Pricing & Payments',
    icon: 'ti-credit-card',
    items: [
      { q: 'How does the 10% fee model work?', a: 'You tell us your editing budget per video. ExtoArts takes 10% as the agency management fee. The remaining 90% goes directly to your assigned specialist editor. If your budget is $300, ExtoArts takes $30, and your editor receives $270.' },
      { q: 'Are there any hidden fees?', a: 'No. The quote we send you is the final price. No setup fees, no account management fees, no surprise charges. If a project needs add-ons (extra motion graphics, licensed music, etc.), these are quoted separately before any work begins.' },
      { q: 'What payment methods do you accept?', a: 'PayPal, bank transfer, USDT, BTC, ETH, UPI (India), EasyPaisa (Pakistan), Bkash (Bangladesh), and PKR transfer. Most projects require a 50% deposit before work begins, with the remaining 50% due before final delivery.' },
      { q: 'Do you offer refunds?', a: 'If we fail to deliver a completed project, you receive a full refund. If you cancel mid-project after work has begun, a partial refund is issued based on work completed. Final approved files are non-refundable as the work has been delivered and accepted.' },
    ],
  },
  {
    section: 'Services & Turnaround',
    icon: 'ti-clock',
    items: [
      { q: 'How long does a standard YouTube video edit take?', a: 'Standard turnaround is 3-5 business days for most YouTube videos (10-20 minutes). Shorter videos or simpler projects may be delivered faster. Rush delivery (24-48 hours) is available for an additional fee.' },
      { q: 'How long does thumbnail design take?', a: 'Custom thumbnail design is delivered in 24-48 hours. This includes 1-2 revision rounds. Urgent thumbnails (same-day) are available with a rush fee depending on team availability.' },
      { q: 'Do you handle faceless YouTube channels?', a: 'Yes. We offer complete done-for-you faceless channel production: script writing, voiceover integration (AI or human), full video editing, thumbnail design, upload scheduling, and YouTube SEO. Pricing is quoted per project based on video length and complexity.' },
      { q: 'Can you match a specific editing style?', a: 'Absolutely. When you onboard, we ask for 3-5 reference channels or video examples that match the style you want. Our editors study these references and replicate the pacing, transitions, color grade, and graphics style for your content.' },
    ],
  },
  {
    section: 'Revisions & Quality',
    icon: 'ti-adjustments',
    items: [
      { q: 'How many revisions are included?', a: 'Standard projects include 2 revision rounds. Retainer clients on Creator or Agency plans receive unlimited revisions. Revisions must be requested within 7 days of delivery.' },
      { q: 'What if I am not satisfied with the edit?', a: 'Request a revision. Provide specific, clear feedback and we will re-edit until it meets your expectations. We do not accept vague feedback like "make it better" - specific feedback (timestamps, exact changes) leads to the best results.' },
      { q: 'Do you use AI for editing?', a: 'No. All editing is performed by human specialist editors. We do not use AI-generated footage, AI voiceovers (unless you request them), or automated editing tools. Every edit is handcrafted for your specific content.' },
      { q: 'How do you ensure quality consistency?', a: 'Each project is assigned to one dedicated editor who learns your channel style over time. For retainer clients, we maintain a style guide document with your channel-specific preferences, fonts, colors, music taste, and editing patterns.' },
    ],
  },
]

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
