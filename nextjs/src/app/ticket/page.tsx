import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'
import { TicketClient } from './TicketClient'

export const metadata: Metadata = buildMetadata({
  title: 'Submit a Support Ticket — ExtoArts Client Support',
  description: 'Get help with your active ExtoArts project. Submit a support ticket for billing questions, revision requests, delivery issues, or general assistance. Our team responds within 24 hours.',
  path: '/ticket',
  noIndex: false,
})

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/ticket`,
  url: `${SITE_URL}/ticket`,
  name: 'Submit a Support Ticket — ExtoArts Client Support',
  description: 'Get help with your active ExtoArts project. Submit a support ticket for billing questions, revision requests, delivery issues, or general assistance.',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
}

export default function TicketPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />

      {/* SEO-visible support info — server rendered for crawlers */}
      <div className="sr-only">
        <h2>ExtoArts Client Support</h2>
        <p>
          The ExtoArts support ticket system is for active clients who need help with an ongoing project,
          billing question, revision request, or delivery issue. Fill in your name, email, subject, and
          a detailed description of your issue. If you have an active project reference or order ID,
          include it to speed up the response.
        </p>
        <p>
          Our support team monitors tickets daily and typically responds within 24 hours. For urgent
          issues, opening a ticket directly in our Discord server will get you a faster response —
          often within a few hours during business hours.
        </p>
        <p>
          Use this form for: revision requests on delivered projects, billing and payment questions,
          timeline or deadline changes, file delivery issues, or general questions about your active order.
          For starting a brand new project, please join the Discord and open a new project ticket there instead.
        </p>
        <p>
          ExtoArts serves creators worldwide and our support team operates across multiple time zones to
          ensure no client goes unanswered for long. All support communications are handled professionally
          and kept confidential.
        </p>
      </div>

      <TicketClient />
    </>
  )
}
