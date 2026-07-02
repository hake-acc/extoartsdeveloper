<?php
declare(strict_types=1);
/**
 * ExtoArts - Server Health & Auth Diagnostic
 * Access: /health?token=YOUR_HEALTH_CHECK_TOKEN
 * Or log in as admin, then visit /health
 */

require_once __DIR__ . '/../includes/config.php';

$token      = $_GET['token'] ?? '';
$cfg_token  = $GLOBALS['_site_cfg']['health_check_token'] ?? '';
$authed_by_token   = ($cfg_token && hash_equals($cfg_token, $token));
$authed_by_session = false;
if (!$authed_by_token) {
    require_once __DIR__ . '/../includes/auth.php';
    $u = auth_user();
    $authed_by_session = ($u && ($u['role'] ?? '') === 'admin');
}

if (!$authed_by_token && !$authed_by_session) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "403 Forbidden\n";
    echo "Pass ?token=YOUR_HEALTH_CHECK_TOKEN or log in as admin.\n";
    echo "Token is in data/config.json > health_check_token\n";
    exit;
}

require_once __DIR__ . '/../includes/db.php';

header('Content-Type: text/plain; charset=UTF-8');
$line = str_repeat('-', 60);

echo "ExtoArts Server Health Check\n";
echo date('Y-m-d H:i:s T') . "\n";
echo $line . "\n\n";

// ── PHP Environment ───────────────────────────────────────────────────────────
echo "PHP VERSION\n";
echo "  Version: " . PHP_VERSION . "\n";
echo "  SAPI:    " . PHP_SAPI . "\n";
echo "  OS:      " . PHP_OS . "\n\n";

// ── Required extensions ───────────────────────────────────────────────────────
echo "EXTENSIONS\n";
$needed = ['pdo', 'curl', 'json', 'openssl', 'mbstring', 'session'];
foreach ($needed as $ext) {
    $ok = extension_loaded($ext);
    echo sprintf("  %-12s %s\n", $ext, $ok ? 'LOADED' : 'MISSING <-- PROBLEM');
}
// pdo_pgsql / pgsql are no longer required but note their status
foreach (['pdo_pgsql', 'pgsql'] as $ext) {
    $ok = extension_loaded($ext);
    echo sprintf("  %-12s %s\n", $ext, $ok ? 'LOADED (not required)' : 'not loaded (not required - using REST API)');
}
echo "\n";

// ── Network capabilities ──────────────────────────────────────────────────────
echo "NETWORK\n";
echo "  allow_url_fopen: " . (ini_get('allow_url_fopen') ? 'ON' : 'OFF') . "\n";
echo "  cURL available:  " . (function_exists('curl_init') ? 'YES' : 'NO') . "\n";

// Test outbound HTTPS to Supabase REST
$https_ok  = false;
$https_err = '';
if (function_exists('curl_init')) {
    $ch = curl_init(SUPABASE_URL . '/rest/v1/');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
        ],
        CURLOPT_NOBODY         => true,
    ]);
    curl_exec($ch);
    $https_status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $https_ok     = (curl_errno($ch) === 0 && $https_status < 500);
    $https_err    = curl_error($ch) ?: ($https_status >= 500 ? 'HTTP ' . $https_status : '');
    curl_close($ch);
}
echo "  Supabase HTTPS:  " . ($https_ok ? 'OK' : 'BLOCKED - ' . $https_err) . "\n";

// Informational: check port 5432 (not required now, just FYI)
set_error_handler(function() {});
$sock = @fsockopen(DB_HOST, 5432, $errno, $errstr, 3);
restore_error_handler();
if ($sock) { fclose($sock); $sock_ok = true; $sock_err = ''; }
else { $sock_ok = false; $sock_err = "errno={$errno} {$errstr}"; }
echo "  Port 5432 (info only, not required): " . ($sock_ok ? 'reachable' : 'blocked - ' . $sock_err) . "\n\n";

// ── Database - REST API (php_exec RPC) ────────────────────────────────────────
echo "DATABASE (Supabase via REST API)\n";
echo "  Project: bigopvwtprisrfhuayxs\n";
echo "  Endpoint: " . SUPABASE_URL . "/rest/v1/rpc/php_exec\n";

