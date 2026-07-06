# ExtoArts Bug Tracker

> Updated automatically by Antigravity as fixes are implemented.

---

## Light Mode Issues

### FIXED - Service cards invisible / dark in light mode
- File: src/app/globals.css -> .service-card
- Fix: Added [data-theme="light"] .service-card with liquid glass (rgba white bg, strong backdrop-filter, white inset border highlight, purple tinted shadow).

### FIXED - Trust stack badges dark in light mode
- File: src/app/globals.css -> .tstack-badge
- Fix: Added [data-theme="light"] .tstack-badge with warm white glass, purple border, readable text.

### FIXED - highlight-chip using wrong color in light mode
- File: src/app/globals.css -> [data-theme="light"] .highlight-chip
- Fix: Changed to purple brand colors and primary-deep text.

### FIXED - .tilt-card background !important breaking glass-card in light mode
- File: src/app/globals.css -> [data-theme="light"] .tilt-card
- Fix: Removed background !important override so glass-card inside tilt-cards works freely.

### FIXED - Stat icon boxes too transparent in light mode
- File: src/app/globals.css
- Fix: Boosted icon box shadow visibility and added filter: saturate(1.2) on stat-number.

### FIXED - WhyExtoArts icon boxes invisible in light mode
- File: src/components/sections/home/WhyExtoArts.tsx
- Fix: Replaced hardcoded rgba colors with theme-aware CSS variables (--c-gaming, --c-growth, etc.) that have proper dark/light mode values. Each reason now gets a unique color per creator type, matching the rest of the design system.

---

## Pending Items

### PENDING - GettingStartedRibbon popover dark in light mode (LOW PRIORITY)
- File: src/components/sections/home/GettingStartedRibbon.tsx lines 213-218
- Issue: Popover uses hardcoded backgroundColor: '#0a0a0c'. The torn banner is always dark intentionally, so acceptable.

### PENDING - ea-card-ring light mode verification
- Status: Needs visual check in light mode.

---

## Liquid Glass Design System

- Light glass pattern: rgba(255,252,246,0.42-0.58) + blur(28px) saturate(190%) + inset 0 1px 0 rgba(255,255,255,0.9) + purple tinted shadow
- Dark glass: rgba(18,16,12,0.76) + blur(24px) saturate(180%)
- Creator-type colors: --c-gaming, --c-faceless, --c-shortform, --c-growth, --c-business, --c-firsttime all have light mode overrides in [data-theme="light"]

### FIXED - Services page badge pills invisible in light mode
- File: src/app/services/page.tsx
- Fix: Replaced hardcoded rgba(34,211,238,0.08) cyan badge colors with var(--primary-glow) and var(--border-hover).

### FIXED - Glass cards not opaque enough in light mode (text invisible over background image)
- File: src/app/globals.css -> [data-theme=light] .glass-card, .service-card
- Fix: Bumped background opacity from 0.42 to 0.78, stronger blur/saturation, brighter borders.

### FIXED - Hero subtitle text (portfolio, services) invisible over dark ink background
- File: src/app/globals.css (added .hero-subtitle), src/app/portfolio/page.tsx
- Fix: Added .hero-subtitle utility class with text-shadow fallback for light mode. Also darkened --text-muted to #3a3a4e in light mode.

### FIXED - Stats strip on services page nearly invisible
- File: src/app/services/page.tsx
- Fix: Changed background from rgba(255,255,255,0.02) to var(--surface-2)

### FIXED - Buttons styled with organic brushstroke background
- File: src/app/globals.css -> .btn-main, .btn-primary-glow, .galaxy-btn, .btn-glass, .nav-cta, .brush-btn-bg
- Fix: Styled all principal and outline buttons with inline SVG path representing the ink brushstroke background. Adopted #43207c (deep ink-wash purple) for theme-adaptability in both light and dark modes, with bright hover fills and outlines.
