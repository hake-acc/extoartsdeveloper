<?php
declare(strict_types=1);
/**
 * POST /api/auth-session
 * Bridge: exchanges a valid Supabase access_token for a PHP session.
 * Called by oauth-callback.php after OAuth sign-in or email verification.
 *
 * POST body fields:
 *   access_token  — Supabase JWT (required)
 *   flow          — context hint (optional, not used for security decisions):
 *                   'oauth-login'  = came from login page OAuth button
 *                   'oauth-signup' = came from register page OAuth button
 *                   'verify'       = came from email confirmation link
 *   role          — 'editor'|'client' hint passed through from emailRedirectTo (optional)
 */
define('_EXTOARTS_JSON_ENDPOINT', true);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if (!csrf_verify()) {
    respond(['ok' => false, 'error' => 'Security check failed. Please refresh and try again.'], 403);
}

// Detect whether this is a regular form POST or a JSON API call.
// Form POSTs come from oauth-callback.php hidden form submit — bypasses WAF AJAX challenges.
// JSON API calls come from login.php fetch() for email/password login.
$ct = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
$is_form_post = ($ct === 'application/x-www-form-urlencoded' || $ct === 'multipart/form-data');

if ($is_form_post) {
    $access_token = trim($_POST['access_token'] ?? '');
    $flow         = trim($_POST['flow'] ?? '');
    $role_hint    = in_array($_POST['role'] ?? '', ['editor', 'client']) ? $_POST['role'] : '';
} else {
    $body         = json_decode(file_get_contents('php://input'), true);
    $access_token = trim($body['access_token'] ?? '');
    $flow         = trim($body['flow'] ?? '');
    $role_hint    = in_array($body['role'] ?? '', ['editor', 'client']) ? $body['role'] : '';
}

/**
 * Unified responder: JSON in API mode, redirect in form-post mode.
 * In form-post mode: success → redirect to destination; no_account → /register;
 * error → /login?oauth_error=... so the existing login error banner shows it.
 */
function respond(array $payload, int $status = 200): void {
    global $is_form_post, $email;
    if (!$is_form_post) {
        json_out($payload, $status);
        return;
    }
    if (!empty($payload['ok'])) {
        header('Location: ' . ($payload['redirect'] ?? '/dashboard'));
        exit;
    }
    if (!empty($payload['no_account'])) {
        $enc = (isset($email) && $email) ? ('&email=' . urlencode($email)) : '';
        header('Location: /register?notice=oauth_signup' . $enc);
        exit;
    }
    $err = urlencode($payload['error'] ?? 'Authentication failed. Please try again.');
    header('Location: /login?oauth_error=' . $err);
    exit;
}

if (!$access_token) {
    respond(['ok' => false, 'error' => 'Missing access token'], 400);
}

if (!function_exists('curl_init')) {
    respond(['ok' => false, 'error' => 'cURL not available on this server'], 500);
}

// Verify the access token against Supabase and get user info
$ch = curl_init(SUPABASE_URL . '/auth/v1/user');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_CONNECTTIMEOUT => 6,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER     => [
        'apikey: '               . SUPABASE_KEY,
        'Authorization: Bearer ' . $access_token,
    ],
]);
$resp   = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$cerr   = curl_error($ch);
curl_close($ch);

if ($cerr || $status !== 200) {
    $msg = $cerr ?: ('Supabase returned HTTP ' . $status);
    error_log('[ExtoArts] auth-session: token verify failed: ' . $msg);
    respond(['ok' => false, 'error' => 'Token verification failed. Please sign in again.'], 401);
}

$sbUser = json_decode($resp, true);

// Read provider from the verified Supabase token — not from the untrusted POST body.
$provider = strtolower(trim($sbUser['app_metadata']['provider'] ?? 'email'));

if (empty($sbUser['email'])) {
    respond(['ok' => false, 'error' => 'No email address associated with this account. Please use email/password sign-in or ensure your provider shares your email.'], 400);
}

