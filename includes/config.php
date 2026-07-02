<?php
declare(strict_types=1);
/**
 * ExtoArts - Core Configuration
 * Database: Supabase PostgreSQL via REST API (HTTPS/cURL, no pdo_pgsql needed)
 */

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.gc_maxlifetime', 7200);
    $__proto   = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? $_SERVER['REQUEST_SCHEME'] ?? '');
    $__isHttps = ($__proto === 'https') || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    if ($__isHttps) ini_set('session.cookie_secure', 1);
    unset($__proto, $__isHttps);
    session_start();
}

require_once __DIR__ . '/db.php';

// Legacy $conn alias kept for any file that checks `if ($conn)`
$conn = true;

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

$ga_id = 'G-WTFPZB9Y4C';

// Load misc config from data/config.json (admin creds, Turnstile, etc.)
$_cfg_path = __DIR__ . '/../data/config.json';
$GLOBALS['_site_cfg'] = is_file($_cfg_path)
    ? (json_decode(file_get_contents($_cfg_path), true) ?: [])
    : [];
