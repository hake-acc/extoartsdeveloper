<?php
declare(strict_types=1);
/**
 * ExtoArts - Chat: Send Message
 * POST /api/chat-send  { order_id, text }
 */
define('_EXTOARTS_JSON_ENDPOINT', true);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/_api.php';
auth_require('client', 'editor', 'admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}
if (!csrf_verify()) {
    json_out(['ok' => false, 'error' => 'Security check failed.'], 403);
}

api_absorb_json();

$user = auth_user();
$uid  = (int)($user['id'] ?? 0);
$role = $user['role'];
$oid  = (int)($_POST['order_id'] ?? 0);
$text = trim($_POST['text'] ?? '');

if ($oid < 1 || $text === '' || strlen($text) > 2000) {
    json_out(['ok' => false, 'error' => 'Invalid message or order.'], 400);
}

// Validate order access
$base_sql = "SELECT o.*, c.name as client_name, e.name as editor_name
             FROM orders o
             LEFT JOIN users c ON c.id = o.client_id
             LEFT JOIN users e ON e.id = o.editor_id
             WHERE o.id = ?";

if ($role === 'admin') {
    $order = db_fetch($base_sql . " LIMIT 1", [$oid]);
} elseif ($role === 'client') {
    $order = db_fetch($base_sql . " AND o.client_id = ? LIMIT 1", [$oid, $uid]);
} else {
    $order = db_fetch($base_sql . " AND o.editor_id = ? LIMIT 1", [$oid, $uid]);
}

if (!$order) {
    json_out(['ok' => false, 'error' => 'Order not found or access denied.'], 403);
}

$active_states = ['in_progress', 'revision', 'awaiting_final_payment', 'final_paid'];
if (!in_array($order['status'], $active_states) || !empty($order['chat_cleared'])) {
    json_out(['ok' => false, 'error' => 'Chat is not open for this order.'], 400);
}

try {
    $id = db_insert(
        "INSERT INTO chat_messages (order_id, sender_id, sender_name, sender_role, message, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())",
        [$oid, $uid, $user['name'] ?? $user['username'] ?? 'User', $role, $text]
    );
    json_out(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    error_log('[ExtoArts] chat-send error: ' . $e->getMessage());
    json_out(['ok' => false, 'error' => 'Failed to send message.'], 500);
}
