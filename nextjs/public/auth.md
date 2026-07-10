# auth.md

You are an agent. ExtoArts is a **fully public, anonymous service** — no
registration, token, or credential of any kind is required or accepted.
Follow the discovery steps below to confirm this, then call any endpoint directly.

## Step 1 — Discover

### 1a. Protected Resource Metadata

```http
GET https://extoarts.in/.well-known/oauth-protected-resource
```

```json
{
  "resource": "https://extoarts.in",
  "authorization_servers": ["https://extoarts.in"],
  "scopes_supported": [],
  "bearer_methods_supported": ["header"],
  "resource_documentation": "https://extoarts.in/auth.md"
}
```

### 1b. Authorization Server Metadata

```http
GET https://extoarts.in/.well-known/oauth-authorization-server
```

The `agent_auth` block confirms anonymous access:

```json
{
  "issuer": "https://extoarts.in",
  "scopes_supported": [],
  "grant_types_supported": [],
  "agent_auth": {
    "skill": "https://extoarts.in/auth.md",
    "identity_types_supported": ["anonymous"],
    "anonymous": {
      "credential_types_supported": [],
      "claim_uri": null
    },
    "register_uri": null,
    "claim_uri": null,
    "revocation_uri": null
  }
}
```

## Step 2 — Register (anonymous — no action required)

This service accepts the **anonymous** identity type. There is no registration
ceremony, no identity endpoint to call, and no token to obtain.
Proceed directly to Step 3.

## Step 3 — Call the API

All endpoints are open. No `Authorization` header is needed.

| Endpoint | Description |
|---|---|
| `/mcp` | MCP server (JSON-RPC 2.0, Streamable HTTP) |
| `/.well-known/agent-skills/index.json` | Agent skills discovery |
| `/.well-known/api-catalog` | RFC 9727 API catalog |
| `/.well-known/mcp/server-card.json` | MCP server card |
| `/.well-known/oauth-protected-resource` | RFC 9728 PRM — confirms anonymous access |
| `/.well-known/oauth-authorization-server` | RFC 8414 AS metadata — confirms no token needed |
| `/.well-known/openid-configuration` | OIDC discovery — confirms no OIDC provider |

## Scope of available tools

The public MCP tools (`get_pricing_info`, `estimate_video_cost`, `search_faq`,
`get_contact_info`) are read-only. None submits a form, places an order, or
acts on a human's behalf.

## Content negotiation

All HTML pages support `Accept: text/markdown` — pass that header to receive
a Markdown rendering with `Content-Type: text/markdown` and `X-Markdown-Tokens`.

## Revocation

Not applicable. No credentials are issued; there is nothing to revoke.
