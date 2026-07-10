import { NextRequest, NextResponse } from 'next/server'
import { MCP_TOOLS } from '@/lib/mcpTools'
import { SITE_NAME } from '@/lib/constants'

// Minimal MCP server (2025-06-18 spec) using the Streamable HTTP transport
// in its non-streaming, single-JSON-response mode: one POST per JSON-RPC
// request/response, no session state, no SSE. Stateless is intentional —
// every tool here (pricing, estimate, FAQ search, contact info) is a pure
// read/compute over static site data, so there is nothing to persist
// between calls.
export const dynamic = 'force-dynamic'

const PROTOCOL_VERSION = '2025-06-18'
const SERVER_VERSION = '1.0.0'

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: string | number | null
  method: string
  params?: Record<string, unknown>
}

function rpcResult(id: string | number | null | undefined, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, result })
}

function rpcError(id: string | number | null | undefined, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }, { status: 200 })
}

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest
  try {
    body = await req.json()
  } catch {
    return rpcError(null, -32700, 'Parse error: request body must be valid JSON')
  }

  if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return rpcError(body?.id ?? null, -32600, 'Invalid Request: expected a JSON-RPC 2.0 request')
  }

  const { id, method, params } = body

  // JSON-RPC 2.0 only allows string, number, or null for id. Anything else
  // (object, array, boolean) is an invalid request, not a valid id to echo.
  if (id !== undefined && id !== null && typeof id !== 'string' && typeof id !== 'number') {
    return rpcError(null, -32600, 'Invalid Request: id must be a string, number, or null')
  }

  // Notifications (no id field at all) get no response body per spec.
  // notifications/initialized is a true notification by protocol definition,
  // regardless of whether a client mistakenly attaches an id — but if an id
  // is present we still treat it as a request needing a response, matching
  // every other method's contract.
  const isNotification = id === undefined

  switch (method) {
    case 'initialize': {
      const result = {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SITE_NAME, version: SERVER_VERSION },
        instructions:
          'Read-only tools for ExtoArts (YouTube video editing agency): pricing info, a cost estimator, FAQ search, and contact details. No tool submits forms or places orders on the caller\'s behalf.',
      }
      return isNotification ? new NextResponse(null, { status: 202 }) : rpcResult(id, result)
    }

    case 'notifications/initialized':
      return isNotification ? new NextResponse(null, { status: 202 }) : rpcResult(id, {})

    case 'tools/list': {
      const tools = MCP_TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }))
      return isNotification ? new NextResponse(null, { status: 202 }) : rpcResult(id, { tools })
    }

    case 'tools/call': {
      const toolName = params?.name
      const tool = MCP_TOOLS.find((t) => t.name === toolName)
      if (!tool) {
        return isNotification ? new NextResponse(null, { status: 202 }) : rpcError(id, -32602, `Unknown tool: ${String(toolName)}`)
      }
      try {
        const args = (params?.arguments as Record<string, unknown>) ?? {}
        const output = tool.execute(args)
        const result = { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output as Record<string, unknown> }
        return isNotification ? new NextResponse(null, { status: 202 }) : rpcResult(id, result)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Tool execution failed'
        return isNotification
          ? new NextResponse(null, { status: 202 })
          : rpcResult(id, { content: [{ type: 'text', text: message }], isError: true })
      }
    }

    default:
      return isNotification ? new NextResponse(null, { status: 202 }) : rpcError(id, -32601, `Method not found: ${method}`)
  }
}

// Streamable HTTP clients may probe with GET/DELETE for SSE resumption or
// session teardown. This server is stateless and doesn't support server-
// initiated streams, so respond with 405 rather than pretending to.
export async function GET() {
  return NextResponse.json({ error: 'This MCP server only supports POST (stateless JSON-RPC, no SSE streaming).' }, { status: 405 })
}
