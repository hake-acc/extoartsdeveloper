<?php
declare(strict_types=1);
/**
 * ExtoArts - Authentication & Security
 * All DB operations use PostgreSQL via db.php (Supabase Session Pooler)
 */

// ── Shared low-level helpers (declared before use; PHP hoists top-level fns) ──

/** Detect HTTPS, respecting the Cloudflare/proxy X-Forwarded-Proto header. */
function _is_https(): bool {
    $proto = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? $_SERVER['REQUEST_SCHEME'] ?? '');
    return $proto === 'https' || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
}

/** Absolute filesystem path to the rate-limit file for a given key. */
function _rl_file(string $key): string {
    return sys_get_temp_dir() . '/ea_rl_' . md5($key) . '.json';
}

// ── Session timeout constants ──────────────────────────────────────────────────
const SESSION_ABSOLUTE_TTL = 86400; // 24 h  — max session lifetime regardless of activity
const SESSION_ROTATE_AFTER = 1800;  // 30 min — how often to regenerate the session ID

// ── Session startup ───────────────────────────────────────────────────────────
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.gc_maxlifetime', 7200);
    if (_is_https()) ini_set('session.cookie_secure', 1);
    session_start();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/enums.php';

$_cfg = $GLOBALS['_site_cfg'] ?? [];

if (!defined('ADMIN_USERNAME')) {
    define('ADMIN_USERNAME',      $_cfg['admin']['username']      ?? 'extoarts_admin');
    define('ADMIN_PASSWORD_HASH', $_cfg['admin']['password_hash'] ?? password_hash('ChangeMe!2026', PASSWORD_BCRYPT, ['cost' => 10]));
}

if (!defined('TURNSTILE_SITE_KEY')) {
    define('TURNSTILE_SITE_KEY',   $_cfg['turnstile']['site_key']   ?? '1x00000000000000000000AA');
    define('TURNSTILE_SECRET_KEY', $_cfg['turnstile']['secret_key'] ?? '1x0000000000000000000000000000000AA');
}

