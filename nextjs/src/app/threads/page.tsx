import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import { permanentRedirect } from 'next/navigation'

export default function ThreadsPage() {
  permanentRedirect('https://www.threads.net/@extoarts')
}
