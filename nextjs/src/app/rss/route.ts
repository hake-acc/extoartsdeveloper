import { NextResponse } from 'next/server'
import { SITE_URL, SITE_NAME } from '@/lib/constants'

const RSS_ITEMS = [
  {
    title: 'What is High-Retention YouTube Video Editing?',
    slug: 'high-retention-youtube-editing',
    date: 'Wed, 01 Jan 2025 12:00:00 +0000',
    description:
      'High-retention editing is the process of engineering every second of your YouTube video to maximise Average View Duration. This guide covers J-cuts, L-cuts, pattern interrupts, sound design layering, and pacing techniques used by editors at ExtoArts to push AVD above 50%.',
    category: 'Editing Techniques',
    creator: 'Rehan',
  },
  {
    title: 'Why a Discord-First Creative Agency Beats Traditional Platforms',
    slug: 'discord-creative-agency',
    date: 'Sat, 15 Feb 2025 12:00:00 +0000',
    description:
      'Fiverr and Upwork add 20–30% fees, slow communication, and no dedicated team. ExtoArts runs entirely through Discord — private tickets, live file sharing, revision threads, and payment — all in one place with your assigned editor on every project.',
    category: 'Agency Model',
    creator: 'Rehan',
  },
  {
    title: 'Viral Gaming Thumbnails: CTR Principles for Roblox, Minecraft & Free Fire',
    slug: 'viral-gaming-thumbnails',
    date: 'Mon, 10 Mar 2025 12:00:00 +0000',
    description:
      'Gaming thumbnails follow strict composition rules: face close-up, high-contrast background, bold text hierarchy, and niche-specific colour palettes. This guide breaks down the design decisions behind thumbnails achieving 8–15% CTR across Roblox, Minecraft, and Free Fire channels.',
    category: 'Thumbnail Design',
    creator: 'Rehan',
  },
  {
    title: 'How the 10% Flat Agency Fee Model Works — And Why It Matters',
    slug: 'flat-fee-agency-model',
    date: 'Fri, 04 Apr 2025 12:00:00 +0000',
    description:
      'Traditional editing agencies take 30–50% commission. ExtoArts charges a flat 10% — 90% of your budget goes directly to your editor. This post explains the math, why fair pay produces better work, and how transparent pricing builds long-term creator relationships.',
    category: 'Pricing',
    creator: 'Rehan',
  },
  {
    title: 'Faceless YouTube Automation: What It Takes to Build at Scale',
    slug: 'faceless-youtube-automation',
    date: 'Thu, 15 May 2025 12:00:00 +0000',
    description:
      'Faceless YouTube channels require consistent script writing, voiceover sync, stock footage curation, and SEO-optimised thumbnails at volume. This guide covers the full ExtoArts faceless automation workflow — from brief to publish — for channels uploading 3–5 videos per week.',
    category: 'Channel Automation',
    creator: 'Rehan',
  },
  {
    title: 'AVD vs CTR: Which Metric Should You Optimise First?',
    slug: 'avd-vs-ctr-youtube',
    date: 'Mon, 16 Jun 2025 12:00:00 +0000',
    description:
      'CTR gets viewers to click. AVD keeps them watching. YouTube\'s algorithm weights both — but a high CTR with low AVD signals clickbait and tanks distribution. This post explains how to balance thumbnail strategy with editing quality to maximise total watch time and subscriber growth.',
    category: 'YouTube Strategy',
    creator: 'Rehan',
  },
  {
    title: 'Motion Graphics for YouTube: After Effects vs CapCut vs DaVinci Resolve',
    slug: 'motion-graphics-tools-youtube',
    date: 'Wed, 02 Jul 2025 12:00:00 +0000',
    description:
      'After Effects is the industry standard for complex motion graphics, but DaVinci Resolve\'s Fusion is closing the gap — and it\'s free. This guide compares tooling choices for different budgets and use cases, with benchmarks from real ExtoArts production workflows.',
    category: 'Editing Tools',
    creator: 'Rehan',
  },
]

export const dynamic = 'force-static'

export function GET() {
  const baseUrl = SITE_URL
  const feedUrl = `${baseUrl}/rss`

  const items = RSS_ITEMS.map(
    (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${baseUrl}/blog/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${item.slug}</guid>
      <pubDate>${item.date}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category}</category>
      <dc:creator>${item.creator}</dc:creator>
    </item>`
  ).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME} Creator Insights</title>
    <link>${baseUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <description>YouTube editing guides, thumbnail design tips, and creator growth strategy from ExtoArts.</description>
    <language>en-US</language>
    <managingEditor>support@extoarts.in (Rehan)</managingEditor>
    <webMaster>support@extoarts.in (ExtoArts)</webMaster>
    <lastBuildDate>${RSS_ITEMS[RSS_ITEMS.length - 1].date}</lastBuildDate>
    <ttl>1440</ttl>
    <image>
      <url>${baseUrl}/favicon-192.png</url>
      <title>${SITE_NAME} Creator Insights</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
