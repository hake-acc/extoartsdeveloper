import type { Metadata } from 'next'
import Image from 'next/image'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { InkThemeScope } from '@/components/faq/InkThemeScope'
import { InkFaqBar } from '@/components/faq/InkFaqBar'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing FAQ - ExtoArts Questions Answered',
  description: 'Complete FAQ for ExtoArts YouTube video editing agency. Pricing, turnaround, process, revisions, gaming editing, faceless channels, and getting started.',
  path: '/faq',
})

const FAQ_SECTIONS = [
  {
    section: 'Getting Started',
    items: [
      { q: 'How do I get started with ExtoArts?', a: 'Join our Discord server at discord.gg/extoarts and open a private support ticket. Tell us your niche, editing style, upload frequency, and budget. A team lead will reply within hours with editor recommendations and a custom quote.' },
      { q: 'Do I need to sign a contract?', a: 'No long-term contracts required. We work project-by-project unless you choose a monthly retainer plan. A simple order confirmation is exchanged for each project, but there are no minimum commitments.' },
      { q: 'Can I request a trial edit?', a: 'Yes. We can do a short trial edit (usually 1-2 minutes of your footage) so you can see the editing quality before committing to a full project. Trial edits are priced at our standard rate.' },
      { q: 'What information do you need to get started?', a: 'We need: (1) your YouTube channel link or niche description, (2) style references (channels you want to sound/look like), (3) raw footage or brief, (4) your editing budget, and (5) your upload schedule and deadlines.' },
    ],
  },
  {
    section: 'Pricing & Payments',
    items: [
      { q: 'How does the 10% fee model work?', a: 'You tell us your editing budget per video. ExtoArts takes 10% as the agency management fee. The remaining 90% goes directly to your assigned specialist editor. If your budget is $300, ExtoArts takes $30, and your editor receives $270.' },
      { q: 'Are there any hidden fees?', a: 'No. The quote we send you is the final price. No setup fees, no account management fees, no surprise charges. If a project needs add-ons (extra motion graphics, licensed music, etc.), these are quoted separately before any work begins.' },
      { q: 'What payment methods do you accept?', a: 'PayPal, bank transfer, USDT, BTC, ETH, UPI (India), EasyPaisa (Pakistan), Bkash (Bangladesh), and PKR transfer. Most projects require a 50% deposit before work begins, with the remaining 50% due before final delivery.' },
      { q: 'Do you offer refunds?', a: 'If we fail to deliver a completed project, you receive a full refund. If you cancel mid-project after work has begun, a partial refund is issued based on work completed. Final approved files are non-refundable as the work has been delivered and accepted.' },
    ],
  },
  {
    section: 'Services & Turnaround',
    items: [
      { q: 'How long does a standard YouTube video edit take?', a: 'Standard turnaround is 3-5 business days for most YouTube videos (10-20 minutes). Shorter videos or simpler projects may be delivered faster. Rush delivery (24-48 hours) is available for an additional fee.' },
      { q: 'How long does thumbnail design take?', a: 'Custom thumbnail design is delivered in 24-48 hours. This includes 1-2 revision rounds. Urgent thumbnails (same-day) are available with a rush fee depending on team availability.' },
      { q: 'Do you handle faceless YouTube channels?', a: 'Yes. We offer complete done-for-you faceless channel production: script writing, voiceover integration (AI or human), full video editing, thumbnail design, upload scheduling, and YouTube SEO. Pricing is quoted per project based on video length and complexity.' },
      { q: 'Can you match a specific editing style?', a: 'Absolutely. When you onboard, we ask for 3-5 reference channels or video examples that match the style you want. Our editors study these references and replicate the pacing, transitions, color grade, and graphics style for your content.' },
    ],
  },
  {
    section: 'Revisions & Quality',
    items: [
      { q: 'How many revisions are included?', a: 'Standard projects include 2 revision rounds. Retainer clients on Creator or Agency plans receive unlimited revisions. Revisions must be requested within 7 days of delivery.' },
      { q: 'What if I am not satisfied with the edit?', a: 'Request a revision. Provide specific, clear feedback and we will re-edit until it meets your expectations. We do not accept vague feedback like "make it better" - specific feedback (timestamps, exact changes) leads to the best results.' },
      { q: 'Do you use AI for editing?', a: 'No. All editing is performed by human specialist editors. We do not use AI-generated footage, AI voiceovers (unless you request them), or automated editing tools. Every edit is handcrafted for your specific content.' },
      { q: 'How do you ensure quality consistency?', a: 'Each project is assigned to one dedicated editor who learns your channel style over time. For retainer clients, we maintain a style guide document with your channel-specific preferences, fonts, colors, music taste, and editing patterns.' },
    ],
  },
]

const SERVICES = [
  { icon: 'ti-clapperboard', title: 'YouTube Video Editing', desc: 'High-retention edits that keep viewers watching till the end.', href: '/services#youtube-editing' },
  { icon: 'ti-brush', title: 'Thumbnail Design', desc: 'Scroll-stopping thumbnails that boost CTR and views.', href: '/services#thumbnail-design' },
  { icon: 'ti-brand-youtube', title: 'YouTube Shorts', desc: 'Viral short-form edits built for maximum reach.', href: '/services#shorts-editing' },
  { icon: 'ti-settings-automation', title: 'Channel Automation', desc: 'We handle your content engine so you can focus on growth.', href: '/services#faceless' },
]

