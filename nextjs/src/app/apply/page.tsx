import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { ApplyClient } from './ApplyClient'

export const metadata: Metadata = buildMetadata({
  title: 'Apply as a Video Editor',
  description: 'Join the ExtoArts team as a video editor. We work with talented editors worldwide — YouTube editing, thumbnail design, Shorts, gaming content, and more.',
  path: '/apply',
  noIndex: false,
})

export default function ApplyPage() {
  return <ApplyClient />
}
