import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { SUPPORT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | ExtoArts',
  description: 'ExtoArts Privacy Policy - Version 4.0. How we collect, use, and protect your personal data.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <p className="sr-only">ExtoArts Privacy Policy</p>

      <section style={{ padding: 'min(18vh,130px) min(20px,5%) min(100px,10vw)', maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <span className="hero-badge" style={{ marginBottom: 24 }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Version 4.0
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12, color: 'var(--text-main)' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Effective Date: June 8, 2026 | Version 4.0</p>
          <div style={{ marginTop: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--warm)' }}>Note:</strong> This policy was written by ExtoArts for operational transparency purposes. It is not a substitute for legal advice. If you have complex privacy law questions, consult a qualified attorney.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {[
            { num: '1', title: 'Who We Are', content: 'ExtoArts (extoarts.in) is a YouTube-focused creative agency. This Privacy Policy explains how ExtoArts collects, uses, stores, and protects personal information provided by users of our website and client portal.' },
            { num: '2', title: 'Information We Collect', content: 'We collect: Contact information (name, email) when you submit a support ticket or editor application; Analytics data (page views, session duration, browser type, approximate location) collected through Google Analytics 4; Technical data (IP address, cookies, browser fingerprint) collected automatically.' },
            { num: '3', title: 'How We Use Information', content: 'We use collected information to: provide and improve our services; process orders and communicate about projects; send service-related notifications; analyze website traffic and user behavior to improve the experience; comply with legal obligations; and prevent fraud and abuse.' },
            { num: '4', title: 'Legal Bases for Processing', content: 'We process personal data under the following legal bases: Performance of a contract (to fulfill your service order); Legitimate interests (to operate and improve our business); Consent (for analytics cookies and marketing, which you can withdraw at any time); and Legal obligation (to comply with applicable laws).' },
            { num: '5', title: 'Cookies, Local Storage & Analytics', content: 'We use: a localStorage key "ea-theme" (to remember your dark/light mode preference); and Google Analytics 4 for traffic analysis (anonymized, with IP masking). You can opt out of Google Analytics at tools.google.com/dlpage/gaoptout. You can clear localStorage at any time through your browser settings.' },
            { num: '6', title: 'Third-Party Service Providers', content: 'We share data with: Discord (project communication, order tickets); Google Analytics (anonymized traffic analytics); Payment processors (PayPal, UPI, crypto processors - see their respective privacy policies); iili.io/freeimage.host (image hosting for portfolio and OG images); File transfer services (WeTransfer, Google Drive for footage delivery).' },
            { num: '7', title: 'International Transfers', content: 'ExtoArts operates globally. Your data may be processed in countries outside your country of residence, including India, the United States, and the European Union. Where we transfer data internationally, we ensure appropriate safeguards are in place consistent with applicable privacy laws.' },
            { num: '8', title: 'Data Retention & Deletion', content: 'We retain your personal data as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time by emailing support@extoarts.in. Billing records may be retained for up to 7 years for accounting compliance. Anonymized analytics data is retained as per Google Analytics\'s retention settings.' },
            { num: '9', title: 'Your Privacy Rights', content: 'Depending on your location, you may have the right to: access your personal data; correct inaccurate data; request deletion of your data; object to or restrict processing; and data portability. To exercise these rights, contact us at support@extoarts.in. We will respond within 30 days.' },
            { num: '10', title: 'CCPA / CPRA Notice (California Residents)', content: 'California residents have the right to know what personal information is collected, used, shared, or sold. ExtoArts does not sell personal information. You may request disclosure, deletion, or correction of your personal data by contacting support@extoarts.in. We will not discriminate against you for exercising your privacy rights.' },
            { num: '11', title: 'Children & Minors', content: 'ExtoArts services are not directed at children under 13. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected data from a child under 13, we will delete it promptly. Users between 13-18 should have parental consent before using our services.' },
            { num: '12', title: 'Security', content: 'We implement appropriate technical and organizational security measures including bcrypt password hashing, CSRF token protection, rate limiting, Cloudflare bot protection, and encrypted HTTPS connections. However, no system is perfectly secure, and we cannot guarantee absolute security of your data.' },
            { num: '13', title: 'Changes to This Policy', content: 'We may update this Privacy Policy periodically. Material changes will be announced in the ExtoArts Discord server and via the client portal notification system at least 7 days before taking effect. The effective date at the top of this page will always reflect the most recent update.' },
            { num: '14', title: 'Contact', content: `For privacy questions, data requests, or complaints, contact us at ${SUPPORT_EMAIL}. We aim to respond within 30 days.` },
          ].map((section) => (
            <section key={section.num} id={`priv-${section.num}`} style={{ scrollMarginTop: 90 }}>
              <h2 style={{ fontSize: 'clamp(1rem,2vw,1.3rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.3px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.16)', padding: '3px 10px', borderRadius: 999, flexShrink: 0 }}>
                  {section.num}
                </span>
                {section.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.78, margin: 0 }}>
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 52, paddingTop: 28, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Privacy questions?{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
      </section>
    </>
  )
}
