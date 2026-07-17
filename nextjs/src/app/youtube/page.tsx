import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import { permanentRedirect } from 'next/navigation'

export default function YouTubePage() {
  permanentRedirect('https://youtube.com/@extoarts?si=po6tre_ZAY7i_LFz')
}
