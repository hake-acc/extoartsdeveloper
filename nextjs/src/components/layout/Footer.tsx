import Link from 'next/link'
import Image from 'next/image'
import { DISCORD_URL, PAYMENT_METHODS, SOCIAL_LINKS, SITE_URL } from '@/lib/constants'
import { DiscordButton } from '@/components/ui/DiscordButton'
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail'

const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Discord: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.015.043.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    YouTube: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    X: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    Threads: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.851 1.205 8.604.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.854-.455-1.503-.975-1.917-.612-.49-1.532-.739-2.735-.745l-.053.002c-.775 0-2.023.199-2.916 1.162l-1.486-1.359C5.58 7.293 7.27 6.82 9.11 6.82c.049 0 .098 0 .149.002 2.006.011 3.503.598 4.449 1.743.79.963 1.208 2.28 1.268 3.918.024 0 .046-.002.07-.002 1.07 0 1.945.245 2.703.739.747.487 1.274 1.176 1.56 2.04.34 1.02.338 2.176-.002 3.343-.34 1.163-1.006 2.21-1.93 3.024-1.78 1.574-4.077 2.38-6.62 2.38l-.571-.007zm.557-8.04c-.138 0-.277.005-.417.014-1.158.065-2.073.374-2.643.894-.444.393-.657.895-.628 1.452.033.607.36 1.115.917 1.476.553.36 1.28.538 2.089.493 1.179-.064 2.117-.529 2.765-1.345.526-.657.84-1.535.96-2.652a10.54 10.54 0 0 0-2.043-.332z"/>
      </svg>
    ),
    Instagram: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    Facebook: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    LinkedIn: (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, fill: 'currentColor', display: 'block' }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  }
  return <>{icons[platform] ?? null}</>
}

