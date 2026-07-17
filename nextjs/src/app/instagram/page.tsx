import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import { permanentRedirect } from 'next/navigation'

export default function InstagramPage() {
  permanentRedirect('https://www.instagram.com/extoarts?igsh=enVlYm9hczNiYjgw')
}