const PROCESS = [
  { num: '01', title: 'Share Your Vision', desc: 'Tell us about your channel, goals, and style.' },
  { num: '02', title: 'We Plan & Edit', desc: 'Our editors craft high-quality content tailored for you.' },
  { num: '03', title: 'Review & Refine', desc: 'You review, give feedback, we refine.' },
  { num: '04', title: 'Delivered & Optimized', desc: 'Final delivery, optimized for growth.' },
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
    <div className="ink-page">
      <InkThemeScope />
      <JsonLd data={faqSchema} />
      <div className="ink-paper-texture" aria-hidden="true" />

      {/* Hero */}
      <section
        style={{
          padding: 'min(20vh,160px) min(20px,5%) min(56px,5vw)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            alignItems: 'center',
          }}
          className="ink-hero-grid"
        >
          <div>
            <span className="ink-pill-label" style={{ marginBottom: 22 }}>FAQ Center</span>
            <h1
              className="font-hero"
              style={{
                fontSize: 'clamp(2.6rem,6vw,4.2rem)',
                fontWeight: 400,
                letterSpacing: '-1.5px',
                lineHeight: 1.05,
                margin: '18px 0 20px',
                color: 'var(--text-main)',
              }}
            >
              Answers to<br /><span className="ink-underline">Everything.</span>
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.75, marginBottom: 30 }}>
              Everything you need to know about working with ExtoArts - from first contact to final delivery.
            </p>
            <a href="#faq-list" className="ink-btn-purple">
              Let&apos;s Clear Things Up
              <i className="ti ti-arrow-right" aria-hidden="true" />
            </a>
          </div>

          <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden' }}>
            <Image
              src="/images/faq-samurai-hero.png"
              alt="Ink-brush illustration of a samurai facing a mountain landscape beneath a painted circle"
              width={1024}
              height={683}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section
        id="faq-list"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px min(20px,5%) min(40px,5vw)',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', opacity: 0.7, marginBottom: 4 }}>
          {total} questions answered
        </p>
        {FAQ_SECTIONS.map((section) => (
          <InkFaqBar key={section.section} label={section.section} items={section.items} />
        ))}
      </section>

      {/* Services */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'min(70px,7vw) min(20px,5%)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span className="ink-pill-label" style={{ marginBottom: 18 }}>Our Services</span>
        <h2
          className="font-hero"
          style={{
            fontSize: 'clamp(1.9rem,4vw,2.7rem)',
            fontWeight: 400,
            letterSpacing: '-1px',
            lineHeight: 1.1,
            margin: '14px 0 36px',
            color: 'var(--text-main)',
          }}
        >
          Crafted for<br /><span className="ink-underline">Creators.</span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18,
          }}
          className="ink-services-grid"
        >
          {SERVICES.map((svc) => (
            <div key={svc.title} className="ink-card-black" style={{ padding: 26 }}>
              <div className="ink-service-card">
                <div className="ink-service-icon" aria-hidden="true">
                  <i className={`ti ${svc.icon}`} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f1ecfa', marginBottom: 8 }}>{svc.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#a99fc0', lineHeight: 1.65, margin: 0 }}>{svc.desc}</p>
                </div>
                <a
                  href={svc.href}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 800, color: '#a892e0', textDecoration: 'none', marginTop: 4 }}
                >
                  Explore
                  <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: '0.78rem' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 min(20px,5%) min(90px,8vw)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span className="ink-pill-label" style={{ marginBottom: 18 }}>Our Process</span>
        <h2
          className="font-hero"
          style={{
            fontSize: 'clamp(1.9rem,4vw,2.7rem)',
            fontWeight: 400,
            letterSpacing: '-1px',
            lineHeight: 1.1,
            margin: '14px 0 40px',
            color: 'var(--text-main)',
          }}
        >
          Simple. Clear.<br /><span className="ink-underline">Effective.</span>
        </h2>

        <div style={{ position: 'relative' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 26,
              left: 26,
              right: 26,
              height: 1,
              borderTop: '2px dashed rgba(20,16,10,0.2)',
              zIndex: 0,
            }}
            className="ink-process-line"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              position: 'relative',
              zIndex: 1,
            }}
            className="ink-process-grid"
          >
            {PROCESS.map((step) => (
              <div key={step.num} style={{ textAlign: 'left' }}>
                <div className="ink-process-circle" style={{ marginBottom: 18, background: 'var(--bg)' }}>{step.num}</div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 min(20px,5%) min(100px,9vw)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="ink-card-black" style={{ padding: 'min(48px,5vw)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f1ecfa', marginBottom: 10 }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#a99fc0', marginBottom: 26, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 26px' }}>
            Join our Discord server and ask directly. A team lead will answer personally within hours.
          </p>
          <a
            href="https://discord.gg/extoarts-1402333030827425922"
            target="_blank"
            rel="noopener noreferrer"
            className="ink-btn-purple"
          >
            <i className="ti ti-brand-discord" aria-hidden="true" />
            Ask on Discord
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .ink-hero-grid { grid-template-columns: 1fr !important; }
          .ink-services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .ink-process-grid { grid-template-columns: repeat(2,1fr) !important; }
          .ink-process-line { display: none !important; }
        }
        @media (max-width: 560px) {
          .ink-services-grid { grid-template-columns: 1fr !important; }
          .ink-process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
