# ExtoArts — Next.js Project

## Overview

ExtoArts (extoarts.in) is a YouTube video editing and thumbnail design agency website with a client portal, built fully in Next.js. The original PHP 8.2 codebase has been retired and removed from this repo (it was only a reference copy used during migration and is backed up elsewhere) — this repo now contains only the Next.js app.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Auth + Database) · Deployed on Vercel / Cloudflare

## Running the App

The main application is in the `nextjs/` subdirectory:

```bash
cd nextjs && npm install && npm run dev
```

The Replit workflow `Start application` runs `cd nextjs && npm run dev` on port 5000.

## Project Structure

```
nextjs/
├── src/
│   ├── app/              # App Router pages and API routes
│   │   ├── page.tsx      # Home (/)
│   │   ├── services/     # /services
│   │   ├── pricing/      # /pricing
│   │   ├── portfolio/    # /portfolio
│   │   ├── about/        # /about
│   │   ├── workflow/     # /workflow
│   │   ├── collab/       # /collab (partnerships)
│   │   ├── contact/      # /contact
│   │   ├── faq/          # /faq
│   │   ├── estimate/     # /estimate (price calculator)
│   │   ├── ticket/       # /ticket (support)
│   │   ├── apply/        # /apply (editor applications)
│   │   ├── login/        # /login
│   │   ├── register/     # /register
│   │   ├── dashboard/    # /dashboard (client portal)
│   │   ├── tos/          # /tos
│   │   ├── privacy/      # /privacy
│   │   ├── rss/          # /rss (RSS feed XML)
│   │   ├── health/       # /health (diagnostics)
│   │   ├── auth/callback/# /auth/callback (OAuth)
│   │   └── api/          # API routes
│   ├── components/       # Shared components
│   │   ├── layout/       # Navbar, Footer
│   │   ├── sections/home/# Home page sections
│   │   └── ui/           # GalaxyButton, SectionHeader
│   ├── data/             # Static JSON data
│   ├── lib/              # Utilities, constants, Supabase client
│   └── types/            # TypeScript interfaces
├── public/               # Static assets (fonts, favicons, llms.txt)
└── .env.example          # Environment variable template
```

## Environment Variables

Copy `nextjs/.env.example` to `nextjs/.env.local` and fill in:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes (for auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes (for auth) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes (server operations) |
| `DISCORD_WEBHOOK_TICKET` | Discord webhook for ticket submissions | Yes |
| `DISCORD_WEBHOOK_APPLICATIONS` | Discord webhook for editor applications | Optional |
| `DISCORD_WEBHOOK_REGISTRATIONS` | Discord webhook for new registrations | Optional |

## Design System

- **Colors:** `--primary` (#22d3ee), `--bg` (#050508), `--surface` (#0d0d1c)
- **Typography:** Plus Jakarta Sans (self-hosted in `public/fonts/`)
- **Icons:** Tabler Icons (CDN, loaded async after paint)
- **Theme:** Dark/light toggle stored in `localStorage` under `ea-theme`
- **CSS:** All design tokens in `src/app/globals.css` using CSS custom properties + Tailwind 4 `@theme`

## Key Conventions

- No em-dashes in visible text — use hyphens
- Images hosted on iili.io CDN (external)
- All page content matches PHP source — no placeholder content
- Discord modal (`#discordModal`) triggered via `openModal('discordModal')` — injected in `layout.tsx`
- Scroll reveal via `.sr` class + IntersectionObserver (injected in `layout.tsx`)
- Count-up animation via `data-count-up` attribute + script in `layout.tsx`
- Cycle/typewriter effect via `.cycle-stack` + `.cycle-phrase` + script in `layout.tsx`

## User Preferences

- PHP→Next.js migration is complete; legacy PHP codebase deleted from repo root (backed up elsewhere, was not the live production server)
- Maintain feature parity with the original PHP implementation
- Preserve existing Supabase project compatibility
- Production reference (still live on old PHP host until custom domain is repointed): https://extoarts.in
- Deploy target: Vercel (already deploying from repo root via `.vercel/project.json` + `.github/workflows/deploy.yml`), existing Supabase backend
- Static files previously served by PHP at the repo root (favicons, ads.txt, humans.txt, sw.js, browserconfig.xml, site verification files, .well-known/) now live in `nextjs/public/`
