<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';

$user     = auth_user();
$uid      = $user ? (int)$user['id'] : 0;
$errors   = [];
$success  = false;
$view_mode = isset($_GET['id']) ? 'view' : (isset($_GET['my']) ? 'list' : 'new');

// Logged-in users can see their ticket list / single ticket
// Guest users can only submit new tickets

// View a specific ticket
$ticket         = null;
$ticket_replies = [];
if ($view_mode === 'view' && $user) {
    $tid    = (int)$_GET['id'];
    $ticket = db_fetch("SELECT * FROM support_tickets WHERE id = ? AND user_id = ? LIMIT 1", [$tid, $uid]);
    if ($ticket) {
        $ticket_replies = db_fetch_all("SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC", [$tid]);
    } else {
        $view_mode = 'list';
    }
}

// Ticket list
$my_tickets = [];
if ($view_mode === 'list' && $user) {
    $my_tickets = db_fetch_all("SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", [$uid]);
}

// Handle new reply on a ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reply_ticket']) && $user && $ticket) {
    if (!csrf_verify()) {
        $errors[] = 'Security check failed. Refresh and try again.';
    } else {
        $msg = trim($_POST['reply_message'] ?? '');
        $tid = (int)$ticket['id'];
        if (!$msg || strlen($msg) < 5) {
            $errors[] = 'Reply must be at least 5 characters.';
        } elseif ($ticket['status'] === 'closed') {
            $errors[] = 'This ticket is closed. Please open a new one.';
        } else {
            db_insert("INSERT INTO ticket_replies (ticket_id, sender_id, sender_role, message, created_at) VALUES (?, ?, 'user', ?, datetime('now'))", [$tid, $uid, $msg]);
            db_execute("UPDATE support_tickets SET status = 'waiting', updated_at = datetime('now') WHERE id = ?", [$tid]);
            header('Location: /ticket?id=' . $tid . '&replied=1');
            exit;
        }
    }
}

// Handle new ticket submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['reply_ticket'])) {
    if (!csrf_verify()) {
        $errors[] = 'Security check failed. Refresh and try again.';
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        if (!rate_limit_check('ticket_submit_' . $ip, 3, 300)) {
            $errors[] = 'Too many submissions. Please wait a few minutes.';
        } else {
            $name     = trim($_POST['name'] ?? ($user['name'] ?? ''));
            $email    = trim($_POST['email'] ?? ($user['email'] ?? ''));
            $subject  = trim($_POST['subject'] ?? '');
            $category = $_POST['category'] ?? 'general';
            $priority = $_POST['priority'] ?? 'normal';
            $message  = trim($_POST['message'] ?? '');

            $valid_cats = ['billing','order','technical','editor_application','general','abuse','other'];
            $valid_pris = ['low','normal','high','urgent'];

            if (!$name) $errors[] = 'Name is required.';
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
            if (!$subject || strlen($subject) < 5) $errors[] = 'Subject must be at least 5 characters.';
            if (!in_array($category, $valid_cats)) $errors[] = 'Invalid category.';
            if (!in_array($priority, $valid_pris)) $errors[] = 'Invalid priority.';
            if (!$message || strlen($message) < 20) $errors[] = 'Message must be at least 20 characters.';

            if (empty($errors)) {
                try {
                    $ui = $uid > 0 ? $uid : null;
                    $new_id = db_insert(
                        "INSERT INTO support_tickets (user_id, name, email, subject, category, priority, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', datetime('now'), datetime('now'))",
                        [$ui, $name, strtolower($email), $subject, $category, $priority, $message]
                    );
                    rate_limit_record('ticket_submit_' . $ip);
                    $success = true;
                    if ($user) {
                        header('Location: /ticket?id=' . $new_id . '&submitted=1');
                        exit;
                    }
                } catch (Throwable $e) {
                    error_log('[ExtoArts] ticket submit: ' . $e->getMessage());
                    $errors[] = 'Database error. Please try again or contact us on Discord.';
                }
            }
        }
    }
}

