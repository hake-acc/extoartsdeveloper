<?php
declare(strict_types=1);
/**
 * POST /api/validate-register
 * Server-side validation for the registration form.
 * Called via AJAX before Supabase signUp() so errors are caught without
 * burning a Supabase auth attempt.
 * Returns JSON { ok: bool, errors: string[] }
 */
define('_EXTOARTS_JSON_ENDPOINT', true);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'errors' => ['Method not allowed']], 405);
}

if (!csrf_verify()) {
    json_out(['ok' => false, 'errors' => ['Security check failed. Please refresh and try again.']], 403);
}

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($body['username'] ?? '');
$email    = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';
$confirm  = $body['confirm'] ?? '';
$role     = ($body['role'] ?? '') === 'editor' ? 'editor' : 'client';
$ts_token = trim($body['ts_token'] ?? '');
$agreed   = !empty($body['agreed_tos']);

if (!$agreed) {
    json_out(['ok' => false, 'errors' => ['You must agree to the Terms of Service to register.']]);
}

if (!turnstile_verify($ts_token)) {
    json_out(['ok' => false, 'errors' => ['Human verification failed. Please reload the page and try again.']]);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!rate_limit_check('register_' . $ip, 5, 3600)) {
    json_out(['ok' => false, 'errors' => ['Too many registration attempts from your location. Please wait an hour.']]);
}

$errors = [];

if (!$username) {
    $errors[] = 'Username is required.';
} elseif (in_array(strtolower($username), ['admin', 'xta_root', 'extoarts_admin'], true)) {
    $errors[] = 'That username is reserved. Please choose a different one.';
} elseif (strlen($username) < 3 || strlen($username) > 30) {
    $errors[] = 'Username must be 3-30 characters.';
} elseif (!preg_match('/^[a-zA-Z0-9._\-]+$/', $username)) {
    $errors[] = 'Username may only contain letters, numbers, dots, dashes, and underscores.';
}

if (!$email) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
} elseif (!preg_match('/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i', $email)) {
    $errors[] = 'Only Gmail (@gmail.com) and Yahoo (@yahoo.com) addresses are accepted.';
}

if (!$password) {
    $errors[] = 'Password is required.';
} elseif (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters.';
} elseif ($password !== $confirm) {
    $errors[] = 'Passwords do not match.';
}

if (!empty($errors)) {
    json_out(['ok' => false, 'errors' => $errors]);
}

try {
    $existing = db_fetch(
        "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
        [sanitise_username($username), $email]
    );
    if ($existing) {
        json_out(['ok' => false, 'errors' => ['That username or email is already registered.']]);
    }
} catch (Throwable $e) {
    error_log('[ExtoArts] validate-register DB check failed: ' . $e->getMessage());
}

// Record every validated attempt so the rate limit counts enumeration probes.
// OAuth registrations are recorded separately in auth-session.php.
rate_limit_record('register_' . $ip);

json_out(['ok' => true, 'errors' => []]);
