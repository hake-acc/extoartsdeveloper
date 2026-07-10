# auth.md

## Agent audience

This document is for AI agents and automated clients interacting with
ExtoArts' public site and machine-readable endpoints: the WebMCP tools
registered via `navigator.modelContext` on every page, and the MCP server
at `/mcp` (see `/.well-known/mcp/server-card.json`).

## Registration / provisioning

None required for public access. ExtoArts does not issue API keys or
credentials for agents. The public MCP tools and all marketing pages are
unconditionally accessible without any credential.

## Supported methods

### Anonymous access (public MCP server and all marketing pages)

- `identity_types_supported`: `["anonymous"]`
- `credential_types_supported`: `[]`
- `claim_uri`: not applicable

Send requests to `/mcp` (JSON-RPC 2.0, Streamable HTTP, non-streaming).
No `Authorization` header, API key, cookie, or session is required.

### OAuth 2.0 / OIDC (login-required areas)

Any login-required areas are backed by Supabase as the authorization
server. Agents acting on behalf of a logged-in user should follow the
standard `authorization_code` + PKCE flow. Discovery metadata:

| Document | URL |
|---|---|
| OAuth AS Metadata (RFC 8414) | `/.well-known/oauth-authorization-server` |
| OIDC Configuration | `/.well-known/openid-configuration` |
| Protected Resource (RFC 9728) | `/.well-known/oauth-protected-resource` |

These endpoints return `503` when the authorization server is not yet
configured, rather than emitting partial metadata that implies support.

## agent_auth block

```json
{
  "register_uri": null,
  "identity_types_supported": ["anonymous", "oauth2"],
  "anonymous": {
    "credential_types_supported": [],
    "scope": "all public endpoints including /mcp and all marketing pages"
  },
  "oauth2": {
    "credential_types_supported": ["access_token"],
    "scope": "login-required pages only",
    "discovery": "/.well-known/oauth-authorization-server",
    "grant_types_supported": ["authorization_code"],
    "code_challenge_methods_supported": ["S256"]
  },
  "claim_uri": null,
  "revocation_uri": null
}
```

## Scope of available tools

The public tools (`get_pricing_info`, `estimate_video_cost`, `search_faq`,
`get_contact_info`, and browser-only `navigate_site`) are read-only:
they look up static pricing/FAQ data or compute a ballpark estimate. None
of them submits a form, places an order, or acts on a human's behalf -
by design, an actual project request always requires a human to open a
ticket on Discord (see `get_contact_info`).

## Content negotiation

All HTML pages support `Accept: text/markdown` - pass that header to
receive a Markdown rendering of any page, with `Content-Type: text/markdown`
and `X-Markdown-Tokens` (token count estimate) in the response.
