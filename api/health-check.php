<?php
declare(strict_types=1);
/**
 * ExtoArts - Health Check (Supabase edition)
 * GET /api/health-check?token=<health_check_token>
 */
define('_EXTOARTS_JSON_ENDPOINT', true);

header('Content-Type: application/json; charset=UTF-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

$_hc_cfg_file = __DIR__ . '/../data/config.json';
$_hc_cfg      = [];
if (is_file($_hc_cfg_file)) {
    $_hc_cfg = json_decode(file_get_contents($_hc_cfg_file), true) ?: [];
}

// Token gate
$expected = $_hc_cfg['health_check_token'] ?? '';
$provided  = $_SERVER['HTTP_X_HEALTH_TOKEN'] ?? ($_GET['token'] ?? '');
if (empty($expected) || !hash_equals((string)$expected, (string)$provided)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized. Provide ?token= or X-Health-Token header.']);
    exit;
}

$report = [
    'ok'        => true,
    'timestamp' => date('c'),
    'server'    => php_uname('n'),
    'php'       => PHP_VERSION,
    'checks'    => [],
];

// ── 1. Supabase REST API ─────────────────────────────────────────────────────
require_once __DIR__ . '/../includes/db.php';

$sb_check = [
    'name'       => 'supabase',
    'status'     => 'unknown',
    'endpoint'   => SUPABASE_URL,
    'latency_ms' => null,
    'query_ok'   => null,
    'error'      => null,
];

$t0 = microtime(true);
try {
    $ping = db_value("SELECT 1");
    $elapsed = round((microtime(true) - $t0) * 1000, 1);
    $sb_check['status']     = 'connected';
    $sb_check['latency_ms'] = $elapsed;
    $sb_check['query_ok']   = ((int)$ping === 1);

    // Count tables accessible via our RPC
    $tables = db_fetch_all(
        "SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
         ORDER BY table_name"
    );
    $sb_check['tables'] = count($tables);
    $sb_check['table_names'] = array_column($tables, 'table_name');
} catch (Throwable $e) {
    $elapsed = round((microtime(true) - $t0) * 1000, 1);
    $sb_check['status']     = 'error';
    $sb_check['latency_ms'] = $elapsed;
    $sb_check['error']      = $e->getMessage();
    $report['ok']           = false;
}
$report['checks'][] = $sb_check;

// ── 2. Supabase Realtime endpoint reachability ───────────────────────────────
$rt_check = [
    'name'       => 'supabase_realtime',
    'status'     => 'unknown',
    'latency_ms' => null,
    'reachable'  => null,
    'error'      => null,
];

$rt_url = SUPABASE_URL . '/realtime/v1/';
$ctx = stream_context_create([
    'http' => ['method' => 'GET', 'timeout' => 6, 'ignore_errors' => true]
]);
$t0   = microtime(true);
$body = @file_get_contents($rt_url, false, $ctx);
$elapsed = round((microtime(true) - $t0) * 1000, 1);
$rt_check['latency_ms'] = $elapsed;

if ($body !== false) {
    $rt_check['reachable'] = true;
    $rt_check['status']    = 'reachable';
} else {
    $rt_check['reachable'] = false;
    $rt_check['status']    = 'unreachable';
    $rt_check['error']     = 'Could not reach Supabase Realtime endpoint.';
}
$report['checks'][] = $rt_check;

// ── 3. Turnstile config presence check ───────────────────────────────────────
$ts_cfg = $_hc_cfg['turnstile'] ?? [];
$report['checks'][] = [
    'name'        => 'turnstile_config',
    'status'      => (!empty($ts_cfg['site_key']) && !empty($ts_cfg['secret_key'])) ? 'configured' : 'missing',
    'site_key'    => !empty($ts_cfg['site_key'])   ? substr($ts_cfg['site_key'], 0, 8) . '...' : '(not set)',
    'secret_set'  => !empty($ts_cfg['secret_key']),
    'is_test_key' => ($ts_cfg['site_key'] ?? '') === '1x00000000000000000000AA',
];

// ── Summary ───────────────────────────────────────────────────────────────────
$report['summary'] = array_map(fn($c) => [
    'name'   => $c['name'],
    'status' => $c['status'],
    'ok'     => in_array($c['status'], ['connected', 'reachable', 'configured'], true),
], $report['checks']);

while (ob_get_level() > 0) ob_end_clean();
echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
flush();