$email = strtolower(trim($sbUser['email']));

// Domain restriction: Gmail and Yahoo only.
// OAuth providers (Google, Discord) are trusted identity sources — accept any email they return.
$trustedProviders = ['google', 'discord'];
if (!in_array($provider, $trustedProviders, true)) {
    if (!preg_match('/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i', $email)) {
        respond(['ok' => false, 'error' => 'Only Gmail (@gmail.com) and Yahoo email addresses are accepted.'], 422);
    }
}

try {
    $existing = db_fetch("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);

    // ── Existing user ─────────────────────────────────────────────────────────
    if ($existing) {
        if ($existing['status'] === 'banned') {
            respond(['ok' => false, 'error' => 'Your account has been suspended. Contact us on Discord.'], 403);
        }
        if (in_array($existing['status'], ['deleted', 'rejected'], true)) {
            respond(['ok' => false, 'error' => 'This account is no longer active. Please contact support.'], 403);
        }

        // Trusted OAuth providers (Google/Discord) prove email ownership.
        // If the existing account is still unverified, mark it verified now.
        if (in_array($provider, $trustedProviders, true) && empty($existing['email_verified'])) {
            db_execute("UPDATE users SET email_verified = TRUE WHERE id = ?", [$existing['id']]);
            $existing['email_verified'] = true;
        }

        db_execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$existing['id']]);
        auth_login_user($existing);
        session_write_close();

        // Email verification flow: show success page
        if ($flow === 'verify') {
            $suffix = ($existing['role'] === 'editor') ? '&role=editor' : '';
            respond(['ok' => true, 'redirect' => '/verify-email?verified=1' . $suffix]);
        }

        respond(['ok' => true, 'redirect' => '/dashboard']);
    }

    // ── New user ──────────────────────────────────────────────────────────────

    // Login-page flows (OAuth or email): do NOT create new accounts.
    // The user needs to register first via /register.
    if (in_array($flow, ['oauth-login', 'email-login'], true)) {
        respond([
            'ok'         => false,
            'no_account' => true,
            'error'      => 'No account is linked to this email. Please sign up first.',
        ], 404);
    }

    // Build username
    $meta = $sbUser['user_metadata'] ?? [];
    $name = trim($meta['full_name'] ?? $meta['name'] ?? $meta['preferred_username'] ?? $meta['username'] ?? '');
    if (!$name) $name = explode('@', $email)[0];

    $regUsername = trim($meta['username'] ?? '');
    $base = $regUsername
        ? preg_replace('/[^a-z0-9._\-]/', '', strtolower($regUsername))
        : preg_replace('/[^a-z0-9._\-]/', '', strtolower(explode('@', $email)[0]));
    $base = strlen($base) < 3 ? substr(md5($email), 0, 8) : $base;
    $base = strlen($base) > 25 ? substr($base, 0, 25) : $base;

    $reserved = ['admin', 'xta_root', 'extoarts_admin'];
    if (in_array(strtolower($base), $reserved, true)) $base = 'user_' . $base;

    $username = $base;
    for ($i = 1; $i <= 99; $i++) {
        if (!db_fetch("SELECT id FROM users WHERE username = ? LIMIT 1", [$username])) break;
        $username = $base . $i;
    }
    if ($i > 99) $username = $base . rand(100, 9999);

    // Random unguessable password hash for OAuth accounts.
    // Users log in via their OAuth provider; this hash is only used if they
    // ever reset their password via the "Forgot password" flow.
    $hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT, ['cost' => 10]);

    // Role: prefer metadata from Supabase signUp (set during registration), fall back to hint
    $metaRole  = in_array($meta['role'] ?? '', ['client', 'editor']) ? $meta['role'] : '';
    $newRole   = $metaRole ?: ($role_hint ?: 'client');
    $newStatus = $newRole === 'editor' ? 'pending' : 'active';

    // Race guard: re-check right before INSERT
    $raceCheck = db_fetch("SELECT id FROM users WHERE email = ? LIMIT 1", [$email]);
    if ($raceCheck) {
        $existing = db_fetch("SELECT * FROM users WHERE id = ? LIMIT 1", [$raceCheck['id']]);
        if ($existing) {
            if ($existing['status'] === 'banned') {
                respond(['ok' => false, 'error' => 'Your account has been suspended.'], 403);
            }
            db_execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$existing['id']]);
            auth_login_user($existing);
            session_write_close();
            if ($flow === 'verify') {
                $suffix = ($existing['role'] === 'editor') ? '&role=editor' : '';
                respond(['ok' => true, 'redirect' => '/verify-email?verified=1' . $suffix]);
            }
            respond(['ok' => true, 'redirect' => '/dashboard']);
        }
    }

    // Trusted OAuth providers (Google/Discord) verify email ownership themselves.
    $evLiteral = in_array($provider, $trustedProviders, true) ? 'TRUE' : 'FALSE';
    $id = db_insert(
        "INSERT INTO users (username, email, password_hash, name, role, status, email_verified, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, $evLiteral, NOW(), NOW())",
        [$username, $email, $hash, $name, $newRole, $newStatus]
    );

    if (!$id) {
        respond(['ok' => false, 'error' => 'Failed to create account. Please try again.'], 500);
    }

    // Record the registration attempt for OAuth providers only.
    // Email-path signups are already counted by api/validate-register.php
    // (which runs before supabase.signUp()), so we skip to avoid double-counting.
    if ($provider !== 'email') {
        try {
            $reg_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            rate_limit_record('register_' . $reg_ip);
        } catch (Throwable) {}
    }

    $newUser = [
        'id'             => $id,
        'username'       => $username,
        'email'          => $email,
        'name'           => $name,
        'avatar'         => $meta['avatar_url'] ?? '',
        'role'           => $newRole,
        'status'         => $newStatus,
        'email_verified' => in_array($provider, $trustedProviders, true),
    ];

    auth_login_user($newUser);

    try {
        require_once __DIR__ . '/../includes/notify.php';
        notify_new_registration($username, $email, $newRole);
    } catch (Throwable) {}

    session_write_close();

    // Verify flow for a brand-new user (edge case: email confirm for OAuth signup)
    if ($flow === 'verify') {
        $suffix = ($newRole === 'editor') ? '&role=editor' : '';
        respond(['ok' => true, 'redirect' => '/verify-email?verified=1' . $suffix]);
    }

    $redirect = $newRole === 'editor' ? '/apply?notice=registered' : '/dashboard?notice=welcome';
    respond(['ok' => true, 'redirect' => $redirect]);

} catch (Throwable $e) {
    error_log('[ExtoArts] auth-session error: ' . $e->getMessage());
    $msg = $e->getMessage();
    if (str_contains($msg, 'duplicate') || str_contains($msg, 'unique')) {
        try {
            $raced = db_fetch("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);
            if ($raced && !in_array($raced['status'], ['banned', 'deleted', 'rejected'], true)) {
                db_execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$raced['id']]);
                auth_login_user($raced);
                session_write_close();
                if ($flow === 'verify') {
                    $suffix = ($raced['role'] === 'editor') ? '&role=editor' : '';
                    respond(['ok' => true, 'redirect' => '/verify-email?verified=1' . $suffix]);
                }
                $redirect = ($raced['role'] === 'editor') ? '/apply?notice=registered' : '/dashboard?notice=welcome';
                respond(['ok' => true, 'redirect' => $redirect]);
            }
        } catch (Throwable) {}
        respond(['ok' => false, 'error' => 'An account with this email already exists. Please sign in.'], 409);
    } else {
        respond(['ok' => false, 'error' => 'Database error while creating your account. Please try again.'], 500);
    }
}
