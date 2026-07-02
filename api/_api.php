<?php
declare(strict_types=1);
/**
 * ExtoArts - Shared API helpers
 *
 * Included by every api/*.php endpoint. Provides a unified JSON response
 * contract and a JSON body absorber so each endpoint file stays focused on
 * its own logic rather than boilerplate.
 *
 * Why ob_end_clean loop?  auth.php (and error-handler.php on deployment)
 * may wrap the request in ob_start(). Clearing all levels before echoing
 * prevents Cloudflare HTTP 520 caused by a buffered-but-never-flushed body.
 */

/** Send a JSON response and terminate. */
function json_out(array $data, int $status = 200): never {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data);
    flush();
    exit;
}

/** Convenience: terminate with ok:true plus optional extra fields. */
function json_ok(array $extra = []): never {
    json_out(['ok' => true] + $extra);
}

/** Convenience: terminate with ok:false and an error message. */
function json_err(string $msg, int $status = 400): never {
    json_out(['ok' => false, 'error' => $msg], $status);
}

/**
 * Merge a JSON request body into $_POST.
 * No-op when Content-Type is not application/json.
 * Lets endpoints read all input uniformly via $_POST regardless of
 * whether the caller sent form-data or a JSON body.
 */
function api_absorb_json(): void {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (!str_contains($ct, 'application/json')) return;
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    foreach ($data as $k => $v) $_POST[$k] = $v;
}
