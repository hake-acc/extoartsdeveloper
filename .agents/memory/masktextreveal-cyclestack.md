---
name: MaskTextReveal + CycleStack conflict
description: MaskTextReveal (overflow:hidden + y:110% reveal) breaks CycleStack because grid-stacked phrases get clipped by the wrapper.
---

# MaskTextReveal wrapping CycleStack breaks the cycling text

**Rule:** Never wrap CycleStack inside MaskTextReveal.

**Why:** MaskTextReveal adds `overflow: hidden` to a wrapper div. CycleStack renders all phrases in the same grid cell (grid-row:1 / grid-column:1) and controls visibility via opacity/transform transitions. The `overflow: hidden` clips the phrases even after the mask reveal completes.

**How to apply:** Apply MaskTextReveal only to the static text line. Use a plain motion fade for the line containing CycleStack:

```tsx
<MaskTextReveal delay={0.08}>
  <span className="font-hero">Elite Creative Services</span>
</MaskTextReveal>
<motion.span
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
>
  for <CycleStack />
</motion.span>
```
