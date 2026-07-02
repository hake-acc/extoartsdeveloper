import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard | ExtoArts',
  description: 'Your ExtoArts client portal dashboard. Track orders, manage projects, and communicate with your editing team.',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return (
    <section style={{ padding: 'min(16vh,130px) min(20px,5%) min(100px,10vw)', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text-main)', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Manage your projects and track orders</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href="https://discord.gg/extoarts-1402333030827425922"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5865f2', color: '#fff', padding: '10px 20px', borderRadius: 14, fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none' }}
          >
            <i className="ti ti-brand-discord" aria-hidden="true" /> Open Discord
          </a>
          <Link href="/logout" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '10px 20px', borderRadius: 14, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', background: 'transparent' }}>
            <i className="ti ti-logout" aria-hidden="true" /> Sign Out
          </Link>
        </div>
      </div>

      {/* Empty state / onboarding */}
      <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 22, padding: 'min(52px,5vw)', textAlign: 'center' }}>
        <div className="tilt-inner">
          <i className="ti ti-brand-discord" aria-hidden="true" style={{ fontSize: '3rem', color: '#5865f2', marginBottom: 20, display: 'block', filter: 'drop-shadow(0 0 20px rgba(88,101,242,0.35))' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 12, letterSpacing: '-0.5px' }}>
            Ready to Start Your Project?
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
            ExtoArts projects are managed through our Discord server. Join, open a private ticket, and get a custom quote within hours.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://discord.gg/extoarts-1402333030827425922"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5865f2', color: '#fff', padding: '13px 28px', borderRadius: 16, fontSize: '0.88rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 24px rgba(88,101,242,0.28)' }}
            >
              <i className="ti ti-brand-discord" aria-hidden="true" /> Start a Project on Discord
            </a>
            <Link href="/ticket" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '13px 28px', borderRadius: 16, fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', background: 'transparent' }}>
              <i className="ti ti-ticket" aria-hidden="true" /> Submit Support Ticket
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, textAlign: 'left' }}>
            {[
              { icon: 'ti-percentage', title: 'View Pricing', href: '/pricing', desc: 'Flat 10% agency fee' },
              { icon: 'ti-photo', title: 'Portfolio', href: '/portfolio', desc: 'See our work' },
              { icon: 'ti-route', title: 'Our Workflow', href: '/workflow', desc: '8-step process' },
              { icon: 'ti-help-circle', title: 'FAQ', href: '/faq', desc: 'Common questions' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', border: '1px solid var(--border)', borderRadius: 16, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.2s, background 0.2s' }}
                className="dashboard-link"
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${item.icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '1rem' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-link:hover { border-color: rgba(34,211,238,0.22) !important; background: rgba(34,211,238,0.04) !important; }
      `}</style>
    </section>
  )
}
