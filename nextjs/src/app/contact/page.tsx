import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { DISCORD_URL, SITE_URL } from '@/lib/constants'
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail'

export const dynamic = 'force-static'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = buildMetadata({
  title: 'Contact ExtoArts - Start a Project via Discord',
  description: 'Contact ExtoArts via Discord to start your YouTube editing project. Get a custom quote within hours. No commitment until you approve.',
  path: '/contact',
})

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/contact`,
  name: 'Contact ExtoArts',
  url: `${SITE_URL}/contact`,
  description: 'Contact ExtoArts to start a YouTube video editing project. Get a niche-matched editor and a custom quote within hours via Discord.',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  mainEntity: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ExtoArts',
    url: SITE_URL,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: 'https://discord.gg/extoarts-1402333030827425922',
        availableLanguage: 'English',
        description: 'Primary contact channel. Open a private ticket to receive a custom quote within hours.',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'support@extoarts.in',
        availableLanguage: 'English',
        description: 'Email support for billing questions, project updates, and general inquiries.',
      },
    ],
  },
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <p className="sr-only">Contact ExtoArts</p>

      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(80px,7vw)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          We Reply Within Hours
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Get a Quote in<br /><span className="sweep-text">Hours, Not Days.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 16px', lineHeight: 1.72 }}>
          For YouTube creators looking for specialist editing, thumbnail design, or channel automation. Open a Discord ticket, share your brief, and we&apos;ll match you with the right editor — usually within 2-4 hours.
        </p>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 60px', lineHeight: 1.72, opacity: 0.8 }}>
          Every project brief is reviewed by a team lead personally. You receive a niche-matched editor with a portfolio of relevant work — not a random assignment. The quote is fully itemized before any commitment is made.
        </p>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
          {/* Discord */}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tilt-card glass-card"
            style={{ border: '1px solid rgba(88,101,242,0.25)', borderRadius: 24, padding: 36, textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s' }}
          >
            <div className="tilt-inner">
              <i className="ti ti-brand-discord" aria-hidden="true" style={{ fontSize: '2.5rem', color: '#5865f2', marginBottom: 16, display: 'block', filter: 'drop-shadow(0 0 16px rgba(88,101,242,0.4))' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Discord Server</h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>
                Fastest response. Open a private ticket and get a custom quote within hours. All briefs, revisions, and file deliveries happen in one organized channel.
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#5865f2', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 800 }}>
                <i className="ti ti-brand-discord" aria-hidden="true" /> Join Server
              </span>
            </div>
          </a>

          {/* Email */}
          <div
            className="tilt-card glass-card"
            style={{ border: '1px solid var(--border)', borderRadius: 24, padding: 36, display: 'block', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s' }}
          >
            <div className="tilt-inner">
              <i className="ti ti-mail" aria-hidden="true" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 16, display: 'block' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Email Support</h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>
                For billing questions, project updates, or general inquiries. Response time is typically within 24 hours on business days.
              </p>
              <ObfuscatedEmail user="support" domain="extoarts.in" style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)' }} />
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 'min(40px,4vw)', textAlign: 'left', marginBottom: 40 }}>
          <div className="tilt-inner">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 28, letterSpacing: '-0.3px', textAlign: 'center' }}>
              What Happens After You Message Us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { step: '01', title: 'Share Your Brief', desc: 'Tell us your niche, video length, style references, upload frequency, and budget. The more detail you provide, the faster we can match you with the right editor.' },
                { step: '02', title: 'Editor Matching', desc: 'We identify the specialist in our team who best fits your niche and style. Gaming channels get gaming editors. Education channels get storytelling specialists. You see their portfolio before committing.' },
                { step: '03', title: 'Custom Quote', desc: 'You receive a transparent, itemized quote within hours. Editing rate, agency fee (10%), turnaround, and revision rounds — all listed clearly. No surprise fees. No hidden costs.' },
                { step: '04', title: 'First Project', desc: 'Approve the quote, send your footage, and we begin. You get a first delivery with revision rounds included. Most projects close with 1-2 revision cycles before final export.' },
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '0.72rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                    {s.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{s.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Internal links */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/services" className="btn btn-glass">
            <i className="ti ti-list-details" aria-hidden="true" /> All Services
          </Link>
          <Link href="/pricing" className="btn btn-glass">
            <i className="ti ti-percentage" aria-hidden="true" /> Pricing Model
          </Link>
          <Link href="/workflow" className="btn btn-glass">
            <i className="ti ti-route" aria-hidden="true" /> How It Works
          </Link>
          <Link href="/faq" className="btn btn-glass">
            <i className="ti ti-help-circle" aria-hidden="true" /> FAQ
          </Link>
        </div>
      </section>
    </>
  )
}
