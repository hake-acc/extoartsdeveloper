<?php
declare(strict_types=1);
/**
 * ExtoArts - Replit Dev Server Entry Point
 *
 * This file is ONLY used by PHP's built-in dev server (Replit).
 * On Apache/AeonHost, index.php is the front controller and this
 * file is never executed.
 *
 * How it works:
 *   - Real static files (css, js, images) → return false so PHP
 *     built-in server serves them natively.
 *   - Everything else → delegate to index.php (the front controller).
 */

$_uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($_uri !== '/' && is_file(__DIR__ . $_uri)) {
    return false; // let PHP built-in server serve the file directly
}
unset($_uri);

require __DIR__ . '/index.php';
