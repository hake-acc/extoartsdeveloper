import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { EstimateClient } from './EstimateClient'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing Cost Estimator',
  description: 'Estimate your YouTube video editing cost instantly. Choose length, complexity, and add-ons to get a ballpark before your custom Discord quote.',
  path: '/estimate',
})

export default function EstimatePage() {
  return <EstimateClient />
}
