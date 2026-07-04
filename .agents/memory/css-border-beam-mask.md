---
name: CSS border-beam mask-clip requirement
description: A moving-gradient "border beam" effect renders as a solid visible block instead of a thin border ring if mask-clip is omitted.
---

The border-beam / animated-border-glow technique (masking a moving gradient div to only the border ring of a card) requires `mask-clip`/`-webkit-mask-clip: padding-box, border-box` alongside the two-layer `mask-image` + `mask-composite: exclude`. Without explicit mask-clip, both mask layers default to the same box and XOR/exclude cancels out (or fails to clip), so the moving gradient shows as a solid block sliding across/around the card instead of a subtle traced border light.

**Why:** Found while debugging a "weird moving block of motion" visual bug on a homepage service card — the BorderBeam component had `mask`/`WebkitMask` shorthand with composite but no clip values.

**How to apply:** When implementing or reviewing any animated border-beam/border-glow component, verify mask-clip is set. Also avoid mixing the `mask` shorthand with longhand `maskComposite`/`maskClip` in React inline styles — React logs a rerender warning; use longhand `maskImage`, `maskClip`, `maskComposite` (and Webkit-prefixed equivalents) consistently instead.
