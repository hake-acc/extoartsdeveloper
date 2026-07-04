import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { DiscordButton } from '@/components/ui/DiscordButton'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing Services - Thumbnails & Shorts | ExtoArts',
  description: 'High-retention YouTube editing, viral thumbnail design, TikTok Shorts editing, and channel automation. Specialist editors matched to your niche and style.',
  path: '/services',
})

const SERVICES = [
  {
    id: 'youtube-editing',
    icon: 'ti-brand-youtube',
    num: '01',
    title: 'High-Retention YouTube Video Editing',
    desc: 'Every cut is purposeful. Every transition is intentional. Our YouTube video editors focus on three things: hook optimization (first 30 seconds), pacing that keeps viewers watching, and chapter structure that boosts rewatch. We analyze your niche benchmarks, your competitors\' retention graphs, and your audience demographics before touching your footage.',
    features: ['Hook engineering for first 30 seconds', 'Pacing analysis against niche benchmarks', 'B-roll sourcing and integration', 'Color grading and audio correction', 'End screen and card optimization', 'Retention analytics post-delivery'],
    turnaround: '3-5 business days',
    badge: 'Most Popular',
  },
  {
    id: 'thumbnail-design',
    icon: 'ti-photo',
    num: '02',
    title: 'Viral YouTube Thumbnail Design',
    desc: 'A thumbnail is a billboard competing against thousands of others in a 400x225px space. Our thumbnail designers use composition theory, color psychology, and emotion-driven facial expressions to maximize CTR. Every thumbnail we produce is tested against your channel\'s existing CTR benchmarks.',
    features: ['CTR-optimized composition', 'A/B test ready variants', 'Face expression coaching for reaction shots', '3D text and lighting effects', 'Niche-consistent style guide', '24-hour turnaround'],
    turnaround: '24-48 hours',
    badge: 'Fast Delivery',
  },
  {
    id: 'shorts-editing',
    icon: 'ti-device-mobile-vibration',
    num: '03',
    title: 'TikTok & YouTube Shorts Editing',
    desc: 'Short-form is a completely different craft from long-form YouTube. The hook must land in 1-2 seconds. The pacing must be relentless. The captions must be scroll-stopping. Our short-form specialists don\'t edit YouTube videos on a 9:16 crop - they think natively in vertical.',
    features: ['1-3 second hook optimization', 'Vertical-first framing and composition', 'Trending audio integration', 'Caption style and timing', 'Pattern interrupt techniques', 'Platform-specific optimization (TikTok vs Shorts)'],
    turnaround: '1-2 business days',
    badge: 'TikTok & Shorts',
  },
  {
    id: 'gaming',
    icon: 'ti-device-gamepad-2',
    num: '04',
    title: 'Gaming Video Editing',
    desc: 'Gaming content has a specific language. The highlight timing, the commentary sync, the reaction cuts - generalist editors get it wrong. Our gaming editors play the games. They know when a Roblox kill is clutch, when a Minecraft build is impressive, and exactly when to cut for maximum reaction.',
    features: ['Niche specialists: Roblox, Minecraft, PUBG, Free Fire, Fortnite', 'Highlight reel optimization', 'Kill cam and clutch moment emphasis', 'Commentary-synced cuts', 'Gaming-specific motion graphics', '3D character thumbnail design'],
    turnaround: '3-5 business days',
    badge: 'Gaming Specialists',
  },
  {
    id: 'motion-graphics',
    icon: 'ti-sparkles',
    num: '05',
    title: 'Custom Motion Graphics & VFX',
    desc: 'Channel intros, lower thirds, outro animations, custom transitions, and After Effects VFX sequences. Our motion designers create elements that become part of your channel\'s visual identity - not generic templates from a library.',
    features: ['Channel intro/outro animations', 'Custom lower thirds and titles', 'After Effects compositing', 'Logo animation', 'Scene transition packages', 'Subscription reminder animations'],
    turnaround: '5-7 business days',
    badge: 'After Effects',
  },
  {
    id: 'faceless',
    icon: 'ti-eye-off',
    num: '06',
    title: 'Faceless YouTube Channel Automation',
    desc: 'You don\'t need to appear on camera to run a profitable YouTube channel. We handle the entire production pipeline - from script to published video. This is a full managed service for investors and entrepreneurs who want a YouTube channel as a business asset.',
    features: ['Script writing and topic research', 'AI voiceover or human voiceover integration', 'Full video production and editing', 'Custom thumbnail design', 'YouTube SEO and title optimization', 'Upload scheduling and metadata management'],
    turnaround: '7-14 days per video',
    badge: 'Full Automation',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What YouTube video editing services does ExtoArts offer?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts offers high-retention YouTube video editing, viral thumbnail design, TikTok and YouTube Shorts editing, custom motion graphics and VFX, specialist gaming video editing, and full done-for-you faceless YouTube channel automation.' } },
    { '@type': 'Question', name: 'How does ExtoArts match video editors to creators?', acceptedAnswer: { '@type': 'Answer', text: 'ExtoArts assigns editors based on niche expertise, not availability. A gaming creator gets a specialist gaming editor with a proven portfolio in Roblox, Minecraft, or PUBG content.' } },
    { '@type': 'Question', name: 'What is the turnaround time for YouTube video editing?', acceptedAnswer: { '@type': 'Answer', text: 'Standard turnaround for YouTube video editing through ExtoArts is 3-5 business days for most projects. Rush delivery (24-48 hours) is available. Retainer clients receive priority scheduling.' } },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <p className="sr-only">ExtoArts YouTube Video Editing Services</p>

      {/* Page hero */}
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Six Core Services
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Every Service.<br /><span className="sweep-text">Built for YouTube.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.72 }}>
          Specialist editors matched to your niche. From gaming thumbnails to full channel automation - we cover the complete YouTube production pipeline.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <DiscordButton className="btn btn-main">
            <i className="ti ti-brand-discord" aria-hidden="true" /> Get a Quote on Discord
          </DiscordButton>
          <Link href="/pricing" className="btn btn-glass">
            <i className="ti ti-percentage" aria-hidden="true" /> View Pricing
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px min(20px,5%)', display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60, background: 'rgba(255,255,255,0.02)' }}>
        {[['10%', 'Flat Agency Fee'], ['90%', 'Goes to Your Editor'], ['3-5 Days', 'Standard Turnaround'], ['5.0', 'Average Rating']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600, letterSpacing: '0.3px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Services list */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative', zIndex: 10 }}>
        {SERVICES.map((svc, i) => (
          <article
            key={svc.id}
            id={svc.id}
            className="tilt-card glass-card sr"
            style={{ border: '1px solid var(--border)', borderRadius: 24, padding: 'min(48px,5vw)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}
          >
            <div className="tilt-inner">
              {svc.badge && (
                <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.18)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 20 }}>
                  {svc.badge}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div className="service-icon" style={{ width: 58, height: 58, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${svc.icon}`} aria-hidden="true" style={{ fontSize: '1.6rem' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>SVC-{svc.num}</span>
                  <h2 style={{ fontSize: 'clamp(1.2rem,2.5vw,1.65rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{svc.title}</h2>
                </div>
              </div>
              <p style={{ fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 28 }}>{svc.desc}</p>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px 16px', padding: 0, listStyle: 'none', marginBottom: 24 }}>
                {svc.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <i className="ti ti-check" aria-hidden="true" style={{ color: 'var(--primary)', flexShrink: 0, fontSize: '0.9rem' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--primary)' }} />
                  Turnaround: <strong style={{ color: 'var(--text-main)' }}>{svc.turnaround}</strong>
                </span>
                <DiscordButton className="btn btn-glass" style={{ fontSize: '0.78rem', padding: '10px 20px' }}>
                  Get a Quote <i className="ti ti-arrow-right" aria-hidden="true" />
                </DiscordButton>
              </div>
            </div>
            <div style={{ color: 'var(--primary)', opacity: 0.06, fontWeight: 900, fontSize: 'clamp(3rem,6vw,5rem)', letterSpacing: '-4px', lineHeight: 1, flexShrink: 0, userSelect: 'none' }} aria-hidden="true">
              {svc.num}
            </div>
          </article>
        ))}
      </div>

    </>
  )
}