if (!defined('BASE_URL')) {
    define('BASE_URL', (_is_https() ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
}

// ── CSRF ──────────────────────────────────────────────────────────────────────
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_verify(): bool {
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    return hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token()) . '">';
}

// ── Cloudflare Turnstile ──────────────────────────────────────────────────────
function turnstile_verify(#[\SensitiveParameter] string $token): bool {
    $secret = TURNSTILE_SECRET_KEY;
    if (empty($secret)) return false;

    // Cloudflare test secret always-passes key - skip network call
    if ($secret === '1x0000000000000000000000000000000AA') return true;

    // Bypass on non-production domains: Turnstile keys are registered to extoarts.in only.
    // Any other host (Replit dev, localhost, staging) gets a free pass so you can test login.
    // This MUST run before the empty($token) check because the widget may fail to generate
    // a token on unlisted domains, leaving the field empty.
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    $host = explode(':', $host)[0]; // strip port
    if ($host !== 'extoarts.in' && $host !== 'www.extoarts.in') {
        error_log('[ExtoArts] Turnstile bypassed on non-production host: ' . $host);
        return true;
    }

    // On production, require a token
    if (empty($token)) return false;

    $url     = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $payload = http_build_query([
        'secret'   => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $result = false;

    // Attempt 1: cURL (works even when allow_url_fopen = Off)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 6,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            error_log('[ExtoArts] Turnstile cURL error: ' . curl_error($ch));
            $result = false;
        }
        curl_close($ch);
    }

    // Attempt 2: file_get_contents fallback
    if (!$result && ini_get('allow_url_fopen')) {
        $ctx    = stream_context_create(['http' => [
            'method'        => 'POST',
            'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content'       => $payload,
            'timeout'       => 6,
            'ignore_errors' => true,
        ]]);
        $result = @file_get_contents($url, false, $ctx);
    }

    // Both methods failed - log and fail-open to avoid locking out all users
    if (!$result) {
        error_log('[ExtoArts] Turnstile verification unreachable - failing open. Check outbound HTTPS from server.');
        return true;
    }

    $json = json_decode($result, true);
    return !empty($json['success']);
}

// ── Rate Limiting (SQLite + file fallback) ─────────────────────────────────────
function rate_limit_check(string $key, int $max = 5, int $window = 300): bool {
    try {
        $row = db_fetch("SELECT attempts, first_attempt FROM login_attempts WHERE attempt_key = ? LIMIT 1", [$key]);
        if ($row) {
            if (time() - (int)$row['first_attempt'] > $window) {
                db_execute("DELETE FROM login_attempts WHERE attempt_key = ?", [$key]);
                return true;
            }
            if ((int)$row['attempts'] >= $max) return false;
        }
        return true;
    } catch (Throwable $e) {
        // File fallback
        $f = _rl_file($key);
        if (is_file($f)) {
            $d = json_decode(file_get_contents($f), true);
            if ($d && (time() - $d['first']) <= $window && $d['count'] >= $max) return false;
        }
        return true;
    }
}

function rate_limit_record(string $key): void {
    try {
        db_execute(
            "INSERT INTO login_attempts (attempt_key, attempts, first_attempt) VALUES (?, 1, ?)
             ON CONFLICT(attempt_key) DO UPDATE SET attempts = attempts + 1",
            [$key, time()]
        );
    } catch (Throwable $e) {
        $f = _rl_file($key);
        $d = is_file($f) ? (json_decode(file_get_contents($f), true) ?: []) : [];
        $d['first'] = $d['first'] ?? time();
        $d['count'] = ($d['count'] ?? 0) + 1;
        file_put_contents($f, json_encode($d), LOCK_EX);
    }
}

function rate_limit_clear(string $key): void {
    try {
        db_execute("DELETE FROM login_attempts WHERE attempt_key = ?", [$key]);
    } catch (Throwable $e) {
        $f = _rl_file($key);
        if (is_file($f)) @unlink($f);
    }
}

// ── Session Hardening ─────────────────────────────────────────────────────────
function session_harden(): void {
    $fp = hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? 'ua');

    if (empty($_SESSION['_fingerprint'])) {
        $_SESSION['_fingerprint']  = $fp;
        $_SESSION['_created']      = time();
        $_SESSION['_abs_created']  = time();
    } else {
        if (!hash_equals((string)($_SESSION['_fingerprint'] ?? ''), $fp)) {
            session_unset();
            $_SESSION['_fingerprint'] = $fp;
            $_SESSION['_created']     = time();
            $_SESSION['_abs_created'] = time();
            return;
        }
        // Absolute session lifetime: 24 hours regardless of activity.
        // Only enforced for authenticated sessions to avoid redirect loops on /login.
        // If _abs_created is missing (legacy session), set it now rather than defaulting to 0
        // which would cause an instant logout loop.
        if (!isset($_SESSION['_abs_created'])) $_SESSION['_abs_created'] = time();
        if (isset($_SESSION['user']) && time() - $_SESSION['_abs_created'] > SESSION_ABSOLUTE_TTL) {
            auth_logout();
            if (defined('_EXTOARTS_JSON_ENDPOINT')) {
                http_response_code(401);
                header('Content-Type: application/json; charset=UTF-8');
                header('Cache-Control: no-store');
                header('X-Content-Type-Options: nosniff');
                echo json_encode(['ok' => false, 'error' => 'Session expired. Please sign in again.', 'expired' => true]);
                exit;
            }
            header('Location: /login?expired=1');
            exit;
        }
        // Rotate session ID every 30 minutes (keeps _abs_created intact)
        if (time() - ($_SESSION['_created'] ?? 0) > SESSION_ROTATE_AFTER) {
            session_regenerate_id(true);
            $_SESSION['_created'] = time();
        }
    }
}

// ── Auth Helpers ──────────────────────────────────────────────────────────────
function auth_user(): ?array {
    return $_SESSION['user'] ?? null;
}

function auth_require(string ...$roles): void {
    $user = auth_user();
    if (!$user) {
        $target = urlencode($_SERVER['REQUEST_URI'] ?? '/dashboard');
        header('Location: /login?next=' . $target);
        exit;
    }
    // Email verification enforcement.
    // null = column not yet in schema (pre-migration) or old session - treat as verified.
    // Admin always bypasses verification.
    if ($user['role'] !== UserRole::Admin->value) {
        $verified = $user['email_verified'] ?? null;
        if ($verified !== null && !$verified) {
            if (defined('_EXTOARTS_JSON_ENDPOINT')) {
                http_response_code(403);
                header('Content-Type: application/json; charset=UTF-8');
                header('Cache-Control: no-store');
                echo json_encode(['ok' => false, 'error' => 'Email not verified.', 'unverified' => true]);
                exit;
            }
            $ev_email = rawurlencode($user['email'] ?? '');
            header('Location: /verify-email?email=' . $ev_email . '&notice=unverified');
            exit;
        }
    }
    if (!empty($roles) && !in_array($user['role'], $roles, true)) {
        http_response_code(403);
        include __DIR__ . '/../404.php';
        exit;
    }
}

