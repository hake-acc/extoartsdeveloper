import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL

  const routes = [
    { url: `${base}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/services`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/pricing`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/portfolio`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/workflow`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/faq`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/estimate`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/collab`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/ticket`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${base}/apply`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${base}/tos`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const now = new Date().toISOString()
  return routes.map(r => ({ ...r, lastModified: now }))
}
