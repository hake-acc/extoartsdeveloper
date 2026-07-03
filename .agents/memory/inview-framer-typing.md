---
name: InView framer-motion typing
description: Known TypeScript gotchas for useInView options and motion ref types in Framer Motion v11+.
---

# InView component — Framer Motion typing pitfalls

## Rules
1. **`margin` in `useInView` options** — `UseInViewOptions.margin` is typed as `MarginType`, not `string`. Do not expose it in public API; use `amount` instead.
2. **`ref` type** — When sharing one `useRef<HTMLElement>` across multiple `motion.*` tags (div, section, article, etc.), cast as `ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}` or use a generic `useRef<HTMLElement>` and cast at call site.
3. **`ease` in `transition`** — Accept `object` for the `transition` prop rather than typing `ease` as `number[]`, since Framer's `Easing` union doesn't include `number[]` directly. Named easing strings like `'easeOut'` always work.
