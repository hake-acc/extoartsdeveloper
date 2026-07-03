---
name: Tabler icon class verification
description: How to verify Tabler icon class names actually exist before shipping, since invalid names silently render blank
---
Invalid Tabler icon classes (e.g. `ti-star-filled`, `ti-percent`) don't error in the browser — they just render as an empty/invisible glyph, which looks like "the icon isn't loading."

**Why:** Tabler doesn't warn on unknown class names; the icon font just has no glyph mapped, so the failure is silent and easy to miss in code review.

**How to apply:** Before using a new `ti-*` class, verify it exists by fetching `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.css` and checking for `.ti-<name>:before` in the text (via code_execution), rather than guessing from memory or icon-set conventions in other libraries (e.g. FontAwesome's `-filled`/`-solid` suffix pattern doesn't apply to Tabler). Correct examples found: `ti-star` (not `ti-star-filled`), `ti-percentage` (not `ti-percent`).
