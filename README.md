# ExtoArts - Developer Documentation

A PHP 8.2 marketing site + client portal for [extoarts.in](https://extoarts.in) — a YouTube video editing and thumbnail design agency.

---

## Quick Start (Replit / local dev)

```bash
php -S 0.0.0.0:5000 router.php
# Visit http://localhost:5000
```

No build step. No package manager. All dependencies are CDN-loaded.

---

## Directory Structure

```
/
├── index.php           Front controller — all HTTP routing lives here (Apache/AeonHost)
├── router.php          Replit dev-server shim — static files pass-through, rest → index.php
├── .htaccess           Apache 2.4 rules: RewriteCond !-f !-d → index.php
├── 404.php             Custom 404 page (must live in root for Apache ErrorDocument)
│
├── includes/           Internal PHP — HTTP-blocked (Require all denied)
│   ├── config.php      Database connection bootstrap, loads data/config.json
│   ├── db.php          Supabase REST/RPC abstraction layer (see DB Layer below)
│   ├── auth.php        Sessions, CSRF, Turnstile CAPTCHA, rate limiting, RBAC
│   ├── notify.php      Discord webhook notifications (registrations, applications)
│   ├── email.php       Email sending utilities
│   └── error-handler.php  Dev error overlay; production silently logs via error_log()
│
├── templates/          Shared HTML partials — HTTP-blocked
│   ├── header.php      <head>, nav, CSS links, JSON-LD schemas, GA4
│   └── footer.php      Footer, JS scripts, AOS init, scroll-reveal
│
├── pages/              Public marketing pages — HTTP-blocked, served via index.php
│   ├── home.php        Homepage  →  /
│   ├── about.php       →  /about
│   ├── services.php    →  /services
│   ├── portfolio.php   →  /portfolio
│   ├── pricing.php     →  /pricing
│   ├── workflow.php    →  /workflow
│   ├── collab.php      →  /collab
│   ├── contact.php     →  /contact
│   ├── faq.php         →  /faq
│   ├── estimate.php    →  /estimate
│   ├── ticket.php      →  /ticket  (also /support)
│   ├── tos.php         →  /tos  (also /toc)
│   ├── privacy.php     →  /privacy
│   ├── rss.php         →  /rss  (also /feed)
│   ├── health.php      →  /health  (diagnostics)
│   ├── sitemap-images.php  →  /sitemap-images.xml  (dynamic)
│   └── indexnow-ping.php   →  /indexnow-ping  (admin-protected SEO ping)
│
├── portal/             Auth-required pages — HTTP-blocked, served via index.php
│   ├── login.php       →  /login
│   ├── register.php    →  /register
│   ├── logout.php      →  /logout
│   ├── dashboard.php   →  /dashboard  (client orders, editor jobs, admin hub)
│   ├── chat.php        →  /chat  (real-time order chat, embedded as iframe)
│   ├── apply.php       →  /apply  (editor application portal)
│   ├── hq-portal.php   →  /hq-portal  (admin-only)
│   ├── admin.php       →  /admin  (compat redirect → /dashboard)
│   ├── oauth-callback.php  →  /auth/callback
│   ├── verify-email.php    →  /verify-email
│   └── verify.php          →  /verify
│
├── api/                JSON endpoints — served via index.php /api/* routing
│   ├── _api.php            Shared helpers: json_out(), json_err(), api_absorb_json()
│   ├── chat-poll.php       GET  /api/chat-poll?oid=X&after=ISO  — long-poll for new messages
│   ├── chat-send.php       POST /api/chat-send                  — send a message
│   ├── order-action.php    POST /api/order-action               — admin/editor state transitions
│   ├── order-submit.php    POST /order/submit                   — client order submission
│   ├── health-check.php    GET  /api/health-check               — JSON health status
│   ├── validate-register.php  GET  /api/validate-register       — username/email availability
│   └── auth-session.php    GET  /api/auth-session               — session info for JS
│
├── css/                Stylesheets (served directly by Apache / PHP built-in server)
│   ├── shared.css      Global reset, typography, CSS custom properties, dark/light theme
│   ├── transitions.css Page fade transitions, scroll-reveal, AOS overrides
│   ├── cinematic.css   Hero sections, video overlays, cinematic effects
│   ├── premium.css     Cards, buttons, glassmorphism, gradients
│   ├── identity.css    Brand colours, logo styles, nav identity
│   ├── ux.css          Forms, modals, tooltips, interactive UX components
│   └── reveal.css      Scroll-reveal animation classes (sr-left, sr-right, sr-zoom)
│
├── js/                 Client-side scripts (served directly)
│   ├── app.js          Core app bootstrap, theme init, custom cursor, page transitions
│   ├── ui.js           Nav, mobile menu, quick-panel, scroll progress bar
│   ├── transitions.js  Page fade-in/out, history API integration
│   ├── cinematic.js    Hero mouse-spotlight, parallax, 3D tilt
│   ├── interactions.js Stat count-up, service card shimmer, scroll triggers
│   ├── premium.js      Typewriter effect, marquee, capability ticker
│   ├── loader.js       Page loader overlay, extoReady event dispatcher
│   ├── galaxy-btn.js   Galaxy/particle CTA button effect
│   └── ux.js           Form validation helpers, toast notifications
│
├── data/               Runtime JSON data (read/written by PHP)
│   ├── portfolio.json      Portfolio categories and items (managed from HQ portal)
│   ├── social_redirects.json  /discord, /instagram etc. (managed from HQ portal)
│   └── config.json         Site config: admin credentials, Turnstile keys (never commit real values)
│
└── uploads/            User-uploaded media from HQ portal (local; migrate to CDN for prod)
```

---

## How Routing Works

### On Replit (dev)
```
PHP built-in server → router.php
  └─ if URI matches a real file (css/js/png/…) → return false (PHP serves natively)
  └─ all other URIs → require index.php
```

### On AeonHost (Apache, production)
```
Apache → .htaccess
  └─ real file/dir exists → Apache serves it directly (no PHP overhead)
  └─ everything else → RewriteRule → index.php
       └─ index.php checks $map[] route table
            └─ p:  prefix → pages/
            └─ r:  prefix → portal/
            └─ bare: prefix → root file
            └─ __redirect: → 301
```

**Adding a new page:**
1. Create `pages/my-page.php` (or `portal/my-page.php` for auth-required)
2. Add one entry to `$map` in `index.php`:  `'my-page' => 'p:my-page'`
3. Done — no `.htaccess` changes needed

---

## Database Layer (`includes/db.php`)

The DB layer has two execution paths, tried automatically in order:

| Path | Method | Covers |
|---|---|---|
| **A** | `php_exec` RPC | Any SQL including JOINs, aggregates, subqueries |
| **B** | PostgREST | Simple SELECT/INSERT/UPDATE/DELETE only |

Path A requires `setup-supabase-rpc.sql` to be run once in Supabase SQL Editor.
Until then, all queries fall back to Path B transparently.

**Public API:**
```php
db_fetch(string $sql, array $params): array        // SELECT → array of rows
db_fetch_one(string $sql, array $params): ?array   // SELECT → first row or null
db_execute(string $sql, array $params): int        // INSERT/UPDATE/DELETE → affected rows
db_fetch_parallel(array $queries): array           // N independent SELECTs concurrently
```

---

## Auth System (`includes/auth.php`)

Roles: `client` | `editor` | `admin`

```php
auth_require('client', 'editor');   // guard a page — redirects to /login if not authed
auth_user(): ?array                 // returns current user row or null
auth_login_user(array $user)        // sets session after successful login
auth_logout()                       // destroys session, clears cookie
csrf_token(): string                // get or create CSRF token
csrf_verify(): bool                 // validate token from POST
rate_limit_check(string $key): bool // true = within limit; false = blocked
secure_headers(bool $portal)        // send CSP + security headers (called at top of portal pages)
```

---

## Environment & Secrets

Secrets are stored in `data/config.json` (created automatically on first HQ portal save).
On production AeonHost the file is outside version control — values are set via the HQ portal.

| Key path | Purpose |
|---|---|
| `admin.username` | HQ portal login |
| `admin.password_hash` | bcrypt hash |
| `turnstile.site_key` | Cloudflare Turnstile public key |
| `turnstile.secret_key` | Cloudflare Turnstile secret |

**Never commit real values.** `data/config.json` is in `.htaccess` deny rules.

Supabase credentials (`SUPABASE_URL`, `SUPABASE_KEY`) live in `includes/db.php` as PHP constants. On a future refactor these should move to environment variables or `data/config.json`.

---

## Debugging

### Dev error overlay
On non-production domains `error-handler.php` renders a full-screen overlay with:
- PHP error type, message, file, line number
- Expandable stack trace
- "Copy Error Report" button (paste to Discord #bug-reports)

The overlay is **suppressed on `extoarts.in`** — errors log silently via `error_log()` instead.

### Health check
Visit `/health` for a diagnostics page showing:
- PHP version and loaded extensions
- cURL availability and outbound port status
- Supabase DB connectivity and latency

### Logging
All errors on production go to the server's PHP error log. On AeonHost:
`cPanel → Logs → Error Log`

### Common issues
| Symptom | Likely cause |
|---|---|
| HTTP 500 on Apache | `.htaccess` syntax error or `mod_rewrite` not enabled |
| Blank page on Apache | PHP error with `display_errors=Off` — check error log |
| DB queries return `[]` | Supabase unreachable — check `/health` |
| Session not persisting | `session.cookie_secure` requires HTTPS |
| Chat not updating | Check `/api/health-check` — confirms DB and session |

---

## Deployment (AeonHost / cPanel)

1. Upload everything **except** `router.php` (not needed on Apache)
2. Ensure `data/` directory is writable by PHP (`chmod 755`)
3. Ensure `uploads/` directory is writable (`chmod 755`)
4. Set admin credentials via HQ portal → Overview → Site Config
5. Verify at `https://extoarts.in/health`

The `.htaccess` uses **Apache 2.4 syntax** (`Require all denied`).
Apache 2.2 `Order allow,deny` is intentionally absent — it causes HTTP 500 on modern cPanel hosts.

---

## CSS Architecture

All CSS uses custom properties defined in `css/shared.css`:
```css
--primary, --primary-glow     /* brand cyan */
--bg-main, --bg-card          /* dark backgrounds */
--text-main, --text-muted
```

Light mode: `[data-theme="light"]` selector overrides in each file.
Force light mode for testing: append `?theme=light` to any URL.

---

## Key Conventions

- **No build tools.** Plain PHP, CSS, JS. Zero compilation step.
- **CDN for external assets.** Fonts, icons, AOS all loaded via CDN with `rel="preload"`.
- **Cache-busting.** CSS/JS `<link>` and `<script>` tags use `?v=<?= filemtime(...) ?>`.
- **No em-dashes** in visible text (per style guide) — use hyphens.
- **All images on iili.io CDN** (permanent, free). Local `/uploads/` is for new HQ portal uploads only.
