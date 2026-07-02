import type { MetadataRoute } from 'next'
import { SITE_URL, SITEMAP_URLS } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_URLS.map(({ url, changeFrequency, priority }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: new Date('2026-06-17'),
    changeFrequency,
    priority,
  }))
}
