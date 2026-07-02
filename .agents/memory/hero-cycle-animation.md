---
name: Hero cycle animation CSS
description: How to correctly implement the overlapping typewriter/cycle animation in the hero title with gradient or solid color text.
---

## The Rule

Do NOT apply `background-clip: text` + `-webkit-text-fill-color: transparent` to a parent element and expect child `.cycle-phrase` elements to inherit the gradient fill. It does not work.

**Why:** CSS `background-clip: text` clips the *element's own background* to its own text. A parent's gradient background does not show through child elements' text unless children explicitly have `background: inherit; background-clip: text; -webkit-text-fill-color: transparent`. Also, `filter: blur()` and `will-change` on `.cycle-phrase` create new stacking/compositing contexts that break gradient-text rendering entirely.

**How to apply:**
- Use `color: var(--primary)` (solid) directly on `.hero-title .cycle-stack .cycle-phrase`
- The cycle-stack container must use `display: grid; grid-template-columns: 1fr; min-height: 1.12em` so all cycle-phrase children overlap in the same grid cell
- Each `.cycle-phrase` has `grid-row: 1; grid-column: 1` for stacking overlap
- If gradient text is truly needed on cycle phrases, apply `background`, `background-clip: text`, and `-webkit-text-fill-color: transparent` **directly** to each `.cycle-phrase` — not the parent
