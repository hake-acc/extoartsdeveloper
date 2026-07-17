import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import { permanentRedirect } from 'next/navigation'

export default function DiscordPage() {
  permanentRedirect('https://discord.gg/extoarts-1402333030827425922')
}
