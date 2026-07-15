import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { TicketClient } from './TicketClient'

export const metadata: Metadata = buildMetadata({
  title: 'Submit a Support Ticket',
  description: 'Get help with your active ExtoArts project. Submit a support ticket for billing questions, revision requests, or general assistance from our team.',
  path: '/ticket',
  noIndex: false,
})

export default function TicketPage() {
  return <TicketClient />
}
