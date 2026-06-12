import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Layout({ children, currentPage, user }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      setTheme('light');
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  const isActive = (page) => currentPage === page ? 'active' : '';

  return (
    <>
      <div id="page-progress" />

      <div id="dream-loader" role="progressbar" aria-label="Loading ExtoArts" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div className="loader-box" id="loaderBox">
          <svg className="fluid-svg" id="fluidSvg" viewBox="0 0 1000 512" preserveAspectRatio="xMidYMid meet" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="fluidClip">
                <path id="fluidPath" d="M 0,512 L 1,513 L 0,513 Z" />
              </clipPath>
            </defs>
            <text id="eaTextGrey" x="500" y="256" textAnchor="middle" dominantBaseline="central" fill="#777777" fontFamily="Urbanist, Arial Black, Arial, sans-serif" fontWeight="900" fontSize="185" letterSpacing="-5" textLength="840" lengthAdjust="spacingAndGlyphs">ExtoArts</text>
            <text id="eaTextWhite" x="500" y="256" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontFamily="Urbanist, Arial Black, Arial, sans-serif" fontWeight="900" fontSize="185" letterSpacing="-5" textLength="840" lengthAdjust="spacingAndGlyphs" clipPath="url(#fluidClip)">ExtoArts</text>
          </svg>
          <div className="loader-pct-row">
            <span className="loader-pct-text" id="loaderPct">loading... 0%</span>
            <span className="loader-star" aria-hidden="true">✦</span>
          </div>
        </div>
      </div>

      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-outline" id="cursorOutline" />
      <div className="mesh-glow" />
      <canvas id="ea-particles" aria-hidden="true" />

      <div id="site-content">
        <nav className="site-nav">
          <Link href="/" className="logo">
            <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
            <span>ExtoArts</span>
          </Link>
          <ul className="nav-links" role="list">
            <li><Link href="/services" className={`${isActive('services')}`}>Services</Link></li>
            <li><Link href="/portfolio" className={`${isActive('portfolio')}`}>Portfolio</Link></li>
            <li><Link href="/pricing" className={`${isActive('pricing')}`}>Pricing</Link></li>
            <li><Link href="/workflow" className={`${isActive('workflow')}`}>Workflow</Link></li>
            <li><Link href="/about" className={`${isActive('about')}`}>About</Link></li>
            <li><Link href="/contact" className={`${isActive('contact')}`}>Contact</Link></li>
          </ul>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            {user ? (
              <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'7px',padding:'7px 14px 7px 8px',border:'1px solid var(--border)',borderRadius:'50px',textDecoration:'none',color:'var(--text-main)',fontSize:'0.82rem',fontWeight:'700'}}>
                <img src={user.avatar || 'https://i.ibb.co/JR76yvRp/1758037248-icon.png'} style={{width:'24px',height:'24px',borderRadius:'50%'}} alt="Dashboard" />
                Dashboard
              </Link>
            ) : (
              <Link href="/login" style={{padding:'8px 18px',border:'1px solid var(--border)',borderRadius:'50px',textDecoration:'none',color:'var(--text-main)',fontSize:'0.82rem',fontWeight:'700',whiteSpace:'nowrap'}}>Sign In</Link>
            )}
            <span className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              <i className={`fas fa-${theme === 'light' ? 'sun' : 'moon'}`} id="themeIcon" />
            </span>
            <span className="hamburger" onClick={() => setMobileOpen(true)}>
              <i className="fas fa-bars" />
            </span>
          </div>
        </nav>

        <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobileNav" aria-label="Mobile navigation">
          <span className="close-menu" onClick={() => setMobileOpen(false)} aria-label="Close menu"><i className="fas fa-times" /></span>
          <ul role="list" style={{listStyle:'none',margin:0,padding:0,display:'contents'}}>
            <li><Link href="/" className={isActive('index')} onClick={() => setMobileOpen(false)}>Home</Link></li>
            <li><Link href="/services" className={isActive('services')} onClick={() => setMobileOpen(false)}>Services</Link></li>
            <li><Link href="/portfolio" className={isActive('portfolio')} onClick={() => setMobileOpen(false)}>Portfolio</Link></li>
            <li><Link href="/pricing" className={isActive('pricing')} onClick={() => setMobileOpen(false)}>Pricing</Link></li>
            <li><Link href="/workflow" className={isActive('workflow')} onClick={() => setMobileOpen(false)}>Workflow</Link></li>
            <li><Link href="/about" className={isActive('about')} onClick={() => setMobileOpen(false)}>About &amp; FAQ</Link></li>
            <li><Link href="/contact" className={isActive('contact')} onClick={() => setMobileOpen(false)}>Contact</Link></li>
            <li><Link href="/collab" onClick={() => setMobileOpen(false)}>Partner With Us</Link></li>
            {user ? (
              <>
                <li><Link href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link></li>
                <li><Link href="/logout" onClick={() => setMobileOpen(false)} style={{color:'#ef4444'}}>Logout</Link></li>
              </>
            ) : (
              <li><Link href="/login" className="mobile-signin-btn" onClick={() => setMobileOpen(false)}><i className="fab fa-discord" /> Sign In</Link></li>
            )}
          </ul>
        </nav>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts Logo" />
                <span>ExtoArts</span>
              </div>
              <p className="footer-tagline">YouTube-focused creative agency run by real editors and designers. Video editing, thumbnail design, short-form content, and full channel automation.</p>
              <div className="footer-socials">
                <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" className="footer-social" title="Discord" style={{color:'#5865f2'}}><i className="fab fa-discord" /></a>
                <a href="https://youtube.com/@extoarts" target="_blank" rel="noopener" className="footer-social" title="YouTube" style={{color:'#ff0000'}}><i className="fab fa-youtube" /></a>
                <a href="https://x.com/extoarts" target="_blank" rel="noopener" className="footer-social" title="X (Twitter)" style={{color:'var(--text-main)'}}><i className="fab fa-x-twitter" /></a>
                <a href="https://www.threads.com/@extoarts" target="_blank" rel="noopener" className="footer-social" title="Threads" style={{color:'var(--text-main)'}}><i className="fab fa-threads" /></a>
                <a href="https://www.instagram.com/extoarts" target="_blank" rel="noopener" className="footer-social" title="Instagram" style={{color:'#e1306c'}}><i className="fab fa-instagram" /></a>
                <a href="https://www.facebook.com/share/1J1UA6Txqr/" target="_blank" rel="noopener" className="footer-social" title="Facebook" style={{color:'#1877f2'}}><i className="fab fa-facebook-f" /></a>
              </div>
            </div>
            <nav className="footer-nav-col" aria-label="Site navigation">
              <h3 className="footer-nav-heading">Navigate</h3>
              <ul className="footer-nav-list">
                {[['/','/','Home'],[ '/services','services','Services'],['/portfolio','portfolio','Portfolio'],['/pricing','pricing','Pricing'],['/workflow','workflow','How We Work'],['/about','about','About'],['/contact','contact','Contact']].map(([href,,label]) => (
                  <li key={href}><Link href={href} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav className="footer-nav-col" aria-label="Resources">
              <h3 className="footer-nav-heading">Resources</h3>
              <ul className="footer-nav-list">
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                <li><Link href="/hire-video-editor" className="footer-link">Hire a Video Editor</Link></li>
                <li><Link href="/pricing" className="footer-link">Video Editing Cost</Link></li>
                <li><Link href="/collab" className="footer-link">Partnerships</Link></li>
              </ul>
            </nav>
            <nav className="footer-nav-col" aria-label="Services">
              <h3 className="footer-nav-heading">Services</h3>
              <ul className="footer-nav-list">
                <li><Link href="/gaming-video-editing" className="footer-link">Gaming Editing</Link></li>
                <li><Link href="/youtube-shorts-editing" className="footer-link">Shorts Editing</Link></li>
                <li><Link href="/thumbnail-design" className="footer-link">Thumbnail Design</Link></li>
                <li><Link href="/faceless-youtube-channel" className="footer-link">Faceless Channels</Link></li>
              </ul>
            </nav>
            <nav className="footer-nav-col" aria-label="Legal">
              <h3 className="footer-nav-heading">Legal</h3>
              <ul className="footer-nav-list">
                <li><Link href="/tos" className="footer-link">Terms of Service</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              </ul>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 ExtoArts. Built by creators, for creators.</p>
            <div className="footer-bottom-links">
              <Link href="/tos" className="footer-link">Terms</Link>
              <Link href="/privacy" className="footer-link">Privacy</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
        </footer>

        <div id="discordModal" className="modal">
          <div className="modal-box">
            <i className="fab fa-discord" style={{fontSize:'3rem',color:'#5865f2',marginBottom:'20px',display:'block'}} />
            <h2 style={{color:'var(--text-main)',marginBottom:'10px',fontSize:'1.8rem',fontWeight:'900'}}>Join the Server</h2>
            <p style={{color:'var(--text-muted)',marginBottom:'30px',fontSize:'0.95rem',lineHeight:'1.6'}}>Open a ticket, tell us about your project, and we will match you with the right editor and send a custom quote within hours.</p>
            <a href="https://discord.gg/extoarts-1402333030827425922" className="btn btn-main" target="_blank" rel="noopener"><i className="fab fa-discord" /> Open a Ticket on Discord</a>
            <button onClick={() => { if(typeof closeModal === 'function') closeModal('discordModal'); }} style={{background:'none',border:'none',color:'var(--text-muted)',marginTop:'20px',cursor:'pointer',fontWeight:'700',fontSize:'0.8rem',textTransform:'uppercase',letterSpacing:'1px'}}>Maybe Later</button>
          </div>
        </div>
      </div>

      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
      <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
      <Script id="exto-main" strategy="afterInteractive" src="/js/main.js" />
    </>
  );
}
