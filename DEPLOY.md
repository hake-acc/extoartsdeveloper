# ExtoArts - Next.js Deployment Guide

## Quick Start: Deploy to Vercel

### 1. Push to GitHub

```bash
cd extoarts-next
git init
git add .
git commit -m "Initial ExtoArts Next.js build"
```

Create a new GitHub repo at https://github.com/new, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/extoarts-next.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `extoarts-next` repository
4. Vercel auto-detects Next.js - no build settings needed
5. Click **"Deploy"**

### 3. Set Environment Variables

In the Vercel dashboard: **Settings -> Environment Variables**, add all variables from `.env.local.example`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard -> Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard -> Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard -> Settings -> API (Service Role) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard -> Turnstile |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard -> Turnstile |
| `DISCORD_WEBHOOK_URL` | Discord Server -> Edit Channel -> Integrations -> Webhooks |
| `DISCORD_WEBHOOK_APPS` | Same as above or separate channel |
| `HEALTH_CHECK_TOKEN` | Any random string |
| `NEXT_PUBLIC_SITE_URL` | `https://extoarts.in` (or your domain) |

### 4. Configure Supabase Auth Callbacks

In your Supabase dashboard -> **Authentication -> URL Configuration**:

- **Site URL**: `https://your-domain.vercel.app` (or `https://extoarts.in`)
- **Redirect URLs** (add all):
  - `https://extoarts.in/auth/callback`
  - `https://your-project.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

### 5. Add Custom Domain (Optional)

In Vercel dashboard -> **Settings -> Domains**, add `extoarts.in` and follow DNS instructions.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file and fill in values
cp .env.local.example .env.local
nano .env.local

# Start dev server
npm run dev
# Opens at http://localhost:3000
```

---

## Project Structure

```
extoarts-next/
├── components/
│   └── Layout.jsx          # Shared nav + footer
├── lib/
│   ├── supabase.js         # Supabase client (browser + server)
│   ├── db.js               # Database utilities
│   ├── auth.js             # Auth helpers, rate limiting, Turnstile
│   └── notify.js           # Discord webhook notifications
├── pages/
│   ├── _app.jsx            # Global CSS import
│   ├── _document.jsx       # HTML head (fonts, scripts, schema)
│   ├── index.jsx           # Homepage
│   ├── services.jsx        # Services page
│   ├── portfolio.jsx       # Portfolio
│   ├── pricing.jsx         # Pricing
│   ├── workflow.jsx        # How we work
│   ├── about.jsx           # About + FAQ
│   ├── contact.jsx         # Contact
│   ├── faq.jsx             # FAQ
│   ├── hire-video-editor.jsx
│   ├── estimate.jsx        # Cost estimator
│   ├── collab.jsx          # Partnerships
│   ├── tos.jsx             # Terms of Service
│   ├── privacy.jsx         # Privacy Policy
│   ├── ticket.jsx          # Support tickets
│   ├── login.jsx           # Sign in
│   ├── register.jsx        # Create account
│   ├── dashboard.jsx       # Client/editor/admin portal
│   ├── apply.jsx           # Editor application
│   ├── logout.jsx          # Sign out
│   ├── 404.jsx             # 404 page
│   ├── auth/
│   │   └── callback.jsx    # OAuth callback (Google, Discord)
│   └── api/
│       ├── auth-session.js # Create/destroy app session
│       ├── validate-register.js
│       ├── me.js           # Get current user
│       ├── chat-poll.js    # Long-poll for chat messages
│       ├── chat-send.js    # Send chat message
│       ├── order-action.js # Order state transitions
│       ├── apply.js        # Editor application submit
│       ├── health-check.js # Server health
│       └── rss.js          # RSS feed
├── styles/
│   └── globals.css         # All CSS (extracted from PHP header)
├── public/
│   ├── js/main.js          # Global animations/interactions JS
│   ├── data/
│   │   ├── portfolio.json
│   │   └── social_redirects.json
│   ├── favicon.ico
│   └── ...                 # Other static files
├── .env.local.example      # Environment variable template
├── .gitignore
├── next.config.js          # Redirects, image domains, headers
└── vercel.json             # Vercel deployment config
```

---

## Notes

- **Auth**: Uses Supabase OAuth (Google + Discord) + email/password. Sessions stored in `exto_session` cookie.
- **Database**: Same Supabase PostgreSQL project as the PHP site.
- **CSS**: Identical to the PHP site - extracted verbatim from `header.php`.
- **SEO pages**: All SEO landing pages (gaming, thumbnail, faceless, shorts) converted.
- **Redirects**: All PHP URL redirects preserved in `next.config.js`.