$status_meta = [
    'open'        => ['Open', '#f59e0b'],
    'in_progress' => ['In Progress', '#00c4f0'],
    'waiting'     => ['Waiting on Admin', '#8b5cf6'],
    'resolved'    => ['Resolved', '#22c55e'],
    'closed'      => ['Closed', '#6b7280'],
];
$category_labels = [
    'billing' => 'Billing & Payments', 'order' => 'Order Support',
    'technical' => 'Technical Issue', 'editor_application' => 'Editor Application',
    'general' => 'General Inquiry', 'abuse' => 'Report Abuse', 'other' => 'Other'
];
$priority_labels = ['low' => 'Low', 'normal' => 'Normal', 'high' => 'High', 'urgent' => 'Urgent'];
$priority_colors = ['low' => '#6b7280', 'normal' => '#00c4f0', 'high' => '#f59e0b', 'urgent' => '#ef4444'];

$page_title = 'Support Tickets | ExtoArts';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo htmlspecialchars($page_title); ?></title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#07070c;--surface:rgba(255,255,255,0.04);--primary:#00c4f0;--primary-glow:rgba(0,196,240,0.12);--border:rgba(255,255,255,0.08);--text-main:#f5f5f7;--text-muted:#6b7280;--easing:cubic-bezier(0.16,1,0.3,1);}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;padding:0 0 80px;}
a{text-decoration:none;color:inherit;}

