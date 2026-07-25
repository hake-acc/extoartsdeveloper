---
name: SSR/client asset freshness
description: Debugging stale client chunks and hydration mismatches in the Next.js preview environment.
---

When server-rendered HTML and the browser report different values for a static SVG attribute, first compare the fresh server output with the generated client chunk. A preview browser can retain an older HMR/client chunk even after the server has rebuilt.

**Why:** A stale client chunk can make a correct source change look like an SSR cache or component logic bug, and theme-dependent SVG attribute serialization can create a real hydration mismatch.

**How to apply:** Keep development static assets revalidatable, verify the fresh `.next` output, and prefer one deterministic literal for small decorative SVG attributes when the value does not need runtime theme switching.