$db_ok  = false;
$db_err = '';
try {
    // Test the php_exec function exists and works
    $result = _sb_rpc('SELECT version() AS v, NOW() AS ts', []);
    if (!empty($result[0]['v'])) {
        $db_ok = true;
        echo "  RPC bridge: OK\n";
        echo "  PG version: " . trim(explode(',', $result[0]['v'])[0]) . "\n";
        echo "  Server time: " . $result[0]['ts'] . "\n";
    } else {
        echo "  RPC bridge: Unexpected response - " . json_encode($result) . "\n";
    }

    if ($db_ok) {
        $tables = ['users', 'login_attempts', 'editor_applications', 'orders', 'audit_log', 'notifications'];
        echo "  Tables:\n";
        foreach ($tables as $t) {
            try {
                $cnt = _sb_rpc("SELECT COUNT(*) AS n FROM {$t}", []);
                $n   = $cnt[0]['n'] ?? '?';
                echo "    {$t}: EXISTS ({$n} rows)\n";
            } catch (Throwable $e) {
                echo "    {$t}: MISSING or ERROR - " . $e->getMessage() . "\n";
            }
        }
    }
} catch (Throwable $e) {
    $db_err = $e->getMessage();
    echo "  RPC bridge: FAILED\n";
    echo "  Error: " . $db_err . "\n";
    echo "\n  DIAGNOSIS:\n";
    if (!$https_ok) {
        echo "  -> Outbound HTTPS to Supabase is blocked. Contact your host.\n";
    } elseif (str_contains($db_err, '404') || str_contains($db_err, 'does not exist') || str_contains($db_err, 'php_exec')) {
        echo "  -> The php_exec function is not installed in your Supabase project.\n";
        echo "     Run setup-supabase-rpc.sql in the Supabase SQL Editor:\n";
        echo "     https://supabase.com/dashboard/project/bigopvwtprisrfhuayxs/sql/new\n";
    } elseif (str_contains($db_err, '401') || str_contains($db_err, '403') || str_contains($db_err, 'JWT')) {
        echo "  -> API key rejected. Update SUPABASE_KEY in db.php with the service_role key\n";
        echo "     from: https://supabase.com/dashboard/project/bigopvwtprisrfhuayxs/settings/api\n";
    } else {
        echo "  -> Unexpected error. Check SUPABASE_KEY and Supabase project status.\n";
    }
}
echo "\n";

// ── Session ───────────────────────────────────────────────────────────────────
echo "SESSION\n";
echo "  Handler:       " . ini_get('session.save_handler') . "\n";
echo "  Save path:     " . session_save_path() . "\n";
echo "  Cookie secure: " . (ini_get('session.cookie_secure') ? 'ON' : 'OFF') . "\n";
echo "  Status: " . (session_status() === PHP_SESSION_ACTIVE ? 'ACTIVE' : 'NOT ACTIVE') . "\n\n";

// ── Config ────────────────────────────────────────────────────────────────────
echo "CONFIG (data/config.json)\n";
$cfg = $GLOBALS['_site_cfg'] ?? [];
echo "  admin.username:       " . ($cfg['admin']['username'] ?? 'NOT SET') . "\n";
echo "  admin.password_hash:  " . (isset($cfg['admin']['password_hash']) ? 'SET (' . strlen($cfg['admin']['password_hash']) . ' chars)' : 'NOT SET') . "\n";
echo "  turnstile.site_key:   " . (isset($cfg['turnstile']['site_key']) ? substr($cfg['turnstile']['site_key'], 0, 8) . '...' : 'NOT SET') . "\n";
echo "  turnstile.secret_key: " . (isset($cfg['turnstile']['secret_key']) ? 'SET' : 'NOT SET') . "\n";
echo "  health_check_token:   " . (isset($cfg['health_check_token']) ? 'SET' : 'NOT SET') . "\n\n";

// ── Summary ───────────────────────────────────────────────────────────────────
echo $line . "\n";
echo "SUMMARY\n";
$issues = [];
if (!extension_loaded('curl'))  $issues[] = "curl extension not loaded - required for Supabase REST";
if (!$https_ok)                 $issues[] = "Supabase HTTPS unreachable: " . $https_err;
if (!$db_ok)                    $issues[] = "Database RPC failed: " . $db_err;
if (empty($issues)) {
    echo "  All checks passed. Auth system should be working.\n";
} else {
    echo "  ISSUES FOUND:\n";
    foreach ($issues as $i => $issue) {
        echo "  " . ($i + 1) . ". " . $issue . "\n";
    }
    if (!$db_ok && $https_ok) {
        echo "\n  NEXT STEP:\n";
        echo "  Run setup-supabase-rpc.sql in the Supabase SQL Editor to install\n";
        echo "  the php_exec bridge function, then re-run /health.\n";
    }
}
echo $line . "\n";
