import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from './constants'

interface MetadataOptions {
  title: string
  description: string
  path?: string
  ogTitle?: string
  ogDescription?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '',
  ogTitle,
  ogDescription,
  noIndex = false,
}: MetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const resolvedOgTitle = ogTitle ?? title
  const resolvedOgDesc = ogDescription ?? description

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDesc,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'ExtoArts - Elite YouTube Video Editing Agency',
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: 'ExtoArts - Elite YouTube Video Editing Agency',
        },
      ],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    keywords: [
      'YouTube video editing agency',
      'thumbnail design service',
      'retention editing',
      'TikTok video editing',
      'YouTube automation',
      'short-form content editing',
      'video editing for YouTube',
      'ExtoArts',
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    other: {
      'geo.region': 'IN',
      'geo.placename': 'India',
      language: 'English',
    },
  }
}
