'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'
import { MCP_TOOLS } from '@/lib/mcpTools'

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

const VALID_PATHS = new Set(NAV_LINKS.map((l) => l.href))

/**
 * Registers WebMCP tools so AI agents browsing the site can look up
 * pricing, estimate a project cost, search the FAQ, and navigate —
 * without scraping the DOM. Safe no-op in browsers without the API.
 *
 * The pricing/FAQ/contact tools are shared with the real MCP server at
 * /mcp (see src/lib/mcpTools.ts) so the two surfaces never drift apart.
 * navigate_site is browser-only since it needs the router.
 */
export function WebMcpProvider() {
  const router = useRouter()

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.modelContext) return

    const controller = new AbortController()
    const { signal } = controller
    const { registerTool } = navigator.modelContext

    for (const tool of MCP_TOOLS) {
      registerTool(tool, { signal })
    }

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

    return () => controller.abort()
  }, [router])

  return null
}
