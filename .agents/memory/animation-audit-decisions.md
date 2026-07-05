---
name: Animation audit decisions
description: Durable rules from the full Emil Kowalski animation audit of the ExtoArts site — hover gating, reduced-motion, easing constants, AnimatePresence, spring interpolation, and stagger.
---

## Rules established

### Hover gating
All `:hover` rules that produce movement (transform, position) must be wrapped in `@media (hover: hover) and (pointer: fine)`. Color/border/background state changes do NOT need gating — they are comprehension-aiding feedback, not movement. This applies to both globals.css and inline `<style>` blocks in components.

**Why:** Touch devices fire a "sticky hover" on tap that persists until next interaction. An ungated `transform: translateY(-4px)` causes a card to visually lurch on tap and stay shifted.

**How to apply:** Any time you write a `:hover` selector that contains `transform`, `top`, `left`, `right`, or `bottom` changes, wrap it.

### Easing constant
Default ease for all scroll-triggered InView reveals: `[0.16, 1, 0.3, 1]` (strong custom ease-out). Built-in named easings (`'easeOut'`, `'easeInOut'`) are too weak — they produce sluggish, un-considered feels. Only use named easings for ambient/looping decorative motion (e.g. FluidGradient blobs).

### Stagger timing
- Between words: max 55ms
- Between lines: max 80ms (MaskTextReveal default is 80ms)
- Between cards (InView group): `i * 0.07s` (70ms) for 6-card grids

### Duration thresholds
- UI actions (accordion open, modal enter): max 300ms — use 260ms
- Scroll-triggered reveals: 450–650ms acceptable (user is not waiting)
- Button press: 100–160ms; use `transform 0.16s ease-out` on `.btn`

### Button `:active` feedback
Every interactive button must have `transform: scale(0.97)` on `:active`. This was missing entirely and is the highest-impact missing micro-interaction. Add to `.btn` base class, not individually.

### AnimatePresence must be in the parent that conditionally renders
If a component is mounted/unmounted via `{condition && <Modal />}`, `AnimatePresence` must wrap that conditional in the *parent*, not inside the Modal. An AnimatePresence inside Modal cannot see the exit because the component unmounts before exit fires.

### MagneticButton spring
Direct mouse-to-transform is artificial (no momentum). Always use `useSpring` with `{ stiffness: 150, damping: 15, mass: 0.1 }` for magnetic hover effects. The spring's release carries velocity, giving a physical feel.

### Global reduced-motion via MotionConfig
Add `<MotionConfig reducedMotion="user">` at the root layout (via a 'use client' MotionProvider wrapper). This automatically respects `prefers-reduced-motion` for all Framer Motion JS animations without adding `useReducedMotion()` to every component.

### Surgical prefers-reduced-motion CSS
The nuclear `transition-duration: 0.01ms` approach kills color/opacity transitions that users rely on for state comprehension (e.g., active nav link color, button focus rings). Use: stop `animation-duration` + `animation-iteration-count`, then override `transition` to allow only `opacity`, `color`, `background-color`, `border-color` with a short 0.15s duration.

### Scroll reveal stagger (InView groups)
Cards/grid items that use `.sr` (CSS IntersectionObserver) reveal all simultaneously — no stagger. Convert card grids to use `InView` with per-item `delay: i * 0.07`. This requires adding `'use client'` to the component. SectionHeader h2 should use MaskTextReveal (mask-clip slide-up) for cinematic section headers.

### Navbar scroll transition speed
Scroll-triggered state changes fire frequently. 400ms transition on padding/background looks laggy. Use 220ms max for scroll-triggered transitions.
