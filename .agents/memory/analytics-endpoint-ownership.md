---
name: Analytics endpoint ownership
description: How to avoid console 404s when serving a site through a custom domain or proxy.
---

Third-party analytics script hosting and analytics data collection are separate concerns. Moving a script to a vendor CDN does not move its `/view`, `/event`, or vitals POST endpoints; SDKs may still default those requests to same-origin Vercel proxy routes.

**Why:** A custom-domain deployment without the provider's proxy enabled can report browser 404s even when the vendor script itself loads successfully, lowering Best Practices audit scores.

**How to apply:** Either configure the provider's explicit data endpoints for the actual deployment, or disable the collector until the provider integration is intentionally configured. Keep optional analytics identifiers environment-driven rather than hardcoded.