export function Footer() {
  return (
    <>
      {/* Pre-footer CTA */}
      <div className="prefooter-cta" style={{ padding: 'min(88px, 9vw) min(24px, 5%)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, margin: '0 auto' }}>
          <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 22 }}>
            <span className="gradient-dot" aria-hidden="true" />
            Start Today
          </span>
          <h2 className="sr" style={{
            fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            marginBottom: 14,
            color: 'var(--text-main)',
            lineHeight: 1.06,
          }}>
            Ready to level up<br />
            <span className="sweep-text">your channel?</span>
          </h2>
          <div className="page-hero-bg" style={{ margin: '0 auto 32px' }}>
            <p className="hero-subtitle sr" style={{ fontSize: '0.97rem', lineHeight: 1.7, margin: '0 0 16px' }}>
              Get a custom quote in hours. No commitment, no sales script.
              <br />Just real editors doing great work.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: 'ti-shield-check', text: 'No lock-in contracts' },
                { icon: 'ti-clock', text: '3-5 day turnaround' },
                { icon: 'ti-star', text: '5.0 rated on Discord' },
              ].map(({ icon, text }) => (
                <span key={text} className="hero-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                  <i className={`ti ${icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '0.82rem' }} />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="sr" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <DiscordButton className="galaxy-btn">
              <span className="gb-inner">
                <i className="ti ti-brand-discord" aria-hidden="true" /> Start a Project
              </span>
            </DiscordButton>
            <Link
              href="/portfolio"
              className="btn btn-glass"
              style={{ borderRadius: 999 }}
            >
              <i className="ti ti-arrow-right" aria-hidden="true" /> View Portfolio
            </Link>
          </div>
        </div>
      </div>


      <footer
        className="site-footer"
        aria-label="Site footer"
        style={{ viewTransitionName: 'site-footer' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '44px 36px',
            padding: 'min(60px, 6vw) min(36px, 5%)',
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/extoarts-logo.png" width={38} height={38} className="logo-mark" alt="ExtoArts YouTube video editing agency logo" style={{ borderRadius: 9 }} />
              <span style={{ fontWeight: 900, fontSize: '1.08rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>ExtoArts</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 240, marginBottom: 22 }}>
              YouTube-focused creative agency run by real editors. Video editing, thumbnail design, short-form content, and full channel automation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.platform}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    transition: 'color 0.22s, border-color 0.22s, background 0.22s, transform 0.22s',
                    textDecoration: 'none',
                  }}
                  className="footer-social-icon"
                >
                  <SocialIcon platform={s.platform} />
                  <span className="sr-only">{s.label}</span>
                </a>
              ))}
            </div>

            {/* Share ExtoArts */}
            <div style={{ marginTop: 20 }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', opacity: 0.6, display: 'block', marginBottom: 10 }}>
                Share ExtoArts
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent('Check out ExtoArts - YouTube video editing & thumbnail design for creators')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share ExtoArts on X (Twitter)"
                  title="Share on X"
                  style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'color 0.22s, border-color 0.22s, transform 0.22s', textDecoration: 'none' }}
                  className="footer-social-icon"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 14, height: 14, fill: 'currentColor', display: 'block' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ExtoArts - YouTube video editing & thumbnail design for creators: ${SITE_URL}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share ExtoArts on WhatsApp"
                  title="Share on WhatsApp"
                  style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'color 0.22s, border-color 0.22s, transform 0.22s', textDecoration: 'none' }}
                  className="footer-social-icon"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 15, height: 15, fill: 'currentColor', display: 'block' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.05 0 5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.423-8.452" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share ExtoArts on LinkedIn"
                  title="Share on LinkedIn"
                  style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'color 0.22s, border-color 0.22s, transform 0.22s', textDecoration: 'none' }}
                  className="footer-social-icon"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 14, height: 14, fill: 'currentColor', display: 'block' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigate */}
          <nav aria-label="Site navigation">
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--text-muted)', marginBottom: 18, opacity: 0.7 }}>Navigate</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[['/', 'Home'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/pricing', 'Pricing'], ['/workflow', 'How We Work'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--text-muted)', marginBottom: 18, opacity: 0.7 }}>Resources</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                ['/faq', 'FAQ'],
                ['/estimate', 'Cost Estimator'],
                ['/pricing', 'Pricing Guide'],
                ['/collab', 'Partnerships'],
                ['/ticket', 'Support Ticket'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <ObfuscatedEmail
                  user="support"
                  domain="extoarts.in"
                  className="footer-link"
                  style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                />
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--text-muted)', marginBottom: 18, opacity: 0.7 }}>Legal</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              <li><a href="/tos" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">Terms of Service</a></li>
              <li><a href="/privacy" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">Privacy Policy</a></li>
              <li><a href="/apply" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">Editor Applications</a></li>
            </ul>
          </nav>
        </div>

        <hr className="section-divider" style={{ margin: '0' }} />

        {/* Payment methods */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '16px min(36px, 5%)', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.57rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginRight: 4, opacity: 0.6 }}>Accepted</span>
          {PAYMENT_METHODS.map((m) => (
            <span key={m} style={{ fontSize: '0.6rem', fontWeight: 700, padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text-muted)', background: 'var(--surface)', letterSpacing: '0.2px' }}>
              {m}
            </span>
          ))}
          <span style={{ color: 'var(--border)', fontSize: '0.8rem', margin: '0 4px' }}>|</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-world" aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '0.65rem' }} />
            Working with creators worldwide
          </span>
        </div>

        <hr className="section-divider" style={{ margin: '0' }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '16px min(36px, 5%)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, opacity: 0.7 }}>
            &copy; 2026 ExtoArts. Built by creators, for creators.
          </p>
          <div style={{ display: 'flex', gap: 18 }}>
            {['/tos', '/privacy', '/contact'].map((href, i) => (
              <a key={href} href={href} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', opacity: 0.7 }} className="footer-link">
                {['Terms', 'Privacy', 'Contact'][i]}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        .footer-link:hover { color: var(--text-main) !important; opacity: 1 !important; }
        .footer-social-icon:hover {
          color: var(--primary) !important;
          border-color: rgba(34,211,238,0.28) !important;
          background: rgba(34,211,238,0.06) !important;
        }
        @media (hover: hover) and (pointer: fine) {
          .footer-social-icon:hover { transform: translateY(-2px) !important; }
        }
      `}</style>
    </>
  )
}
