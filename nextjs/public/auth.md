# auth.md

## Agent audience

This document is for AI agents and automated clients interacting with
ExtoArts' public site and machine-readable endpoints: the WebMCP tools
registered via `navigator.modelContext` on every page, and the MCP server
at `/mcp` (see `/.well-known/mcp/server-card.json`).

## Access model: fully public, no authentication

ExtoArts has no protected APIs. Every endpoint is open and anonymous.
No API key, token, cookie, or credential of any kind is required or accepted.

## agent_auth block

```json
{
  "register_uri": null,
  "identity_types_supported": ["anonymous"],
  "anonymous": {
    "credential_types_supported": [],
    "scope": "all endpoints"
  },
  "claim_uri": null,
  "revocation_uri": null
}
```

## Available endpoints

| Endpoint | Description |
|---|---|
| `/mcp` | MCP server (JSON-RPC 2.0, Streamable HTTP) |
| `/.well-known/agent-skills/index.json` | Agent skills discovery |
| `/.well-known/api-catalog` | RFC 9727 API catalog |
| `/.well-known/mcp/server-card.json` | MCP server card |
| `/.well-known/oauth-protected-resource` | RFC 9728 - confirms no auth required |
| `/.well-known/oauth-authorization-server` | RFC 8414 - confirms no AS |
| `/.well-known/openid-configuration` | OIDC discovery - confirms no OIDC |

## Scope of available tools

The public tools (`get_pricing_info`, `estimate_video_cost`, `search_faq`,
`get_contact_info`, and browser-only `navigate_site`) are read-only.
None of them submits a form, places an order, or acts on a human's behalf.

## Content negotiation

All HTML pages support `Accept: text/markdown` - pass that header to
receive a Markdown rendering of any page, with `Content-Type: text/markdown`
and `X-Markdown-Tokens` in the response.
