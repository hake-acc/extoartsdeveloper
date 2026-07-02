<?php
declare(strict_types=1);
// ExtoArts - Chat page (Supabase edition, polling-based)
// Embedded as iframe in dashboard. No Firebase dependency.
require_once __DIR__ . '/../includes/auth.php';
auth_require('client', 'editor', 'admin');
secure_headers(true);

$user = auth_user();
$uid  = (int)($user['id'] ?? 0);
$role = $user['role'];

$oid = (int)($_GET['oid'] ?? 0);
if ($oid < 1) { http_response_code(400); die('Invalid order.'); }

// Validate access and fetch order
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

if (!$order) { http_response_code(403); die('Access denied.'); }

$active_states = ['in_progress', 'revision', 'awaiting_final_payment', 'final_paid'];
$chat_open     = in_array($order['status'], $active_states);
$is_cleared    = !empty($order['chat_cleared']);

$order_title = htmlspecialchars($order['title'] ?? 'Order #' . $oid);
$sender_name = htmlspecialchars($user['name'] ?? $user['username'] ?? 'User');
$csrf        = csrf_token();
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chat - <?php echo $order_title; ?></title>
<meta name="robots" content="noindex,nofollow">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#07070c;--surface:rgba(255,255,255,0.04);--primary:#00c4f0;--border:rgba(255,255,255,0.09);--text-main:#f5f5f7;--text-muted:#6b7280;--green:#22c55e;--red:#ef4444;}
html,body{height:100%;background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;}
.chat-wrap{display:flex;flex-direction:column;height:100vh;}
.chat-header{padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.03);flex-shrink:0;display:flex;align-items:center;gap:10px;}
.chat-title{font-weight:800;font-size:0.9rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.chat-status{font-size:0.7rem;padding:3px 8px;border-radius:20px;font-weight:700;flex-shrink:0;}
.chat-status.open{background:rgba(0,196,240,0.12);color:var(--primary);border:1px solid rgba(0,196,240,0.25);}
.chat-status.closed{background:rgba(107,114,128,0.12);color:var(--text-muted);border:1px solid rgba(107,114,128,0.2);}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
.chat-messages::-webkit-scrollbar{width:4px;}
.chat-messages::-webkit-scrollbar-track{background:transparent;}
.chat-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
.msg{display:flex;flex-direction:column;max-width:80%;}
.msg.mine{align-self:flex-end;align-items:flex-end;}
.msg.theirs{align-self:flex-start;align-items:flex-start;}
.msg-bubble{padding:9px 13px;border-radius:16px;font-size:0.87rem;line-height:1.55;word-break:break-word;}
.msg.mine .msg-bubble{background:var(--primary);color:#000;border-bottom-right-radius:4px;}
.msg.theirs .msg-bubble{background:rgba(255,255,255,0.07);color:var(--text-main);border-bottom-left-radius:4px;}
.msg-meta{font-size:0.68rem;color:var(--text-muted);margin-top:3px;display:flex;gap:5px;align-items:center;}
.msg.mine .msg-meta{flex-direction:row-reverse;}
.msg-name{font-weight:700;color:rgba(255,255,255,0.5);}
.chat-footer{padding:12px 16px;border-top:1px solid var(--border);background:rgba(255,255,255,0.02);flex-shrink:0;}
.chat-input-row{display:flex;gap:8px;align-items:flex-end;}
.chat-input{flex:1;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:12px;color:var(--text-main);font-family:inherit;font-size:0.87rem;padding:10px 14px;resize:none;min-height:42px;max-height:120px;line-height:1.45;transition:border-color 0.2s;}
.chat-input:focus{outline:none;border-color:rgba(0,196,240,0.4);}
.chat-input::placeholder{color:var(--text-muted);}
.send-btn{background:var(--primary);color:#000;border:none;border-radius:10px;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem;transition:opacity 0.2s;}
.send-btn:hover{opacity:0.85;}
.send-btn:disabled{opacity:0.35;cursor:not-allowed;}
.chat-closed-notice{text-align:center;padding:40px 20px;color:var(--text-muted);}
.chat-closed-notice h3{font-size:1rem;font-weight:800;margin-bottom:8px;color:var(--text-main);}
.system-msg{text-align:center;font-size:0.72rem;color:var(--text-muted);padding:4px 0;}
.loading-state{text-align:center;padding:30px;color:var(--text-muted);font-size:0.85rem;}
.conn-dot{width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block;flex-shrink:0;}
.conn-dot.offline{background:var(--text-muted);}
</style>
</head>
<body>
<div class="chat-wrap">
    <div class="chat-header">
        <span class="conn-dot" id="connDot"></span>
        <div class="chat-title"><?php echo $order_title; ?></div>
        <span class="chat-status <?php echo ($chat_open && !$is_cleared) ? 'open' : 'closed'; ?>">
            <?php echo ($chat_open && !$is_cleared) ? 'Live' : 'Archived'; ?>
        </span>
    </div>

    <?php if (!$chat_open || $is_cleared): ?>
    <div class="chat-closed-notice">
        <h3><?php echo $is_cleared ? 'Chat Archived' : 'Chat Not Available'; ?></h3>
        <p style="font-size:0.83rem;"><?php echo $is_cleared
            ? 'This order is complete. The chat has been archived.'
            : 'Chat opens once 50% payment is verified and work begins.'; ?></p>
    </div>
    <?php else: ?>
    <div class="chat-messages" id="messages">
        <div class="loading-state" id="loadingMsg">Loading messages...</div>
    </div>
    <div class="chat-footer">
        <div class="chat-input-row">
            <textarea class="chat-input" id="msgInput" placeholder="Type a message..." rows="1" maxlength="2000"></textarea>
            <button class="send-btn" id="sendBtn" title="Send">&#9658;</button>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php if ($chat_open && !$is_cleared): ?>
<script>
const ORDER_ID    = <?php echo $oid; ?>;
const SENDER_ID   = <?php echo $uid; ?>;
const SENDER_NAME = <?php echo json_encode($sender_name); ?>;
const SENDER_ROLE = <?php echo json_encode($role); ?>;
const CSRF        = <?php echo json_encode($csrf); ?>;

const messagesEl = document.getElementById('messages');
const msgInput   = document.getElementById('msgInput');
const sendBtn    = document.getElementById('sendBtn');
const loadingMsg = document.getElementById('loadingMsg');
const connDot    = document.getElementById('connDot');

let lastTs       = '';
let initialized  = false;
let renderedIds  = new Set();
let pollTimer    = null;
let sending      = false;
let pendingOpt   = []; // optimistic messages waiting for server confirmation

function escHtml(s) {
    return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatTime(ts) {
    if (!ts) return '';
    try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
}

function showEmptyState() {
    if (document.getElementById('emptyState')) return;
    const el = document.createElement('div');
    el.id = 'emptyState';
    el.className = 'system-msg';
    el.style.cssText = 'padding:28px 0 12px;font-size:0.78rem;opacity:0.6;';
    el.textContent = 'No messages yet - start the conversation.';
    messagesEl.appendChild(el);
}

function removeEmptyState() {
    const el = document.getElementById('emptyState');
    if (el) el.remove();
}

/* Render optimistic (instant) bubble before server confirms */
function renderOptimistic(text) {
    removeEmptyState();
    const tempId = 'opt-' + Date.now();
    pendingOpt.push({ id: tempId, text });
    const div = document.createElement('div');
    div.className = 'msg mine';
    div.id = tempId;
    div.style.opacity = '0.55';
    div.innerHTML =
        '<div class="msg-bubble">' + escHtml(text) + '</div>' +
        '<div class="msg-meta"><span class="msg-name">You</span><span style="font-style:italic;">sending...</span></div>';
    messagesEl.appendChild(div);
    scrollBottom();
}

function renderMessage(m) {
    if (renderedIds.has(m.id)) return;

    /* Replace matching optimistic bubble with the confirmed one */
    if (String(m.sender_id) === String(SENDER_ID)) {
        const optIdx = pendingOpt.findIndex(p => p.text === m.message);
        if (optIdx !== -1) {
            const optEl = document.getElementById(pendingOpt[optIdx].id);
            if (optEl) optEl.remove();
            pendingOpt.splice(optIdx, 1);
        }
    }

    renderedIds.add(m.id);
    removeEmptyState();
    const mine = (String(m.sender_id) === String(SENDER_ID));
    const div  = document.createElement('div');
    div.className = 'msg ' + (mine ? 'mine' : 'theirs');
    div.id = 'msg-' + m.id;
    div.innerHTML =
        '<div class="msg-bubble">' + escHtml(m.message) + '</div>' +
        '<div class="msg-meta">' +
            '<span class="msg-name">' + (mine ? 'You' : escHtml(m.sender_name)) + '</span>' +
            '<span>' + formatTime(m.created_at) + '</span>' +
            (m.sender_role === 'admin' ? '<span style="color:#00c4f0;font-weight:700;">Staff</span>' : '') +
        '</div>';
    messagesEl.appendChild(div);
}

function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function poll() {
    try {
        /* First poll: fetch all history. Subsequent polls: only new messages. */
        const url = initialized
            ? '/api/chat-poll?oid=' + ORDER_ID + '&after=' + encodeURIComponent(lastTs)
            : '/api/chat-poll?oid=' + ORDER_ID;

        const res  = await fetch(url, { credentials: 'same-origin' });
        const data = await res.json();
        connDot.classList.remove('offline');

        if (data.ok && Array.isArray(data.messages)) {
            if (loadingMsg && loadingMsg.parentNode) loadingMsg.remove();

            const hadNew = data.messages.length > 0;
            let maxTs = lastTs;
            data.messages.forEach(m => {
                renderMessage(m);
                if (!maxTs || m.created_at > maxTs) maxTs = m.created_at;
            });

            if (!initialized) {
                initialized = true;
                /* Set lastTs to max message time OR now, so we never re-fetch the full history */
                lastTs = maxTs || new Date().toISOString().slice(0, 23).replace('T', ' ');
                if (!hadNew) showEmptyState();
                scrollBottom();
            } else if (hadNew) {
                lastTs = maxTs;
                scrollBottom();
            }
        }
    } catch (e) {
        connDot.classList.add('offline');
    }
    pollTimer = setTimeout(poll, 2500);
}

async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text || sending) return;
    sending = true;

    /* Optimistic: show immediately, clear input */
    renderOptimistic(text);
    msgInput.value = '';
    msgInput.style.height = 'auto';
    sendBtn.disabled = true;
    msgInput.disabled = true;

    try {
        const res  = await fetch('/api/chat-send', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-Csrf-Token': CSRF },
            body: JSON.stringify({ order_id: ORDER_ID, text })
        });
        const data = await res.json();
        if (data.ok) {
            /* Poll immediately to confirm and get the real message ID */
            if (pollTimer) clearTimeout(pollTimer);
            pollTimer = setTimeout(poll, 120);
        } else {
            /* Remove optimistic bubble on failure */
            const optIdx = pendingOpt.findIndex(p => p.text === text);
            if (optIdx !== -1) {
                const optEl = document.getElementById(pendingOpt[optIdx].id);
                if (optEl) { optEl.style.borderColor = '#ef4444'; optEl.style.opacity = '1'; }
                pendingOpt.splice(optIdx, 1);
            }
            alert(data.error || 'Failed to send message.');
        }
    } catch (e) {
        /* Mark optimistic bubble as failed */
        const optIdx = pendingOpt.findIndex(p => p.text === text);
        if (optIdx !== -1) {
            const optEl = document.getElementById(pendingOpt[optIdx].id);
            if (optEl) { optEl.style.opacity = '0.4'; optEl.title = 'Failed to send'; }
        }
        alert('Network error. Please try again.');
    }

    sending = false;
    sendBtn.disabled = false;
    msgInput.disabled = false;
    msgInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
msgInput.addEventListener('input', () => {
    msgInput.style.height = 'auto';
    msgInput.style.height = Math.min(msgInput.scrollHeight, 120) + 'px';
});

/* Notify parent to focus this iframe when opened */
window.addEventListener('focus', () => { msgInput && msgInput.focus(); });

poll();
</script>
<?php endif; ?>
<script type="module" src="/src/authGuard.js"></script>
</body>
</html>