function auth_login_user(array $user): void {
    session_regenerate_id(true);
    $_SESSION['user']         = $user;
    $_SESSION['_fingerprint'] = hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? 'ua');
    $_SESSION['_created']     = time();
    // Preserve existing _abs_created (24h window started when session was created)
    // or initialise it now if not present (prevents instant logout on legacy sessions)
    if (empty($_SESSION['_abs_created'])) {
        $_SESSION['_abs_created'] = time();
    }
}

function auth_logout(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 3600, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

// ── Portal CSP ────────────────────────────────────────────────────────────────
// Defined here (not only in router.php) so secure_headers() works when portal
// pages are served directly by Apache without going through router.php.
if (!defined('_CSP_PORTAL')) {
    define('_CSP_PORTAL',
        "default-src 'self'; " .
        "script-src 'self' 'unsafe-inline' https://esm.sh https://cdnjs.cloudflare.com https://challenges.cloudflare.com; " .
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " .
        "font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com data:; " .
        "img-src 'self' data: blob: https://iili.io https://i.ibb.co https://imgbb.com https://freeimage.host; " .
        "connect-src 'self' https://bigopvwtprisrfhuayxs.supabase.co wss://bigopvwtprisrfhuayxs.supabase.co; " .
        "frame-src 'self' https://challenges.cloudflare.com; " .
        "frame-ancestors 'self'; " .
        "object-src 'none'; " .
        "base-uri 'self'; " .
        "form-action 'self'"
    );
}

// ── Secure Headers ────────────────────────────────────────────────────────────
// Call at the top of every page that requires authentication.
// $portal = true  => portal pages (dashboard, chat, apply, hq)
// $portal = false => public auth pages (login, register)
function secure_headers(bool $portal = false): void {
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');

    if ($portal) {
        header('Cache-Control: no-store, no-cache, must-revalidate, private');
        header('Pragma: no-cache');
        header("Content-Security-Policy: " . _CSP_PORTAL);
    }
}

// ── Safe URL ──────────────────────────────────────────────────────────────────
// Use this for any user-supplied URL rendered in an href attribute.
// htmlspecialchars() alone won't block javascript: or data: URIs.
function safe_url(string $url, string $fallback = '#'): string {
    $url = trim($url);
    if ($url === '') return $fallback;
    if (!preg_match('/^https?:\/\//i', $url)) return $fallback;
    return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
}

// ── Username sanitiser ────────────────────────────────────────────────────────
function sanitise_username(string $u): string {
    return preg_replace('/[^a-z0-9._\-]/', '', strtolower(trim($u)));
}

// ── Register ──────────────────────────────────────────────────────────────────
function register_user(string $username, string $email, #[\SensitiveParameter] string $password, string $role = 'client'): array {
    $username = sanitise_username($username);
    $email    = strtolower(trim($email));
    $role     = (UserRole::tryFrom($role) !== null && $role !== UserRole::Admin->value) ? $role : UserRole::Client->value;

    if (in_array(strtolower($username), ['admin', 'xta_root', 'extoarts_admin'], true))
        return ['ok' => false, 'error' => 'That username is reserved.'];
    if (strlen($username) < 3 || strlen($username) > 30)
        return ['ok' => false, 'error' => 'Username must be 3-30 characters (letters, numbers, . _ - only).'];
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        return ['ok' => false, 'error' => 'Please enter a valid email address.'];
    if (!preg_match('/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i', $email))
        return ['ok' => false, 'error' => 'Only Gmail and Yahoo email addresses are accepted.'];
    if (strlen($password) < 8)
        return ['ok' => false, 'error' => 'Password must be at least 8 characters.'];

    $hash   = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    $status = ($role === UserRole::Client->value) ? UserStatus::Active->value : UserStatus::Pending->value;

    try {
        $existing = db_fetch("SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1", [$username, $email]);
        if ($existing) return ['ok' => false, 'error' => 'That username or email is already registered.'];

        $id = db_insert(
            "INSERT INTO users (username, email, password_hash, name, role, status, email_verified, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, FALSE, NOW(), NOW())",
            [$username, $email, $hash, $username, $role, $status]
        );

        return ['ok' => true, 'user' => [
            'id' => $id, 'username' => $username, 'email' => $email,
            'name' => $username, 'avatar' => '', 'role' => $role, 'status' => $status,
            'email_verified' => false,
        ]];
    } catch (Throwable $e) {
        $msg = $e->getMessage();
        error_log('[ExtoArts] register_user error: ' . $msg);
        // Surface a readable diagnosis instead of a generic message
        if (str_contains($msg, 'pgsql') || str_contains($msg, 'driver')) {
            return ['ok' => false, 'error' => 'Database driver not available (pdo_pgsql). Contact support or visit /health for diagnostics.'];
        }
        if (str_contains($msg, 'Connection refused') || str_contains($msg, 'could not connect') || str_contains($msg, 'timeout')) {
            return ['ok' => false, 'error' => 'Cannot reach the database server. The host may be blocking port 5432. Visit /health for diagnostics.'];
        }
        if (str_contains($msg, 'duplicate') || str_contains($msg, 'unique')) {
            return ['ok' => false, 'error' => 'That username or email is already registered.'];
        }
        return ['ok' => false, 'error' => 'Registration failed: ' . $msg];
    }
}

// ── Email Verification ────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random 64-char hex token, store it in the users
 * table with a 24-hour expiry, and return the raw token string.
 * Called from register.php immediately after a new account is created.
 */
function generate_email_verify_token(int $user_id): string {
    $token   = bin2hex(random_bytes(32)); // 64 hex chars
    $expires = date('Y-m-d H:i:s', time() + 86400); // 24 hours
    try {
        db_execute(
            "UPDATE users SET email_verify_token = ?, email_verify_expires = ? WHERE id = ?",
            [$token, $expires, $user_id]
        );
    } catch (Throwable $e) {
        // Likely pre-migration (columns don't exist yet). Log and continue.
        error_log('[ExtoArts] generate_email_verify_token error: ' . $e->getMessage());
    }
    return $token;
}

/**
 * Validate and consume a verification token.
 *
 * Returns:
 *   - Full user row array on success (email now marked verified, token cleared).
 *   - ['__expired' => true, 'email' => '...'] when token is past the 24-hour window.
 *   - null when token is missing, invalid, or not found in the database.
 */
function consume_email_verify_token(string $token): ?array {
    $token = trim($token);
    if (!$token || strlen($token) !== 64 || !ctype_xdigit($token)) return null;
    try {
        $user = db_fetch(
            "SELECT * FROM users WHERE email_verify_token = ? LIMIT 1",
            [$token]
        );
        if (!$user) return null;

        // Expiry check done in PHP - avoids PostgREST SQL function expression limitation
        $expires_str = $user['email_verify_expires'] ?? '';
        $expires     = $expires_str ? strtotime($expires_str) : 0;
        if (!$expires || time() > $expires) {
            return ['__expired' => true, 'email' => $user['email'] ?? ''];
        }

        // Mark account as verified and consume the token
        db_execute(
            "UPDATE users SET email_verified = TRUE, email_verify_token = NULL, email_verify_expires = NULL WHERE id = ?",
            [(int)$user['id']]
        );
        $user['email_verified']       = true;
        $user['email_verify_token']   = null;
        $user['email_verify_expires'] = null;
        return $user;
    } catch (Throwable $e) {
        error_log('[ExtoArts] consume_email_verify_token error: ' . $e->getMessage());
        return null;
    }
}

// ── Login ─────────────────────────────────────────────────────────────────────
// Dummy hash used when user is not found — ensures password_verify() always runs
// so response time stays constant regardless of whether the account exists.
// (bcrypt cost-10 hash of a random 16-byte value; never matches any real password)
const _DUMMY_HASH = '$2y$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

function login_user_pw(string $username, #[\SensitiveParameter] string $password): ?array {
    $is_email = str_contains($username, '@');
    $username = $is_email ? strtolower(trim($username)) : sanitise_username($username);

    try {
        $row = db_fetch(
            "SELECT * FROM users WHERE (username = ? OR email = ?) AND role != ? LIMIT 1",
            [$username, $username, UserRole::Admin->value]
        );

        if (!$row) {
            // Always run a full bcrypt compare to prevent timing-based username enumeration.
            password_verify($password, _DUMMY_HASH);
            return null;
        }
        if ($row['status'] === UserStatus::Banned->value) return ['__banned' => true];
        if (!password_verify($password, $row['password_hash'] ?? '')) return null;

        // Block accounts whose email has not been verified yet.
        // null = column not yet in schema (pre-migration) - treat as verified for backwards compat.
        $verified = $row['email_verified'] ?? null;
        if ($verified !== null && !$verified) {
            return ['__unverified' => true, 'email' => $row['email'] ?? ''];
        }

        db_execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$row['id']]);
        return $row;
    } catch (Throwable $e) {
        $msg = $e->getMessage();
        error_log('[ExtoArts] login_user_pw error: ' . $msg);
        // Store a readable DB error in session so login.php can display it
        $_SESSION['__db_error'] = $msg;
        return null;
    }
}

session_harden();
