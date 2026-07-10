import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { FOUNDER_PHOTO, DISCORD_URL, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'About ExtoArts - YouTube Creative Agency Founded by Rehan',
  description: 'ExtoArts was founded in 2024 by Rehan with one principle: 90% of your editing budget goes to the editor. Learn about our team, values, and mission.',
  path: '/about',
})

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/about#rehan`,
  name: 'Rehan',
  alternateName: 'RehanSigma',
  jobTitle: 'Founder & Creative Director',
  description: 'Rehan is the founder and creative director of ExtoArts, a YouTube video editing agency. He established ExtoArts in 2024 with the mission to make premium video editing accessible to creators at all stages.',
  url: `${SITE_URL}/about`,
  image: FOUNDER_PHOTO,
  sameAs: ['https://x.com/extoarts', 'https://www.instagram.com/extoarts', 'https://youtube.com/@extoarts'],
  worksFor: { '@id': `${SITE_URL}/#organization` },
  knowsAbout: ['YouTube Video Editing', 'Thumbnail Design', 'Content Strategy', 'Video Production', 'Channel Growth'],
}

const FAQ_ITEMS = [
  { q: 'What does "ExtoArts" mean as a brand name?', a: 'ExtoArts is a coined brand name built from the idea of extending creative arts — video editing, thumbnail design, and channel strategy built to outperform what the average agency delivers. Founder Rehan chose it to reflect a direct principle: make high-quality YouTube production accessible to creators at fair prices, with editors who demonstrate that in their work.' },
  { q: 'When was ExtoArts founded?', a: 'ExtoArts was founded in 2024 by Rehan with the goal of creating a fair-compensation video editing agency where editors receive 90% of the client budget.' },
  { q: 'Where is ExtoArts based?', a: 'ExtoArts operates fully remotely with editors working across different time zones, allowing us to serve creators worldwide with fast turnaround times.' },
  { q: 'Is ExtoArts a legitimate agency?', a: 'Yes. ExtoArts is a real creative agency with verified client reviews on Discord. All reviews shown on our website are from real projects completed for actual YouTube creators.' },
  { q: 'Does ExtoArts work with small creators?', a: "Absolutely. We work with creators at every stage - from channels with 0 subscribers who want to start professionally, to established channels with 500K+ subscribers looking for reliable editing partners." },
  { q: 'How do I contact Rehan directly?', a: 'The best way to reach Rehan is through the ExtoArts Discord server. Join the server and open a ticket - Rehan or a team lead will respond personally within hours.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={faqSchema} />
      <p className="sr-only">About ExtoArts - YouTube Creative Agency</p>

      {/* Hero */}
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Founded 2024
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Built by Creators,<br /><span className="sweep-text">for Creators.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.72 }}>
          ExtoArts is a YouTube-focused creative agency where 90% of your editing budget goes directly to the specialist assigned to your project.
        </p>
      </section>

      {/* Founder spotlight */}
      <section aria-labelledby="founder-about-heading" style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden' }}>
          <div className="tilt-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480 }}>
            {/* Photo side */}
            <div style={{ position: 'relative', minHeight: 400 }}>
              <Image
                src={FOUNDER_PHOTO}
                alt="Rehan - ExtoArts Founder & Creative Director"
                fill
                sizes="(max-width: 820px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, var(--surface) 100%)' }} aria-hidden="true" />
            </div>
            {/* Text side */}
            <div style={{ padding: 'min(52px,5vw)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Founder
              </span>
              <h2 id="founder-about-heading" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 8, color: 'var(--text-main)' }}>
                Rehan
              </h2>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>
                Founder & Creative Director
              </p>
              <blockquote style={{ borderLeft: '2px solid var(--primary)', paddingLeft: 18, margin: '0 0 24px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.7 }}>
                &ldquo;The best editors deserve the most money. That&apos;s why we take 10%, not 40%.&rdquo;
              </blockquote>
              <blockquote style={{ borderLeft: '2px solid rgba(34,211,238,0.3)', paddingLeft: 18, margin: '0 0 20px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.7 }}>
                &ldquo;I built ExtoArts because I watched creators overpay for mediocre work, over and over again. Good editing shouldn&apos;t cost 40% of your budget in agency fees - that math has never made sense.&rdquo;
              </blockquote>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 24 }}>
                Rehan is the founder and creative director of ExtoArts, a global YouTube video editing agency launched in 2024. He co-founded ExtoArts with five specialist editors (RevenantX, Subh, Hake, Leo, and RAGE) to solve a specific problem: creators couldn&apos;t afford agencies with 30-50% fees, and freelancers lacked the QC infrastructure agencies provide. The 10% model was built as the practical solution.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#5865f2', textDecoration: 'none', padding: '9px 16px', border: '1px solid rgba(88,101,242,0.25)', borderRadius: 12, background: 'rgba(88,101,242,0.06)', fontWeight: 700 }}>
                  <i className="ti ti-brand-discord" aria-hidden="true" /> Discord
                </a>
                <a href="https://x.com/extoarts" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', padding: '9px 16px', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 700, transition: 'color 0.2s' }}>
                  <i className="ti ti-brand-x" aria-hidden="true" /> @extoarts
                </a>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 700px) {
            section[aria-labelledby="founder-about-heading"] .tilt-inner {
              grid-template-columns: 1fr !important;
            }
            section[aria-labelledby="founder-about-heading"] .tilt-inner > div:first-child {
              min-height: 280px !important;
            }
            section[aria-labelledby="founder-about-heading"] .tilt-inner > div:first-child > div {
              background: linear-gradient(0deg, var(--surface) 20%, transparent 100%) !important;
            }
          }
        `}</style>
      </section>

      {/* The 10% Golden Rule */}
      <section aria-labelledby="golden-rule-heading" style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }} className="about-two-col">
          <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 24, padding: 'min(44px,4.5vw)' }}>
            <div className="tilt-inner">
              <h2 id="golden-rule-heading" style={{ fontSize: 'clamp(1.4rem,2.8vw,2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 16, color: 'var(--text-main)' }}>
                The 10% <span className="sweep-text">Golden Rule</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.78, marginBottom: 16 }}>
                Most agencies charge 30–50% commission on creator budgets (industry standard; varies by agency), leaving the actual editor underpaid and unmotivated. ExtoArts charges a flat 10%. <strong style={{ color: 'var(--text-main)' }}>90% of your money goes directly to the artist building your video.</strong>
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.78, margin: 0 }}>
                On a $500 edit, that means $450 to your editor versus $250–$350 at a typical agency. Better compensation produces better output — that relationship is consistent across every creative discipline.
              </p>
            </div>
          </div>
          <div className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 24, padding: 'min(44px,4.5vw)' }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: 'clamp(1.4rem,2.8vw,2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 16, color: 'var(--text-main)' }}>
                Vetted Before <span className="sweep-text">They Edit</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.78, marginBottom: 16 }}>
                Every editor on ExtoArts passes a review on actual project edits before being assigned client work. We evaluate pacing decisions, hook quality, audio mixing, and communication under a real brief - not just a portfolio link.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.78, margin: 0 }}>
                Only editors who clear the full review take on projects. No generalists, no shortcuts.
              </p>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .about-two-col { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* The 3-step process */}
      <section aria-labelledby="process-heading" style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <h2 id="process-heading" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', textAlign: 'center', marginBottom: 12, color: 'var(--text-main)' }}>
          How a Project <span className="sweep-text">Actually Works</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.72 }}>
          Every project runs through three stages inside a private Discord ticket. You always know where things stand without having to ask.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="process-grid">
          {[
            { num: '01', title: 'The Brief', desc: 'Join our Discord, open a private ticket, and share your footage, assets, and vision. We\'ll review it and clarify what we need before the edit starts.' },
            { num: '02', title: 'The Match', desc: 'We pair your project with the best-fit specialist. A storyteller for vlogs, a high-energy editor for gaming, a punchy artist for shorts. No one-size-fits-all.' },
            { num: '03', title: 'The Polish', desc: 'We deliver the first draft, you give feedback, we refine. This keeps going until it\'s exactly what you had in mind, and ready to post.' },
          ].map((step) => (
            <div key={step.num} className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div className="tilt-inner">
                <div style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'var(--primary)', opacity: 0.15, letterSpacing: '-2px', lineHeight: 1, marginBottom: 12 }} aria-hidden="true">{step.num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 700px) { .process-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <h2 id="values-heading" className="sr-only">ExtoArts Core Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { icon: 'ti-percentage', color: '#69ddff', title: 'Fair Compensation', desc: 'Editors get 90%. Always. No exceptions, no negotiations, no creative accounting.' },
            { icon: 'ti-target', color: '#7c3aed', title: 'Niche Expertise', desc: 'Gaming editors edit gaming. Education editors edit education. No generalists pretending to specialize.' },
            { icon: 'ti-shield-check', color: '#10b981', title: 'Full Transparency', desc: 'Custom quotes are itemized. You know what you\'re paying for before you commit to anything.' },
            { icon: 'ti-clock', color: '#f59e0b', title: 'Deadline Accountability', desc: 'If we miss a deadline without valid reason, the project is on us. That\'s our accountability standard.' },
          ].map((v) => (
            <div key={v.title} className="tilt-card glass-card sr" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div className="tilt-inner">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${v.color}14`, border: `1px solid ${v.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <i className={`ti ${v.icon}`} aria-hidden="true" style={{ color: v.color, fontSize: '1.25rem' }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10, letterSpacing: '-0.2px' }}>{v.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="about-faq-heading" style={{ padding: '0 min(20px,5%) min(100px,10vw)', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <h2 id="about-faq-heading" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', textAlign: 'center', marginBottom: 40, color: 'var(--text-main)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="faq-item" style={{ padding: '22px 26px' }}>
              <summary style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-main)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                {item.q}
                <i className="ti ti-chevron-down" aria-hidden="true" style={{ color: 'var(--primary)', flexShrink: 0, transition: 'transform 0.2s', fontSize: '0.9rem' }} />
              </summary>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: '14px 0 0', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Link href="/faq" className="btn btn-glass">
            <i className="ti ti-help-circle" aria-hidden="true" /> Full FAQ
          </Link>
        </div>
      </section>
    </>
  )
}
