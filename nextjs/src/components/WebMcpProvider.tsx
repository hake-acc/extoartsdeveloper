'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NAV_LINKS, DISCORD_URL, SUPPORT_EMAIL, SITE_URL } from '@/lib/constants'
import { COST_TIERS, RETAINER_PACKAGES } from '@/data/pricing'
import { FAQ_SECTIONS } from '@/data/faq'

// Minimal shape of the emerging WebMCP browser API. Not every browser
// implements this yet, so every call site must feature-detect first.
// https://webmachinelearning.github.io/webmcp/
interface WebMcpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>
}

interface ModelContext {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

const VIDEO_LENGTHS = [
  { label: 'Short (under 5 min)', base: 50 },
  { label: 'Medium (5-15 min)', base: 100 },
  { label: 'Long (15-30 min)', base: 175 },
  { label: 'Extended (30-60 min)', base: 280 },
  { label: 'Long-form (60+ min)', base: 400 },
] as const

const COMPLEXITY_LEVELS = [
  { label: 'basic', multiplier: 1.0 },
  { label: 'standard', multiplier: 1.35 },
  { label: 'premium', multiplier: 1.75 },
] as const

const VALID_PATHS = new Set(NAV_LINKS.map((l) => l.href))

/**
 * Registers WebMCP tools so AI agents browsing the site can look up
 * pricing, estimate a project cost, search the FAQ, and navigate —
 * without scraping the DOM. Safe no-op in browsers without the API.
 */
export function WebMcpProvider() {
  const router = useRouter()

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.modelContext) return

    const controller = new AbortController()
    const { signal } = controller
    const { registerTool } = navigator.modelContext

    registerTool(
      {
        name: 'get_pricing_info',
        description:
          "Get ExtoArts' YouTube video editing pricing model: the flat 10% agency fee, market comparison tiers, and monthly retainer packages.",
        inputSchema: { type: 'object', properties: {} },
        execute: () => ({
          feeModel: 'ExtoArts charges a flat 10% agency fee on the budget the creator sets; 90% goes to the assigned specialist editor.',
          marketComparison: COST_TIERS.map((t) => ({ name: t.name, range: t.range, who: t.who, includes: t.includes })),
          retainerPackages: RETAINER_PACKAGES.map((p) => ({ name: p.name, desc: p.desc, features: p.features })),
          moreInfoUrl: `${SITE_URL}/pricing`,
        }),
      },
      { signal },
    )

    registerTool(
      {
        name: 'estimate_video_cost',
        description:
          'Compute a ballpark cost estimate for a YouTube video editing project based on video length, editing complexity, add-ons, and monthly volume. Mirrors the calculator at /estimate.',
        inputSchema: {
          type: 'object',
          properties: {
            videoLength: {
              type: 'string',
              enum: VIDEO_LENGTHS.map((v) => v.label),
              description: 'Length bucket of the video to edit.',
            },
            complexity: {
              type: 'string',
              enum: COMPLEXITY_LEVELS.map((c) => c.label),
              description: 'Editing complexity level.',
            },
            addonPrices: {
              type: 'array',
              items: { type: 'number' },
              description: 'Optional list of add-on prices in USD to include (e.g. thumbnail design $25, rush delivery $50).',
            },
            videosPerMonth: {
              type: 'number',
              description: 'Optional number of videos per month, to also compute a monthly total.',
            },
          },
          required: ['videoLength', 'complexity'],
        },
        execute: (input) => {
          const lengthEntry = VIDEO_LENGTHS.find((v) => v.label === input.videoLength) ?? VIDEO_LENGTHS[1]
          const complexityEntry = COMPLEXITY_LEVELS.find((c) => c.label === input.complexity) ?? COMPLEXITY_LEVELS[0]
          const addonTotal = Array.isArray(input.addonPrices)
            ? (input.addonPrices as unknown[]).reduce(
                (sum: number, p) => sum + (typeof p === 'number' && Number.isFinite(p) && p > 0 ? p : 0),
                0,
              )
            : 0
          const perVideoEditorPay = Math.round(lengthEntry.base * complexityEntry.multiplier + addonTotal)
          const agencyFee = Math.round(perVideoEditorPay * 0.1)
          const totalPerVideo = perVideoEditorPay + agencyFee
          const videosPerMonth =
            typeof input.videosPerMonth === 'number' && Number.isFinite(input.videosPerMonth) && input.videosPerMonth > 0
              ? input.videosPerMonth
              : undefined

          return {
            editorPay: perVideoEditorPay,
            agencyFee,
            totalPerVideo,
            monthlyTotal: videosPerMonth ? totalPerVideo * videosPerMonth : undefined,
            disclaimer: 'This is a ballpark estimate. Final pricing is set in a custom quote via Discord.',
            getExactQuoteUrl: DISCORD_URL,
          }
        },
      },
      { signal },
    )

    registerTool(
      {
        name: 'search_faq',
        description: 'Search the ExtoArts FAQ for questions and answers matching a keyword (e.g. "refund", "turnaround", "revisions").',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Keyword or phrase to search for in FAQ questions and answers.' },
          },
          required: ['query'],
        },
        execute: (input) => {
          const query = String(input.query ?? '').toLowerCase().trim()
          if (!query) return { results: [] }
          const results = FAQ_SECTIONS.flatMap((section) =>
            section.items
              .filter((item) => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query))
              .map((item) => ({ section: section.section, question: item.q, answer: item.a })),
          )
          return { results, faqPageUrl: `${SITE_URL}/faq?q=${encodeURIComponent(query)}` }
        },
      },
      { signal },
    )

    registerTool(
      {
        name: 'navigate_site',
        description: `Navigate the current browser tab to one of ExtoArts' main pages: ${NAV_LINKS.map((l) => l.href).join(', ')}.`,
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', enum: Array.from(VALID_PATHS), description: 'Site path to navigate to.' },
          },
          required: ['path'],
        },
        execute: (input) => {
          const path = String(input.path ?? '')
          if (!VALID_PATHS.has(path)) {
            return { error: `Unknown path "${path}". Valid paths: ${Array.from(VALID_PATHS).join(', ')}` }
          }
          router.push(path)
          return { navigatedTo: path }
        },
      },
      { signal },
    )

    registerTool(
      {
        name: 'get_contact_info',
        description: 'Get ways to reach ExtoArts for a custom quote or support: Discord server, support email, and the contact/ticket pages.',
        inputSchema: { type: 'object', properties: {} },
        execute: () => ({
          discordUrl: DISCORD_URL,
          supportEmail: SUPPORT_EMAIL,
          ticketPageUrl: `${SITE_URL}/ticket`,
          contactPageUrl: `${SITE_URL}/contact`,
          note: 'Custom quotes are only given by a human team lead on Discord after they review your project details — this tool cannot submit a request on your behalf.',
        }),
      },
      { signal },
    )

    return () => controller.abort()
  }, [router])

  return null
}
