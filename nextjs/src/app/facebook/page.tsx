import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import { permanentRedirect } from 'next/navigation'

export default function FacebookPage() {
  permanentRedirect('https://www.facebook.com/share/1J1UA6Txqr/')
}
