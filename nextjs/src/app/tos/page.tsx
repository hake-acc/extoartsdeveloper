import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { SUPPORT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service | ExtoArts',
  description: 'ExtoArts Terms of Service - Version 4.0. Governing the use of ExtoArts video editing, thumbnail design, and related creative services.',
  path: '/tos',
})

export default function TosPage() {
  return (
    <>
      <p className="sr-only">ExtoArts Terms of Service</p>

      <section style={{ padding: 'min(18vh,130px) min(20px,5%) min(100px,10vw)', maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <span className="hero-badge" style={{ marginBottom: 24 }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Version 4.0
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12, color: 'var(--text-main)' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Effective Date: June 8, 2026 | Version 4.0
          </p>

          {/* Disclaimer banner */}
          <div style={{ marginTop: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--warm)' }}>Note:</strong> These terms were written by ExtoArts for operational purposes and are not a substitute for legal advice. If you have complex legal questions about your specific situation, consult a qualified attorney.
          </div>
        </div>

        {/* Prose content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {[
            { num: '1', title: 'Agreement & Scope', content: 'By commissioning any service from ExtoArts (whether through Discord, the client portal, email, or any other channel), you agree to be bound by these Terms of Service. These terms govern all creative services including but not limited to YouTube video editing, thumbnail design, short-form content editing, motion graphics, and YouTube channel automation.' },
            { num: '2', title: 'Who ExtoArts Is', content: 'ExtoArts is a YouTube-focused creative agency that connects content creators with specialist editors and designers. ExtoArts operates as an agency, not a marketplace. All work is managed, reviewed, and quality-controlled by ExtoArts before delivery. ExtoArts charges a flat 10% agency management fee on all projects.' },
            { num: '3', title: 'Official Channels', content: 'All official ExtoArts communication occurs through: (1) The ExtoArts Discord server (discord.gg/extoarts-1402333030827425922), and (2) The official support email at support@extoarts.in. Communications through other platforms are not binding on ExtoArts.' },
            { num: '4', title: 'Quotes, Booking & Payment', content: 'All projects begin with a custom quote issued through the official channels listed above. Quotes are valid for 7 days from issuance. A 50% deposit is required before work begins. The remaining 50% is due before final file delivery. ExtoArts accepts PayPal, bank transfer, USDT, BTC, ETH, UPI, EasyPaisa, Bkash, and PKR transfer.' },
            { num: '5', title: 'Client Responsibilities', content: 'Clients are responsible for: providing complete and accurate raw footage or creative briefs; providing style references, music preferences, and brand guidelines before project start; responding to revision requests within 7 days; and having all necessary rights to any footage, music, or creative materials submitted to ExtoArts.' },
            { num: '6', title: 'Production Scope', content: 'Work will be completed according to the project brief agreed at the time of deposit. Significant changes to the project brief after production has begun may constitute a new project and will be quoted separately. Minor adjustments within the original scope are handled through the revision process.' },
            { num: '7', title: 'Revisions & Approvals', content: 'Standard projects include 2 rounds of revisions. A revision is any change within the original brief. Changes that require fundamentally different creative direction, new footage, or a different format are quoted as a new project. Clients have 30 days from first delivery to request revisions. After 30 days, the project is considered accepted as delivered.' },
            { num: '8', title: 'Refunds, Cancellations & Chargebacks', content: 'If ExtoArts fails to deliver a completed project: full refund is issued. If a client cancels after work has begun: a partial refund based on work completed is issued at ExtoArts\'s discretion. Final approved deliverables are non-refundable. Chargebacks filed without first attempting resolution through ExtoArts support may result in account suspension and recovery of costs.' },
            { num: '9', title: 'Ownership & Usage Rights', content: 'Upon receipt of full payment, the client receives full ownership of all delivered creative work for commercial use on their platform. ExtoArts retains the right to display completed work in its portfolio unless the client explicitly requests otherwise in writing before project completion. Raw project files and working assets remain the property of ExtoArts unless explicitly included in the project scope at a separate fee.' },
            { num: '10', title: 'Portfolio, Credit & Confidentiality', content: 'ExtoArts may display final delivered work in its portfolio, social media, and marketing materials. Clients who prefer confidentiality must request a Non-Display Agreement (NDA) before project start. ExtoArts will not disclose client identities, channel strategies, or business details to third parties without consent.' },
            { num: '11', title: 'Brand Identity', content: 'The ExtoArts name, logo, and branding are the intellectual property of ExtoArts. Unauthorized use of ExtoArts branding in any commercial or promotional context is prohibited.' },
            { num: '12', title: 'Acceptable Use', content: 'ExtoArts services may not be used to produce content that is illegal, defamatory, harassing, sexually explicit without appropriate platform compliance, or that violates the intellectual property rights of third parties. ExtoArts reserves the right to refuse any project that violates this policy.' },
            { num: '13', title: 'Service Refusal & Termination', content: 'ExtoArts reserves the right to refuse service, cancel ongoing projects, or terminate accounts at its sole discretion if a client violates these terms, engages in abusive behavior toward team members, or requests content that violates applicable laws or platform policies. Refunds for cancelled projects will be issued on a pro-rata basis.' },
            { num: '14', title: 'No Guaranteed Results', content: 'ExtoArts provides creative services only. We do not guarantee specific viewer counts, subscriber growth, monetization eligibility, or algorithmic performance. The quality of creative work is provided as agreed in the project brief; business outcomes depend on many factors outside ExtoArts\'s control.' },
            { num: '15', title: 'Limitation of Liability', content: 'ExtoArts\'s total liability for any claim arising from services provided shall not exceed the total fees paid by the client for the specific project giving rise to the claim. ExtoArts is not liable for any indirect, consequential, incidental, or punitive damages, including lost revenue, lost subscribers, or lost business opportunities, even if ExtoArts has been advised of the possibility of such damages.' },
            { num: '16', title: 'Indemnity', content: 'You agree to indemnify and hold ExtoArts harmless from any claims, damages, or expenses arising from your use of ExtoArts services, your violation of these terms, or your infringement of any third-party intellectual property rights. This indemnity obligation is subject to the limitation of liability in Section 15.' },
            { num: '17', title: 'Disputes', content: 'In the event of a dispute, the parties agree to first attempt resolution through direct negotiation via the ExtoArts Discord server or email. If direct negotiation fails, disputes will be resolved through binding arbitration or small claims court, at the election of the party initiating the dispute.' },
            { num: '18', title: 'Privacy', content: 'ExtoArts handles your personal data in accordance with our Privacy Policy at extoarts.in/privacy. By using ExtoArts services, you consent to the collection and use of information as described in the Privacy Policy.' },
            { num: '19', title: 'Changes to Terms', content: 'ExtoArts reserves the right to update these Terms of Service at any time. Material changes will be announced in the ExtoArts Discord server at least 7 days before taking effect. Continued use of ExtoArts services after changes take effect constitutes acceptance of the new terms.' },
            { num: '20', title: 'Governing Law', content: 'These Terms of Service shall be governed by the laws applicable in the jurisdiction of the client, or by mutual written agreement of both parties to apply a specific jurisdiction\'s laws. For international clients, disputes will be resolved under internationally recognized commercial arbitration principles.' },
            { num: '21', title: 'Severability & Miscellaneous', content: 'If any provision of these terms is found unenforceable, the remaining provisions remain in full effect. These terms constitute the entire agreement between ExtoArts and the client for the subject matter described herein. No waiver of any term shall be deemed a further or continuing waiver.' },
            { num: '22', title: 'Contact', content: `For questions about these Terms of Service, contact ExtoArts at ${SUPPORT_EMAIL} or through the Discord server.` },
          ].map((section) => (
            <section key={section.num} id={`tos-${section.num}`} style={{ scrollMarginTop: 90 }}>
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
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            For legal or privacy questions, contact us at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
      </section>
    </>
  )
}