.topbar{background:rgba(7,7,12,0.95);border-bottom:1px solid var(--border);padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:62px;position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
.topbar-brand{display:flex;align-items:center;gap:10px;}
.topbar-brand img{width:36px;height:36px;border-radius:50%;}
.topbar-brand span{font-weight:900;font-size:1.05rem;}
.topbar-right{display:flex;align-items:center;gap:12px;font-size:0.85rem;}
.topbar-right a{color:var(--text-muted);transition:color 0.2s;}
.topbar-right a:hover{color:var(--primary);}

.container{max-width:900px;margin:0 auto;padding:40px 20px;}
.page-head{margin-bottom:36px;}
.page-head .badge{font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:var(--primary);margin-bottom:12px;display:block;}
.page-head h1{font-size:clamp(1.8rem,4vw,2.5rem);font-weight:900;letter-spacing:-1px;}
.page-head p{color:var(--text-muted);margin-top:8px;line-height:1.6;}

.tab-bar{display:flex;gap:4px;margin-bottom:32px;border-bottom:1px solid var(--border);padding-bottom:0;}
.tab-btn{padding:10px 20px;font-size:0.88rem;font-weight:700;color:var(--text-muted);border:none;background:transparent;cursor:pointer;font-family:inherit;border-bottom:2px solid transparent;margin-bottom:-1px;transition:0.2s;}
.tab-btn.active{color:var(--primary);border-bottom-color:var(--primary);}
.tab-btn:hover:not(.active){color:var(--text-main);}

.card{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:18px;padding:32px;}
.form-group{margin-bottom:20px;}
.form-group label{display:block;font-size:0.83rem;font-weight:700;margin-bottom:7px;color:var(--text-main);}
.form-group label .req{color:var(--primary);}
.form-group small{font-size:0.77rem;color:var(--text-muted);margin-top:5px;display:block;line-height:1.5;}
input[type=text],input[type=email],select,textarea{width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:11px;padding:12px 15px;color:var(--text-main);font-size:0.92rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
input:focus,select:focus,textarea:focus{border-color:var(--primary);}
textarea{resize:vertical;min-height:130px;line-height:1.6;}
select option{background:#0d0d14;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
@media(max-width:540px){.two-col{grid-template-columns:1fr;}}

.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;font-size:0.9rem;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s var(--easing);}
.btn-primary{background:var(--primary);color:#000;}
.btn-primary:hover{background:#22d3ee;transform:translateY(-1px);}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-main);}
.btn-outline:hover{border-color:var(--primary);color:var(--primary);}
.btn-sm{padding:8px 16px;font-size:0.82rem;}

.alert{padding:14px 18px;border-radius:12px;font-size:0.88rem;line-height:1.5;margin-bottom:22px;}
.alert-error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;}
.alert-success{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);color:#86efac;}
.alert-info{background:rgba(0,196,240,0.06);border:1px solid rgba(0,196,240,0.2);color:var(--primary);}

.status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:50px;font-size:0.73rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
.priority-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}

.ticket-list{display:flex;flex-direction:column;gap:12px;}
.ticket-row{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:14px;padding:20px 22px;display:flex;align-items:center;gap:16px;transition:border-color 0.2s;cursor:pointer;}
.ticket-row:hover{border-color:rgba(255,255,255,0.15);}
.ticket-row .t-id{font-size:0.75rem;color:var(--text-muted);font-weight:700;min-width:42px;}
.ticket-row .t-info{flex:1;min-width:0;}
.ticket-row .t-subject{font-weight:700;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ticket-row .t-meta{font-size:0.78rem;color:var(--text-muted);margin-top:3px;}
.ticket-row .t-status{flex-shrink:0;}

.ticket-detail .t-header{padding:24px;border-bottom:1px solid var(--border);margin-bottom:0;}
.ticket-detail .t-header h2{font-size:1.2rem;font-weight:800;margin-bottom:10px;}
.ticket-detail .t-header-meta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}

.message-thread{padding:24px;display:flex;flex-direction:column;gap:18px;}
.msg{display:flex;gap:14px;}
.msg-avatar{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:800;}
.msg-body{flex:1;}
.msg-meta{font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;display:flex;gap:10px;align-items:center;}
.msg-meta .sender{font-weight:700;color:var(--text-main);}
.msg-text{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:14px 16px;font-size:0.9rem;line-height:1.65;white-space:pre-wrap;word-wrap:break-word;}
.msg.admin .msg-text{background:rgba(0,196,240,0.05);border-color:rgba(0,196,240,0.2);}
.msg.admin .msg-avatar{background:rgba(0,196,240,0.15);color:var(--primary);}

.reply-box{border-top:1px solid var(--border);padding:24px;}
.reply-box h3{font-size:0.9rem;font-weight:800;margin-bottom:14px;}

.empty-state{text-align:center;padding:60px 20px;color:var(--text-muted);}
.empty-state i{font-size:3rem;margin-bottom:16px;display:block;}
.empty-state h3{font-weight:800;color:var(--text-main);margin-bottom:8px;}
</style>
</head>
<body>
<div class="topbar">
    <a href="/" class="topbar-brand">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#0a0a14"/><path d="M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>ExtoArts</span>
    </a>
    <div class="topbar-right">
        <?php if ($user): ?>
        <a href="/dashboard"><i class="ti ti-home" style="margin-right:5px;"></i>Dashboard</a>
        <a href="/logout" style="color:#ef4444;">Logout</a>
        <?php else: ?>
        <a href="/login">Sign In</a>
        <a href="/">Home</a>
        <?php endif; ?>
    </div>
</div>

<div class="container">
    <div class="page-head">
        <span class="badge">Support Center</span>
        <div style="margin:14px 0 20px;"><i class="ti ti-headset" style="font-size:58px;color:#00c4f0;"></i></div>
        <h1>How can we help?</h1>
        <p>Submit a ticket and our team will get back to you. Usually within 24 hours.</p>
    </div>

    <?php if ($user): ?>
    <div class="tab-bar">
        <button class="tab-btn <?php echo $view_mode==='new'?'active':''; ?>" onclick="setTab('new')"><i class="ti ti-plus" style="margin-right:6px;"></i>New Ticket</button>
        <button class="tab-btn <?php echo in_array($view_mode,['list','view'])?'active':''; ?>" onclick="setTab('list')"><i class="ti ti-list" style="margin-right:6px;"></i>My Tickets</button>
    </div>
    <?php endif; ?>

    <?php if ($view_mode === 'view' && $ticket): ?>
    <div class="card" style="padding:0;overflow:hidden;">
        <div class="t-header">
            <h2><?php echo htmlspecialchars($ticket['subject']); ?></h2>
            <div class="t-header-meta">
                <?php $sm = $status_meta[$ticket['status']] ?? ['Unknown','#6b7280']; ?>
                <span class="status-pill" style="background:<?php echo $sm[1]; ?>22;color:<?php echo $sm[1]; ?>;border:1px solid <?php echo $sm[1]; ?>44;"><?php echo $sm[0]; ?></span>
                <?php $pc = $priority_colors[$ticket['priority']] ?? '#6b7280'; ?>
                <span class="status-pill" style="background:<?php echo $pc; ?>22;color:<?php echo $pc; ?>;border:1px solid <?php echo $pc; ?>44;"><?php echo htmlspecialchars(ucfirst($ticket['priority'])); ?> Priority</span>
                <span style="font-size:0.78rem;color:var(--text-muted);"><?php echo htmlspecialchars($category_labels[$ticket['category']] ?? $ticket['category']); ?></span>
                <span style="font-size:0.78rem;color:var(--text-muted);">Ticket #<?php echo $ticket['id']; ?></span>
                <span style="font-size:0.78rem;color:var(--text-muted);"><?php echo date('M j, Y g:ia', strtotime($ticket['created_at'])); ?></span>
            </div>
        </div>

        <?php if (isset($_GET['replied'])): ?><div class="alert alert-success" style="margin:16px 24px 0;"><i class="ti ti-circle-check" style="margin-right:8px;"></i>Reply sent successfully.</div><?php endif; ?>

        <div class="message-thread">
            <div class="msg">
                <div class="msg-avatar" style="background:rgba(255,255,255,0.08);">
                    <?php if ($user['avatar']): ?><img src="<?php echo htmlspecialchars($user['avatar']); ?>" style="width:36px;height:36px;border-radius:50%;" alt="<?php echo htmlspecialchars($ticket['name']); ?> profile photo"><?php else: ?><?php echo htmlspecialchars(strtoupper(substr($ticket['name'],0,1))); ?><?php endif; ?>
                </div>
                <div class="msg-body">
                    <div class="msg-meta"><span class="sender"><?php echo htmlspecialchars($ticket['name']); ?></span><span><?php echo date('M j, Y g:ia', strtotime($ticket['created_at'])); ?></span></div>
                    <div class="msg-text"><?php echo htmlspecialchars($ticket['message']); ?></div>
                </div>
            </div>

            <?php foreach ($ticket_replies as $r): ?>
            <div class="msg <?php echo $r['sender_role'] === 'admin' ? 'admin' : ''; ?>">
                <div class="msg-avatar">
                    <?php if ($r['sender_role'] === 'admin'): ?><i class="ti ti-shield-check"></i><?php else: echo htmlspecialchars(strtoupper(substr($user['name'],0,1))); endif; ?>
                </div>
                <div class="msg-body">
                    <div class="msg-meta">
                        <span class="sender" style="<?php echo $r['sender_role']==='admin'?'color:var(--primary)':''; ?>"><?php echo $r['sender_role']==='admin' ? 'ExtoArts Support' : htmlspecialchars($user['name']); ?></span>
                        <span><?php echo date('M j, Y g:ia', strtotime($r['created_at'])); ?></span>
                    </div>
                    <div class="msg-text"><?php echo htmlspecialchars($r['message']); ?></div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <?php if ($ticket['status'] !== 'closed'): ?>
        <div class="reply-box">
            <h3>Add a Reply</h3>
            <?php if (!empty($errors)): ?>
            <div class="alert alert-error"><i class="ti ti-alert-circle" style="margin-right:8px;"></i><?php echo implode('<br>', array_map('htmlspecialchars', $errors)); ?></div>
            <?php endif; ?>
            <form method="POST">
                <?php echo csrf_field(); ?>
                <input type="hidden" name="reply_ticket" value="1">
                <div class="form-group">
                    <textarea name="reply_message" placeholder="Describe your update or additional information..." required></textarea>
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="submit" class="btn btn-primary"><i class="ti ti-send"></i>Send Reply</button>
                    <a href="/ticket?my=1" class="btn btn-outline">Back to Tickets</a>
                </div>
            </form>
        </div>
        <?php else: ?>
        <div style="padding:20px 24px;border-top:1px solid var(--border);">
            <div class="alert alert-info" style="margin:0;"><i class="ti ti-lock" style="margin-right:8px;"></i>This ticket is closed. <a href="/ticket" style="color:var(--primary);">Open a new ticket</a> if you need further help.</div>
        </div>
        <?php endif; ?>
    </div>

    <?php elseif ($view_mode === 'list'): ?>
    <?php if (empty($my_tickets)): ?>
    <div class="empty-state"><i class="ti ti-ticket"></i><h3>No tickets yet</h3><p>Submit a support ticket and we'll get back to you within 24 hours.</p><button class="btn btn-primary" onclick="setTab('new')" style="margin-top:20px;"><i class="ti ti-plus"></i>New Ticket</button></div>
    <?php else: ?>
    <div class="ticket-list">
        <?php foreach ($my_tickets as $t): ?>
        <?php $sm = $status_meta[$t['status']] ?? ['?','#6b7280']; ?>
        <a href="/ticket?id=<?php echo $t['id']; ?>" class="ticket-row">
            <div class="t-id">#<?php echo $t['id']; ?></div>
            <div class="t-info">
                <div class="t-subject"><?php echo htmlspecialchars($t['subject']); ?></div>
                <div class="t-meta"><?php echo $category_labels[$t['category']] ?? $t['category']; ?> &middot; <?php echo date('M j, Y', strtotime($t['created_at'])); ?></div>
            </div>
            <div class="t-status">
                <span class="status-pill" style="background:<?php echo $sm[1]; ?>22;color:<?php echo $sm[1]; ?>;border:1px solid <?php echo $sm[1]; ?>44;"><?php echo $sm[0]; ?></span>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <?php else: ?>
    <?php if ($success): ?>
    <div class="alert alert-success"><i class="ti ti-circle-check" style="margin-right:8px;"></i><strong>Ticket submitted successfully!</strong> We'll respond to your email within 24 hours.</div>
    <?php endif; ?>
    <?php if (!empty($errors)): ?>
    <div class="alert alert-error"><i class="ti ti-alert-circle" style="margin-right:8px;"></i><?php foreach($errors as $e): ?><?php echo htmlspecialchars($e); ?><br><?php endforeach; ?></div>
    <?php endif; ?>

    <div class="card">
        <form method="POST" id="ticketForm">
            <?php echo csrf_field(); ?>
            <?php if (!$user): ?>
            <div class="two-col" style="margin-bottom:0;">
                <div class="form-group">
                    <label>Your Name <span class="req">*</span></label>
                    <input type="text" name="name" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" required maxlength="255">
                </div>
                <div class="form-group">
                    <label>Email Address <span class="req">*</span></label>
                    <input type="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
                    <small>We'll reply to this address</small>
                </div>
            </div>
            <?php else: ?>
            <input type="hidden" name="name" value="<?php echo htmlspecialchars($user['name']); ?>">
            <input type="hidden" name="email" value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>">
            <?php endif; ?>

            <div class="form-group">
                <label>Subject <span class="req">*</span></label>
                <input type="text" name="subject" value="<?php echo htmlspecialchars($_POST['subject'] ?? ''); ?>" placeholder="Briefly describe your issue" required maxlength="500">
            </div>

            <div class="two-col">
                <div class="form-group">
                    <label>Category <span class="req">*</span></label>
                    <select name="category">
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="editor_application">Editor Application</option>
                        <option value="technical">Technical Issue</option>
                        <option value="abuse">Report Abuse</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select name="priority">
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Message <span class="req">*</span></label>
                <textarea name="message" placeholder="Describe your issue in detail. Include any order IDs, error messages, or relevant context..." required><?php echo htmlspecialchars($_POST['message'] ?? ''); ?></textarea>
                <small>Minimum 20 characters. The more detail, the faster we can help.</small>
            </div>

            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                <button type="submit" class="btn btn-primary"><i class="ti ti-send"></i>Submit Ticket</button>
                <?php if ($user): ?>
                <button type="button" class="btn btn-outline" onclick="setTab('list')">View My Tickets</button>
                <?php endif; ?>
                <span style="font-size:0.8rem;color:var(--text-muted);">Usually responded within 24 hours</span>
            </div>
        </form>
    </div>

    <div style="margin-top:28px;display:flex;gap:20px;flex-wrap:wrap;">
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:rgba(88,101,242,0.1);border:1px solid rgba(88,101,242,0.25);border-radius:14px;color:var(--text-main);font-size:0.88rem;font-weight:700;transition:0.2s;" onmouseover="this.style.borderColor='#5865f2'" onmouseout="this.style.borderColor='rgba(88,101,242,0.25)'"><i class="ti ti-brand-discord" style="color:#5865f2;font-size:1.2rem;"></i>For urgent help, join our Discord</a>
    </div>
    <?php endif; ?>
</div>

<script>
const tabs = {
    new: () => { setViewParam(''); },
    list: () => { window.location.href = '/ticket?my=1'; }
};
function setTab(t) {
    if (t === 'new') window.location.href = '/ticket';
    else if (t === 'list') window.location.href = '/ticket?my=1';
}
</script>
</body>
</html>
