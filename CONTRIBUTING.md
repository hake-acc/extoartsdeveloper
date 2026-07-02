# Contributing to ExtoArts

## Setup

```bash
# Requires PHP 8.2+
php --version

# Start dev server
php -S 0.0.0.0:5000 router.php

# Verify everything works
curl -s http://localhost:5000/health | php -r "echo json_encode(json_decode(file_get_contents('php://stdin')), JSON_PRETTY_PRINT);"
```

**No npm, no composer, no build step.** The project is deliberately dependency-free.

---

## Coding Standards

### PHP

**Naming**
```php
// Functions: snake_case, verb-first, describe what they DO
function auth_require(string ...$roles): void { }
function db_fetch_one(string $sql, array $params = []): ?array { }
function csrf_token(): string { }

// Private/internal helpers: leading underscore
function _sb_http(string $method, string $url): array { }
function _rl_file(string $key): string { }

// Constants: SCREAMING_SNAKE_CASE
define('SUPABASE_URL', '...');
const SESSION_ABSOLUTE_TTL = 86400;

// Variables: $snake_case, descriptive
$user_id = (int)($user['id'] ?? 0);
$redirect_url = '/dashboard';
```

**Early returns over nesting**
```php
// GOOD - guard clause exits early, main logic is flat
function process_order(array $data): array {
    if (empty($data['title'])) return ['ok' => false, 'error' => 'Title required'];
    if (empty($data['budget'])) return ['ok' => false, 'error' => 'Budget required'];

    // happy path at root indentation
    $order_id = db_execute("INSERT INTO orders ...", [...]);
    return ['ok' => true, 'id' => $order_id];
}

// AVOID - deep nesting
function process_order(array $data): array {
    if (!empty($data['title'])) {
        if (!empty($data['budget'])) {
            // main logic buried at 2+ levels
        }
    }
}
```

**Type hints everywhere**
```php
// GOOD
function auth_user(): ?array { }
function rate_limit_check(string $key, int $max = 5, int $window = 300): bool { }

// AVOID
function auth_user() { }      // return type unknown
function check($key, $max) { } // parameter types unknown
```

**Explicit error handling**
```php
// GOOD - log context, return structured error
$row = db_fetch_one("SELECT * FROM orders WHERE id = ?", [$order_id]);
if ($row === null) {
    error_log("[ExtoArts] order_load: order $order_id not found for user $uid");
    json_err("Order not found", 404);
}

// AVOID - silent failure
$row = db_fetch_one("SELECT * FROM orders WHERE id = ?", [$order_id]);
// ... code continues assuming $row exists
```

**Output escaping**
```php
// Always escape before HTML output
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');

// Use the shorthand in templates
<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
```

---

### Adding a New Page

**1. Create the page file**
```
pages/my-new-page.php   ← public page
portal/my-portal.php    ← auth-required page
```

**2. Standard page template**
```php
<?php
// Public page (no auth required)
$page_title  = "Page Title | ExtoArts";
$page_desc   = "Meta description 142-158 chars.";
$breadcrumbs = [['name' => 'Page Name', 'url' => '/my-page']];
include __DIR__ . '/../templates/header.php';
?>

<!-- page HTML here -->

<?php include __DIR__ . '/../templates/footer.php'; ?>
```

```php
<?php
// Auth-required portal page
require_once __DIR__ . '/../includes/auth.php';
secure_headers(true);           // sends portal CSP headers
auth_require('client', 'admin'); // redirect to /login if not authed

// page logic
?>
```

**3. Register the route in `index.php`**
```php
$map = [
    // ...existing routes...
    'my-page' => 'p:my-new-page',     // pages/my-new-page.php
    'my-portal' => 'r:my-portal',     // portal/my-portal.php
];
```

**4. No `.htaccess` changes needed.** The front controller handles everything.

---

### Adding a New API Endpoint

```
api/my-action.php
```

```php
<?php
/**
 * ExtoArts API - My Action
 * POST /api/my-action  { field1, field2 }
 * Returns { ok: true, result: ... }
 */
define('_EXTOARTS_JSON_ENDPOINT', true); // enables JSON error format in error-handler.php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../api/_api.php';

auth_require('client');                   // enforce role
csrf_check();                             // verify CSRF token

$body = api_absorb_json();                // parse JSON or form body
$field = trim($body['field1'] ?? '');

// Guard clauses first
if ($field === '') json_err('field1 is required', 400);

// Business logic
$result = db_execute("INSERT INTO ...", [...]);

json_ok(['result' => $result]);           // sends { ok: true, result: ... }
```

The route is automatically available at `/api/my-action` — no registration needed.

---

### CSS Conventions

```css
/* Use CSS custom properties — never hardcode colours */
color: var(--text-main);
background: var(--bg-card);
border-color: var(--primary);

/* Add light mode overrides at the bottom of the relevant file */
[data-theme="light"] .my-component {
    background: var(--bg-card);
    color: var(--text-main);
}

/* BEM-ish class names for components */
.service-card { }
.service-card__title { }
.service-card--featured { }

/* Fluid sizing — no fixed breakpoints */
font-size: clamp(1rem, 2.5vw, 1.5rem);
padding: min(4rem, 8vw);
```

---

### JavaScript Conventions

```javascript
// Wrap everything to avoid polluting global scope
(function () {
    'use strict';

    // Guard: only run if the element exists on this page
    const el = document.getElementById('my-element');
    if (!el) return;

    // Descriptive variable names
    const isMenuOpen = false;
    const ANIMATION_DURATION_MS = 300;

    function handleMenuToggle(event) {
        event.preventDefault();
        // ...
    }

    el.addEventListener('click', handleMenuToggle);
})();
```

```javascript
// Fire after DOM is ready via the custom event (dispatched by loader.js)
document.addEventListener('extoReady', function () {
    // safe to query DOM here
});
```

---

## File Size Guidelines

| Type | Soft limit | Action if exceeded |
|---|---|---|
| PHP page file | 300 lines | Extract repeated sections to `templates/` partials |
| PHP include | 500 lines | Split into focused modules |
| CSS file | 400 lines | Split by concern into a new file in `css/` |
| JS file | 200 lines | Extract a new file in `js/`, load it in `templates/footer.php` |

`portal/dashboard.php` is deliberately large (~1800 lines) because it serves three distinct user roles in one file. Do not split it without careful testing.

---

## Before Pushing to AeonHost

- [ ] Test all routes locally: `php -S 0.0.0.0:5000 router.php`
- [ ] Visit `/health` — confirm DB connectivity
- [ ] Check `/sitemap.xml` renders valid XML
- [ ] Verify no PHP errors in browser (error overlay shows in dev)
- [ ] Confirm `data/config.json` is NOT committed with real credentials
- [ ] Confirm all images reference `iili.io` CDN, not local paths

---

## Secrets Checklist

| File | Contains | Action |
|---|---|---|
| `data/config.json` | Admin password hash, Turnstile keys | Never commit real values to git |
| `includes/db.php` | Supabase URL + anon key | Rotate if exposed |
| `includes/notify.php` | Discord webhook URL | Rotate if exposed |

---

## Reporting Bugs

1. Reproduce the error and click **Copy Error Report** in the dev overlay
2. Paste in Discord **#bug-reports** with a short description of what you were doing
3. Include the URL and whether you were logged in
