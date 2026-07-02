# ExtoArts — Next.js 16

Production-ready Next.js 16 migration of [extoarts.in](https://extoarts.in) — a YouTube video editing agency.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Global CSS custom properties (no Tailwind) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Font | Plus Jakarta Sans (self-hosted) |
| Icons | Tabler Icons webfont |
| Deploy | Vercel / Cloudflare Pages |

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Stats, Services, Portfolio preview, Reviews, Founder, Why Us |
| `/services` | Six YouTube editing services (video, thumbnail, shorts, gaming, motion, faceless) |
| `/pricing` | Flat 10% fee model, retainer packages, payment methods |
| `/portfolio` | Filterable grid with lightbox (8 categories, iili.io CDN) |
| `/about` | Founder spotlight, core values, mini-FAQ |
| `/contact` | Discord ticket + email |
| `/faq` | 17 questions across 5 categories (accordion `<details>`) |
| `/workflow` | 8-step process timeline |
| `/estimate` | Interactive cost estimator |
| `/collab` | Brand partnerships & creative commissions |
| `/apply` | Editor application form (react-hook-form + zod) |
| `/ticket` | Support ticket form |
| `/login` | Email/password auth |
| `/register` | Account creation |
| `/dashboard` | Client portal (Supabase session) |
| `/tos` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/discord` | Discord redirect |
| `/rss` | RSS 2.0 feed |
| `/feed.json` | JSON Feed 1.1 |
| `/sitemap.xml` | Dynamic sitemap |
| `/robots.txt` | Search engine directives |
| `/opensearch.xml` | OpenSearch description |

Social redirects: `/youtube`, `/twitter`, `/instagram`, `/threads`, `/facebook`

## Quick Start

```bash
cd nextjs
npm install
cp .env.example .env.local
# Fill in .env.local — see .env.example for required vars
npm run dev
```

Server starts on [http://localhost:5000](http://localhost:5000).

## Environment Variables

See `.env.example` for the full list. Required:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
```

Optional (enhances functionality):

```
NEXT_PUBLIC_GA_ID=              # Google Analytics
DISCORD_WEBHOOK_TICKETS=        # Ticket form → Discord webhook
DISCORD_WEBHOOK_APPLICATIONS=   # Apply form → Discord webhook
```

## Architecture

```
src/
├── app/                    # App Router pages & API routes
│   ├── api/                # Server-side API handlers
│   └── [page]/page.tsx     # Static/SSR pages
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/home/      # Homepage section components
│   └── ui/                 # Reusable: GalaxyButton, DiscordButton, SectionHeader
├── lib/                    # constants, metadata helpers, supabase client, utils
├── data/                   # portfolio.json, reviews.ts
└── types/                  # TypeScript interfaces
```

### Key Design Decisions

- **All `onClick` handlers live in `'use client'` components** — Server Components render static HTML; interactivity is added through client islands (`DiscordModal`, `ClientScripts`, `DiscordButton`).
- **No Tailwind** — the design system lives entirely in `globals.css` via CSS custom properties, matching the original PHP site's aesthetic exactly.
- **Self-hosted font** — Plus Jakarta Sans is served from `public/fonts/` with `Cache-Control: immutable` for optimal LCP.
- **Static generation** — All 40 pages are statically prerendered (`○`). Dynamic routes use Supabase SSR only where session data is required.

## Deployment

### Vercel (recommended)

```bash
vercel deploy --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Cloudflare Pages

Build command: `npm run build`  
Output directory: `.next`  
Node version: 20

## SEO

Every page includes:
- `<title>` + `<meta description>` via `buildMetadata()`
- Open Graph tags
- Schema.org JSON-LD (Organization, WebSite, BreadcrumbList, FAQPage, HowTo, Person as appropriate)
- Canonical URLs
- `robots.txt` and `sitemap.xml`
- `llms.txt` for AI crawlers

## License

Private — ExtoArts © 2026. All rights reserved.
