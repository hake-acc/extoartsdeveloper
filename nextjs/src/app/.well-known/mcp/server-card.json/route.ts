import { NextResponse } from 'next/server'
import { MCP_TOOLS } from '@/lib/mcpTools'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

// MCP Server Card (SEP-1649) — lets agents discover the real MCP server at
// /mcp without a handshake. Kept in sync with /mcp's actual capabilities:
// list the tool names here from the same MCP_TOOLS source of truth used to
// implement /mcp, so this file can't advertise tools that don't exist.
// https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(
    {
      $schema: 'https://schemas.modelcontextprotocol.io/server-card/draft/schema.json',
      protocolVersion: '2025-06-18',
      serverInfo: {
        name: SITE_NAME,
        version: '1.0.0',
      },
      description:
        'Read-only MCP tools for ExtoArts, a YouTube video editing agency: pricing lookup, a cost estimator, FAQ search, and contact details. No tool submits forms or places orders.',
      transport: {
        type: 'streamable-http',
        endpoint: `${SITE_URL}/mcp`,
        // This server responds with a single JSON-RPC response per request
        // (no server-initiated SSE stream), which the Streamable HTTP
        // transport permits for stateless servers.
        streaming: false,
      },
      capabilities: {
        tools: { listChanged: false },
        resources: {},
        prompts: {},
      },
      tools: MCP_TOOLS.map((t) => t.name),
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
