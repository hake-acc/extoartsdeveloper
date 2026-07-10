# auth.md

## Agent audience

This document is for AI agents and automated clients interacting with
ExtoArts' public site and machine-readable endpoints: the WebMCP tools
registered via `navigator.modelContext` on every page, and the MCP server
at `/mcp` (see `/.well-known/mcp/server-card.json`).

## Registration / provisioning

None required. ExtoArts does not operate an OAuth authorization server or
issue credentials to agents. There is no `/agent/auth`, registration
endpoint, or API key to obtain — every tool listed below is public and
read-only.

## Supported method: anonymous access

- `identity_types_supported`: `["anonymous"]`
- `anonymous.credential_types_supported`: `[]` (no credential of any kind is presented or checked)
- `claim_uri`: not applicable — there is nothing to claim; access is unconditional

Send requests to `/mcp` (JSON-RPC 2.0, Streamable HTTP, non-streaming) or
call the WebMCP tools directly in-browser. No `Authorization` header,
API key, cookie, or session is required or inspected.

## Why there is no OAuth metadata

`/.well-known/oauth-protected-resource` and
`/.well-known/oauth-authorization-server` are intentionally not published.
Those documents describe a real protected-resource / authorization-server
pair; ExtoArts has neither. Publishing them without a working
authorization server would be inaccurate and would mislead agents into
attempting a handshake that has no backing implementation. If ExtoArts
ever adds an authenticated agent API (e.g. to let an agent place a real
order), OAuth metadata will be published here and this document will be
updated to reference it.

## Scope of available tools

The tools above (`get_pricing_info`, `estimate_video_cost`, `search_faq`,
`get_contact_info`, and browser-only `navigate_site`) are all read-only:
they look up static pricing/FAQ data or compute a ballpark estimate. None
of them submits a form, places an order, or acts on a human's behalf —
by design, an actual project request always requires a human to open a
ticket on Discord (see `get_contact_info`).
