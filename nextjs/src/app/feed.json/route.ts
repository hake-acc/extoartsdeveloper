import { NextResponse } from 'next/server'
import { SITE_URL, SITE_NAME } from '@/lib/constants'

export const dynamic = 'force-static'

const items = [
  {
    id: `${SITE_URL}/blog/high-retention-youtube-editing`,
    url: `${SITE_URL}/blog/high-retention-youtube-editing`,
    title: 'What is High-Retention YouTube Video Editing?',
    content_text:
      'High-retention editing is the process of engineering every second of your YouTube video to maximise Average View Duration. This guide covers J-cuts, L-cuts, pattern interrupts, sound design layering, and pacing techniques used by editors at ExtoArts to push AVD above 50%.',
    date_published: '2025-01-01T12:00:00Z',
    tags: ['Editing Techniques', 'YouTube'],
    author: { name: 'Rehan', url: `${SITE_URL}/about` },
  },
  {
    id: `${SITE_URL}/blog/discord-creative-agency`,
    url: `${SITE_URL}/blog/discord-creative-agency`,
    title: 'Why a Discord-First Creative Agency Beats Traditional Platforms',
    content_text:
      "Fiverr and Upwork add 20-30% fees, slow communication, and no dedicated team. ExtoArts runs entirely through Discord — private tickets, live file sharing, revision threads, and payment — all in one place with your assigned editor on every project.",
    date_published: '2025-02-15T12:00:00Z',
    tags: ['Agency Model', 'Discord'],
    author: { name: 'Rehan', url: `${SITE_URL}/about` },
  },
  {
    id: `${SITE_URL}/blog/flat-fee-agency-model`,
    url: `${SITE_URL}/blog/flat-fee-agency-model`,
    title: 'How the 10% Flat Agency Fee Model Works — And Why It Matters',
    content_text:
      'Traditional editing agencies take 30-50% commission. ExtoArts charges a flat 10% — 90% of your budget goes directly to your editor. This post explains the math, why fair pay produces better work, and how transparent pricing builds long-term creator relationships.',
    date_published: '2025-04-04T12:00:00Z',
    tags: ['Pricing', 'Agency Model'],
    author: { name: 'Rehan', url: `${SITE_URL}/about` },
  },
  {
    id: `${SITE_URL}/blog/avd-vs-ctr-youtube`,
    url: `${SITE_URL}/blog/avd-vs-ctr-youtube`,
    title: 'AVD vs CTR: Which Metric Should You Optimise First?',
    content_text:
      "CTR gets viewers to click. AVD keeps them watching. YouTube's algorithm weights both — but a high CTR with low AVD signals clickbait and tanks distribution. This post explains how to balance thumbnail strategy with editing quality to maximise total watch time.",
    date_published: '2025-06-16T12:00:00Z',
    tags: ['YouTube Strategy', 'Analytics'],
    author: { name: 'Rehan', url: `${SITE_URL}/about` },
  },
]

export function GET() {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${SITE_NAME} Creator Insights`,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: 'YouTube editing guides, thumbnail design tips, and creator growth strategy from ExtoArts.',
    icon: `${SITE_URL}/favicon-192.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    authors: [{ name: 'Rehan', url: `${SITE_URL}/about` }],
    language: 'en-US',
    items,
  }

  return NextResponse.json(feed, {
    headers: {
      'Content-Type': 'application/feed+json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
