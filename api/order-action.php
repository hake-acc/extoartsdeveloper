<?php
declare(strict_types=1);
define('_EXTOARTS_JSON_ENDPOINT', true);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/_api.php';
auth_require('client', 'editor', 'admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_err('Method not allowed', 405);
if (!csrf_verify()) json_err('Security check failed. Refresh and try again.', 403);

$user = auth_user();
$uid  = (int)($user['id'] ?? 0);
$role = $user['role'];

api_absorb_json();
$action = trim($_POST['action'] ?? '');

function get_order_secured(int $oid, int $uid, string $role): ?array {
    $o = db_fetch("SELECT * FROM orders WHERE id=? LIMIT 1", [$oid]);
    if (!$o) return null;
    if ($role === 'admin') return $o;
    if ($role === 'client' && (int)$o['client_id'] === $uid) return $o;
    if ($role === 'editor' && (int)$o['editor_id'] === $uid) return $o;
    return null;
}

try {

// ═══════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════
if ($role === 'admin') {

    if ($action === 'set_amount_assign') {
        $oid    = (int)($_POST['order_id'] ?? 0);
        $amount = round((float)($_POST['payment_amount'] ?? 0), 2);
        $eid    = (int)($_POST['editor_id'] ?? 0);
        if ($oid < 1 || $amount <= 0) json_err('A valid order and payment amount are required.');
        $ei = $eid > 0 ? $eid : null;
        db_execute("UPDATE orders SET payment_amount=?,editor_id=?,status='awaiting_half_payment',updated_at=datetime('now') WHERE id=?", [$amount,$ei,$oid]);
        if ($eid > 0) db_execute("DELETE FROM order_interests WHERE order_id=?", [$oid]);
        $o = db_fetch("SELECT title,client_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o && $o['client_id']) db_notify((int)$o['client_id'],'payment','Payment Required',"Your order \"{$o['title']}\" requires a 50% upfront payment of \$$amount.",'/dashboard');
        db_audit($uid,'set_amount_assign','order',$oid,"amount=\$$amount editor=$eid");
        json_ok(['msg'=>'Payment request sent. Client will be asked for 50% upfront.']);
    }

    elseif ($action === 'approve_half_payment') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order.');
        $rows = db_execute("UPDATE orders SET status='in_progress',updated_at=datetime('now') WHERE id=? AND status='half_paid'", [$oid]);
        if (!$rows) json_err('Order is not in half_paid status.');
        db_execute("UPDATE order_payments SET status='approved',approved_by=?,approved_at=datetime('now') WHERE order_id=? AND payment_type='half' AND status='pending'", [$uid,$oid]);
        $o = db_fetch("SELECT title,client_id,editor_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o) {
            if ($o['client_id']) db_notify((int)$o['client_id'],'success','Payment Confirmed',"50% payment for \"{$o['title']}\" approved. Work has started!",'/dashboard');
            if ($o['editor_id']) db_notify((int)$o['editor_id'],'info','New Assignment',"Order \"{$o['title']}\" is now active. Start working!",'/dashboard?tab=work');
        }
        db_audit($uid,'approve_half_payment','order',$oid,'');
        json_ok(['msg'=>'Half payment approved. Work started.']);
    }

    elseif ($action === 'reject_half_payment') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order.');
        db_execute("UPDATE orders SET status='awaiting_half_payment',updated_at=datetime('now') WHERE id=?", [$oid]);
        db_execute("UPDATE order_payments SET status='rejected' WHERE order_id=? AND payment_type='half' AND status='pending'", [$oid]);
        $o = db_fetch("SELECT title,client_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o && $o['client_id']) db_notify((int)$o['client_id'],'warning','Payment Not Verified',"Payment for \"{$o['title']}\" could not be verified. Resubmit.",'/dashboard');
        db_audit($uid,'reject_half_payment','order',$oid,'');
        json_ok(['msg'=>'Payment reference rejected.']);
    }

    elseif ($action === 'approve_final_payment') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order.');
        $rows = db_execute("UPDATE orders SET status='completed',chat_cleared=1,updated_at=datetime('now') WHERE id=? AND status='final_paid'", [$oid]);
        if (!$rows) json_err('Order is not in final_paid status.');
        db_execute("UPDATE order_payments SET status='approved',approved_by=?,approved_at=datetime('now') WHERE order_id=? AND payment_type='final' AND status='pending'", [$uid,$oid]);
        $o = db_fetch("SELECT title,client_id,editor_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o) {
            if ($o['client_id']) db_notify((int)$o['client_id'],'success','Order Complete',"Your order \"{$o['title']}\" is complete. Thank you!",'/dashboard');
            if ($o['editor_id']) db_notify((int)$o['editor_id'],'success','Payment Approved',"Final payment for \"{$o['title']}\" approved.",'/dashboard?tab=earnings');
        }
        db_audit($uid,'approve_final_payment','order',$oid,'');
        json_ok(['msg'=>'Order completed.','complete'=>true]);
    }

    elseif ($action === 'reject_final_payment') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order.');
        db_execute("UPDATE orders SET status='awaiting_final_payment',updated_at=datetime('now') WHERE id=?", [$oid]);
        db_execute("UPDATE order_payments SET status='rejected' WHERE order_id=? AND payment_type='final' AND status='pending'", [$oid]);
        $o = db_fetch("SELECT title,client_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o && $o['client_id']) db_notify((int)$o['client_id'],'warning','Final Payment Issue',"Final payment for \"{$o['title']}\" not verified. Resubmit.",'/dashboard');
        db_audit($uid,'reject_final_payment','order',$oid,'');
        json_ok(['msg'=>'Final payment rejected.']);
    }

    elseif ($action === 'update_order') {
        $oid     = (int)($_POST['order_id'] ?? 0);
        $st      = trim($_POST['order_status'] ?? '');
        $eid     = (int)($_POST['editor_id'] ?? 0);
        $delivery= trim($_POST['delivery_link'] ?? '');
        $note    = trim($_POST['admin_note'] ?? '');
        $pamount = round((float)($_POST['payment_amount'] ?? 0), 2);
        if ($oid < 1) json_err('Invalid order ID.');
        $valid = ['pending','awaiting_half_payment','half_paid','in_progress','revision','awaiting_final_payment','final_paid','completed','cancelled'];
        if ($st && !in_array($st, $valid)) json_err('Invalid status.');
        $ei = $eid > 0 ? $eid : null;
        db_execute(
            "UPDATE orders SET status=?,editor_id=?,delivery_link=?,admin_note=?,payment_amount=CASE WHEN ?>0 THEN ? ELSE payment_amount END,updated_at=datetime('now') WHERE id=?",
            [$st,$ei,$delivery,$note,$pamount,$pamount,$oid]
        );
        db_audit($uid,'update_order','order',$oid,"status=$st editor=$eid");
        json_ok(['msg'=>'Order updated.']);
    }

    elseif ($action === 'assign_editor') {
        $oid = (int)($_POST['order_id'] ?? 0);
        $eid = (int)($_POST['editor_id'] ?? 0);
        if ($oid < 1 || $eid < 1) json_err('Invalid order or editor ID.');
        db_execute("UPDATE orders SET editor_id=?,updated_at=datetime('now') WHERE id=?", [$eid,$oid]);
        db_execute("DELETE FROM order_interests WHERE order_id=?", [$oid]);
        $o = db_fetch("SELECT title FROM orders WHERE id=? LIMIT 1", [$oid]);
        db_notify($eid,'info','New Assignment',"You have been assigned to \"{$o['title']}\". Check your work tab.",'/dashboard?tab=work');
        db_audit($uid,'assign_editor','order',$oid,"editor_id=$eid");
        json_ok(['msg'=>'Editor assigned.']);
    }

    elseif ($action === 'cancel_order') {
        $oid  = (int)($_POST['order_id'] ?? 0);
        $note = trim($_POST['note'] ?? '');
        if ($oid < 1) json_err('Invalid order ID.');
        db_execute("UPDATE orders SET status='cancelled',admin_note=?,updated_at=datetime('now') WHERE id=?", [$note,$oid]);
        $o = db_fetch("SELECT title,client_id,editor_id FROM orders WHERE id=? LIMIT 1", [$oid]);
        if ($o) {
            if ($o['client_id']) db_notify((int)$o['client_id'],'warning','Order Cancelled',"Your order \"{$o['title']}\" was cancelled.".($note?" Reason: $note":''),'/dashboard');
            if ($o['editor_id']) db_notify((int)$o['editor_id'],'warning','Order Cancelled',"Order \"{$o['title']}\" was cancelled.",'/dashboard?tab=work');
        }
        db_audit($uid,'cancel_order','order',$oid,$note);
        json_ok(['msg'=>'Order cancelled.']);
    }

    elseif ($action === 'ban_user') {
        $auid = (int)($_POST['user_id'] ?? 0);
        if ($auid < 1) json_err('Invalid user ID.');
        db_execute("UPDATE users SET status='banned' WHERE id=? AND role!='admin'", [$auid]);
        db_audit($uid,'ban_user','user',$auid,'');
        json_ok(['msg'=>'User banned.']);
    }

    elseif ($action === 'unban_user') {
        $auid = (int)($_POST['user_id'] ?? 0);
        if ($auid < 1) json_err('Invalid user ID.');
        db_execute("UPDATE users SET status='active' WHERE id=?", [$auid]);
        db_audit($uid,'unban_user','user',$auid,'');
        json_ok(['msg'=>'User unbanned.']);
    }

    elseif ($action === 'change_user_role') {
        $auid     = (int)($_POST['user_id'] ?? 0);
        $new_role = trim($_POST['new_role'] ?? '');
        if ($auid < 1) json_err('Invalid user ID.');
        if (!in_array($new_role, ['client','editor'])) json_err('Invalid role. Cannot promote to admin via dashboard.');
        db_execute("UPDATE users SET role=? WHERE id=? AND role!='admin'", [$new_role,$auid]);
        db_audit($uid,'change_role','user',$auid,"role=$new_role");
        json_ok(['msg'=>"Role changed to $new_role."]);
    }

    elseif ($action === 'delete_user') {
        // Soft delete: anonymize PII, preserve order/payment history for accounting
        $auid = (int)($_POST['user_id'] ?? 0);
        if ($auid < 1) json_err('Invalid user ID.');
        $target = db_fetch("SELECT * FROM users WHERE id=? LIMIT 1", [$auid]);
        if (!$target) json_err('User not found.');
        if ($target['role'] === 'admin') json_err('Cannot delete an admin account.');
        $ghost = 'deleted_'.$auid;
        db_execute(
            "UPDATE users SET username=?,email=?,name='[Deleted User]',password_hash='',avatar='',status='deleted',deleted_at=datetime('now') WHERE id=?",
            [$ghost, $ghost.'@deleted.invalid', $auid]
        );
        db_execute("DELETE FROM user_notes WHERE user_id=?", [$auid]);
        db_execute("DELETE FROM notifications WHERE user_id=?", [$auid]);
        db_audit($uid,'soft_delete_user','user',$auid,"was:{$target['email']} role:{$target['role']}");
        json_ok(['msg'=>'User anonymized. Order history preserved for accounting.']);
    }

    elseif ($action === 'hard_delete_user') {
        $auid      = (int)($_POST['user_id'] ?? 0);
        $confirmed = trim($_POST['confirmed'] ?? '');
        if ($auid < 1) json_err('Invalid user ID.');
        $target = db_fetch("SELECT * FROM users WHERE id=? LIMIT 1", [$auid]);
        if (!$target) json_err('User not found.');
        if ($target['role'] === 'admin') json_err('Cannot delete an admin account.');
        $order_count  = (int)db_value("SELECT COUNT(*) FROM orders WHERE client_id=? OR editor_id=?", [$auid,$auid]);
        $ticket_count = (int)db_value("SELECT COUNT(*) FROM support_tickets WHERE user_id=?", [$auid]);
        if ($confirmed !== 'CONFIRMED') {
            json_ok([
                'needs_confirm' => true,
                'impact'        => ['orders'=>$order_count,'tickets'=>$ticket_count,'name'=>$target['name'],'email'=>$target['email']],
                'msg'           => "Will permanently delete {$target['name']}: $order_count orders, $ticket_count tickets.",
            ]);
        }
        db_audit($uid,'hard_delete_user','user',$auid,"was:{$target['email']} orders:$order_count");
        db_execute("UPDATE orders SET editor_id=NULL WHERE editor_id=?", [$auid]);
        db_execute("DELETE FROM users WHERE id=?", [$auid]);
        json_ok(['msg'=>'User permanently deleted.']);
    }

    elseif ($action === 'get_user_detail') {
        $auid = (int)($_POST['user_id'] ?? 0);
        if ($auid < 1) json_err('Invalid user ID.');
        $u = db_fetch("SELECT id,username,name,email,role,status,avatar,created_at,last_login FROM users WHERE id=? LIMIT 1", [$auid]);
        if (!$u) json_err('User not found.');
        // Parallelize 3 independent simple reads; notes has a JOIN so runs sequentially after.
        $par = db_fetch_parallel([
            ["SELECT id,title,status,payment_amount,created_at FROM orders WHERE client_id=? OR editor_id=? ORDER BY created_at DESC LIMIT 20", [$auid,$auid]],
            ["SELECT id,subject,status,created_at FROM support_tickets WHERE user_id=? ORDER BY created_at DESC LIMIT 10", [$auid]],
            ["SELECT status,submitted_at,reviewed_at,admin_note FROM editor_applications WHERE user_id=? LIMIT 1", [$auid]],
        ]);
        $orders  = $par[0];
        $tickets = $par[1];
        $app     = $par[2][0] ?? null;
        $notes   = db_fetch_all("SELECT n.*,a.name as admin_name FROM user_notes n LEFT JOIN users a ON a.id=n.admin_id WHERE n.user_id=? ORDER BY n.created_at DESC", [$auid]);
        json_ok(['user'=>$u,'orders'=>$orders,'tickets'=>$tickets,'notes'=>$notes,'application'=>$app]);
    }

    elseif ($action === 'add_user_note') {
        $auid = (int)($_POST['user_id'] ?? 0);
        $note = trim($_POST['note'] ?? '');
        if ($auid < 1 || !$note) json_err('User ID and note text required.');
        $id = db_insert("INSERT INTO user_notes (user_id,admin_id,note) VALUES (?,?,?)", [$auid,$uid,$note]);
        db_audit($uid,'add_note','user',$auid,substr($note,0,80));
        json_ok(['msg'=>'Note added.','note_id'=>$id]);
    }

    elseif ($action === 'delete_user_note') {
        $nid = (int)($_POST['note_id'] ?? 0);
        if ($nid < 1) json_err('Invalid note ID.');
        db_execute("DELETE FROM user_notes WHERE id=?", [$nid]);
        json_ok(['msg'=>'Note deleted.']);
    }

    elseif ($action === 'approve_editor') {
        $app_id = (int)($_POST['app_id'] ?? 0);
        $auid   = (int)($_POST['user_id'] ?? 0);
        if ($app_id < 1 || $auid < 1) json_err('Invalid IDs.');
        db_execute("UPDATE editor_applications SET status='approved',reviewed_at=datetime('now') WHERE id=?", [$app_id]);
        db_execute("UPDATE users SET status='active' WHERE id=? AND role='editor'", [$auid]);
        db_notify($auid,'success','Application Approved!','Your editor application was approved. Welcome to the team!','/dashboard?tab=jobs');
        db_audit($uid,'approve_editor','user',$auid,'');
        json_ok(['msg'=>'Editor approved.']);
    }

    elseif ($action === 'reject_editor') {
        $app_id = (int)($_POST['app_id'] ?? 0);
        $auid   = (int)($_POST['user_id'] ?? 0);
        $note   = trim($_POST['admin_note'] ?? '');
        if ($app_id < 1 || $auid < 1) json_err('Invalid IDs.');

        // Fetch email before deleting so we can remove the Supabase auth user
        $target_editor = db_fetch("SELECT email, username FROM users WHERE id=? AND role='editor' LIMIT 1", [$auid]);

        // Mark application rejected
        db_execute("UPDATE editor_applications SET status='rejected',admin_note=?,reviewed_at=NOW() WHERE id=?", [$note,$app_id]);

        // Notify the editor before deleting their account
        try {
            db_notify($auid,'error','Application Not Approved','Your editor application was not approved.'.($note?" Feedback: $note":''),'/login');
        } catch (Throwable) {}

        db_audit($uid,'reject_editor','user',$auid,$note);

        // Hard delete from public.users (account no longer needed)
        db_execute("DELETE FROM editor_applications WHERE user_id=?", [$auid]);
        db_execute("DELETE FROM notifications WHERE user_id=?", [$auid]);
        db_execute("DELETE FROM users WHERE id=? AND role='editor'", [$auid]);

        // Best-effort: also delete from Supabase auth so the email is free to re-register
        if ($target_editor && !empty($target_editor['email'])) {
            try {
                // Search Supabase admin users by email to get the Supabase UID
                $search_url = SUPABASE_URL . '/auth/v1/admin/users?filter=' . urlencode($target_editor['email']);
                $ch = curl_init($search_url);
                curl_setopt_array($ch, [
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_TIMEOUT        => 8,
                    CURLOPT_HTTPHEADER     => [
                        'apikey: '               . SUPABASE_KEY,
                        'Authorization: Bearer ' . SUPABASE_KEY,
                    ],
                ]);
                $r    = curl_exec($ch);
                $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($code === 200 && $r) {
                    $parsed = json_decode($r, true);
                    $sbUsers = $parsed['users'] ?? ($parsed ?? []);
                    foreach ((array)$sbUsers as $sbu) {
                        if (isset($sbu['email']) && strtolower($sbu['email']) === strtolower($target_editor['email'])) {
                            $del_url = SUPABASE_URL . '/auth/v1/admin/users/' . $sbu['id'];
                            $dch = curl_init($del_url);
                            curl_setopt_array($dch, [
                                CURLOPT_RETURNTRANSFER => true,
                                CURLOPT_CUSTOMREQUEST  => 'DELETE',
                                CURLOPT_TIMEOUT        => 8,
                                CURLOPT_HTTPHEADER     => [
                                    'apikey: '               . SUPABASE_KEY,
                                    'Authorization: Bearer ' . SUPABASE_KEY,
                                ],
                            ]);
                            curl_exec($dch);
                            curl_close($dch);
                            break;
                        }
                    }
                }
            } catch (Throwable $del_e) {
                error_log('[ExtoArts] reject_editor: Supabase delete failed for ' . ($target_editor['email'] ?? '?') . ': ' . $del_e->getMessage());
            }
        }

        json_ok(['msg' => 'Editor rejected and account removed.']);
    }

    elseif ($action === 'reply_ticket') {
        $tid = (int)($_POST['ticket_id'] ?? 0);
        $msg = trim($_POST['reply_message'] ?? '');
        $tst = trim($_POST['ticket_status'] ?? 'in_progress');
        if ($tid < 1 || !$msg) json_err('Ticket ID and message required.');
        db_insert("INSERT INTO ticket_replies (ticket_id,sender_id,sender_role,message) VALUES (?,0,'admin',?)", [$tid,$msg]);
        $resolved = in_array($tst,['resolved','closed']) ? ",resolved_at=datetime('now')" : '';
        db_execute("UPDATE support_tickets SET status=?,updated_at=datetime('now') $resolved WHERE id=?", [$tst,$tid]);
        $t = db_fetch("SELECT user_id,subject FROM support_tickets WHERE id=? LIMIT 1", [$tid]);
        if ($t && $t['user_id']) db_notify((int)$t['user_id'],'info','Ticket Update',"Admin replied to: \"{$t['subject']}\"","/ticket?id=$tid");
        db_audit($uid,'reply_ticket','ticket',$tid,substr($msg,0,80));
        json_ok(['msg'=>'Reply sent.']);
    }

    elseif ($action === 'close_ticket') {
        $tid = (int)($_POST['ticket_id'] ?? 0);
        if ($tid < 1) json_err('Invalid ticket ID.');
        db_execute("UPDATE support_tickets SET status='closed',resolved_at=datetime('now'),updated_at=datetime('now') WHERE id=?", [$tid]);
        db_audit($uid,'close_ticket','ticket',$tid,'');
        json_ok(['msg'=>'Ticket closed.']);
    }

    elseif ($action === 'save_payment_method') {
        $id    = (int)($_POST['pm_id'] ?? 0);
        $type  = trim($_POST['pm_type'] ?? '');
        $label = trim($_POST['pm_label'] ?? '');
        $value = trim($_POST['pm_value'] ?? '');
        $net   = trim($_POST['pm_network'] ?? '');
        $qr    = trim($_POST['pm_qr_url'] ?? '');
        $instr = trim($_POST['pm_instructions'] ?? '');
        $sort  = (int)($_POST['pm_sort'] ?? 0);
        if (!$type || !$label || !$value) json_err('Type, label, and value are required.');
        if ($id > 0) {
            db_execute("UPDATE payment_methods SET type=?,label=?,value=?,network=?,qr_url=?,instructions=?,sort_order=? WHERE id=?", [$type,$label,$value,$net,$qr,$instr,$sort,$id]);
            json_ok(['msg'=>'Payment method updated.']);
        } else {
            $nid = db_insert("INSERT INTO payment_methods (type,label,value,network,qr_url,instructions,sort_order) VALUES (?,?,?,?,?,?,?)", [$type,$label,$value,$net,$qr,$instr,$sort]);
            json_ok(['msg'=>'Payment method added.','id'=>$nid]);
        }
    }

    elseif ($action === 'delete_payment_method') {
        $id = (int)($_POST['pm_id'] ?? 0);
        if ($id < 1) json_err('Invalid ID.');
        db_execute("DELETE FROM payment_methods WHERE id=?", [$id]);
        json_ok(['msg'=>'Deleted.']);
    }

    elseif ($action === 'toggle_payment_method') {
        $id = (int)($_POST['pm_id'] ?? 0);
        if ($id < 1) json_err('Invalid ID.');
        db_execute("UPDATE payment_methods SET is_active=1-is_active WHERE id=?", [$id]);
        $active = (int)db_value("SELECT is_active FROM payment_methods WHERE id=? LIMIT 1", [$id]);
        json_ok(['msg'=>$active?'Enabled.':'Disabled.','active'=>$active]);
    }

    elseif ($action === 'send_notification') {
        $auid  = (int)($_POST['user_id'] ?? 0);
        $title = trim($_POST['notif_title'] ?? '');
        $body  = trim($_POST['notif_body'] ?? '');
        $link_raw = trim($_POST['notif_link'] ?? '/dashboard');
        // Allow only safe relative paths or https links - never javascript: or data: URIs
        $link = preg_match('/^https?:\/\//i', $link_raw) ? $link_raw : (preg_match('/^\/[a-zA-Z0-9\/?=&#_\-%.]*$/', $link_raw) ? $link_raw : '/dashboard');
        $types = ['info','success','warning','error'];
        $type  = in_array($_POST['notif_type']??'info', $types) ? $_POST['notif_type'] : 'info';
        if (!$title) json_err('Notification title required.');
        if ($auid > 0) {
            db_notify($auid,$type,$title,$body,$link);
            json_ok(['msg'=>'Notification sent.']);
        } else {
            $all = db_fetch_all("SELECT id FROM users WHERE status='active' AND role!='admin'");
            foreach ($all as $u2) db_notify((int)$u2['id'],$type,$title,$body,$link);
            json_ok(['msg'=>'Broadcast sent to '.count($all).' users.']);
        }
    }

    else { json_err('Unknown admin action: '.htmlspecialchars($action)); }
}

// ═══════════════════════════════════════════════════════
// CLIENT
// ═══════════════════════════════════════════════════════
elseif ($role === 'client') {

    if ($action === 'submit_half_payment') {
        $oid  = (int)($_POST['order_id'] ?? 0);
        $ref  = trim($_POST['payment_ref'] ?? '');
        $note = trim($_POST['payment_note'] ?? '');
        if ($oid < 1 || !$ref) json_err('Order ID and payment reference are required.');
        $o = get_order_secured($oid,$uid,$role);
        if (!$o) json_err('Order not found.');
        if ($o['status'] !== 'awaiting_half_payment') json_err('Order is not currently awaiting half payment.');
        $half = (float)($o['payment_amount']??0) > 0 ? round((float)$o['payment_amount']/2, 2) : null;
        db_insert("INSERT INTO order_payments (order_id,payment_type,amount,reference,note,submitted_by) VALUES (?,'half',?,?,?,?)", [$oid,$half,$ref,$note,$uid]);
        db_execute("UPDATE orders SET status='half_paid',updated_at=datetime('now') WHERE id=? AND client_id=?", [$oid,$uid]);
        json_ok(['msg'=>'Payment reference submitted. We will verify and start work shortly.']);
    }

    elseif ($action === 'submit_final_payment') {
        $oid  = (int)($_POST['order_id'] ?? 0);
        $ref  = trim($_POST['payment_ref'] ?? '');
        $note = trim($_POST['payment_note'] ?? '');
        if ($oid < 1 || !$ref) json_err('Order ID and payment reference are required.');
        $o = get_order_secured($oid,$uid,$role);
        if (!$o) json_err('Order not found.');
        if ($o['status'] !== 'awaiting_final_payment') json_err('Order is not awaiting final payment.');
        $half = (float)($o['payment_amount']??0) > 0 ? round((float)$o['payment_amount']/2, 2) : null;
        db_insert("INSERT INTO order_payments (order_id,payment_type,amount,reference,note,submitted_by) VALUES (?,'final',?,?,?,?)", [$oid,$half,$ref,$note,$uid]);
        db_execute("UPDATE orders SET status='final_paid',updated_at=datetime('now') WHERE id=? AND client_id=?", [$oid,$uid]);
        json_ok(['msg'=>'Final payment submitted. We will verify and complete your order.']);
    }

    elseif ($action === 'request_revision') {
        $oid  = (int)($_POST['order_id'] ?? 0);
        $note = trim($_POST['note'] ?? '');
        if ($oid < 1) json_err('Invalid order.');
        $o = get_order_secured($oid,$uid,$role);
        if (!$o) json_err('Order not found.');
        if (!in_array($o['status'],['in_progress','awaiting_final_payment'])) json_err('Revisions can only be requested while work is active.');
        db_execute("UPDATE orders SET status='revision',admin_note=?,updated_at=datetime('now') WHERE id=? AND client_id=?", [$note?:$o['admin_note'],$oid,$uid]);
        if ($o['editor_id']) db_notify((int)$o['editor_id'],'warning','Revision Requested',"Client requested revision on \"{$o['title']}\".".($note?" Note: $note":''),'/dashboard?tab=work');
        json_ok(['msg'=>'Revision requested. Your editor has been notified.']);
    }

    elseif ($action === 'mark_notifications_read') {
        db_execute("UPDATE notifications SET is_read=1 WHERE user_id=?", [$uid]);
        json_ok(['msg'=>'Marked read.']);
    }

    else { json_err('Unknown client action.'); }
}

// ═══════════════════════════════════════════════════════
// EDITOR
// ═══════════════════════════════════════════════════════
elseif ($role === 'editor') {

    if (($user['status']??'') !== 'active') json_err('Your editor account is not yet active.');

    if ($action === 'express_interest') {
        $oid = (int)($_POST['order_id'] ?? 0);
        $msg = trim($_POST['message'] ?? '');
        if ($oid < 1) json_err('Invalid order ID.');
        $o = db_fetch("SELECT * FROM orders WHERE id=? AND status='pending' AND editor_id IS NULL LIMIT 1", [$oid]);
        if (!$o) json_err('This order is no longer available.');
        $existing = db_fetch("SELECT id FROM order_interests WHERE order_id=? AND editor_id=? LIMIT 1", [$oid,$uid]);
        if ($existing) json_err('You have already expressed interest in this order.');
        db_insert("INSERT INTO order_interests (order_id,editor_id,message) VALUES (?,?,?)", [$oid,$uid,$msg]);
        json_ok(['msg'=>'Interest sent. You will be assigned if selected.']);
    }

    elseif ($action === 'withdraw_interest') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order ID.');
        db_execute("DELETE FROM order_interests WHERE order_id=? AND editor_id=?", [$oid,$uid]);
        json_ok(['msg'=>'Interest withdrawn.']);
    }

    elseif ($action === 'submit_delivery') {
        $oid  = (int)($_POST['order_id'] ?? 0);
        $link = trim($_POST['delivery_link'] ?? '');
        if ($oid < 1 || !$link) json_err('Order ID and delivery link are required.');
        if (!filter_var($link, FILTER_VALIDATE_URL)) json_err('Please enter a valid URL.');
        $o = get_order_secured($oid,$uid,$role);
        if (!$o) json_err('Assignment not found.');
        if (!in_array($o['status'],['in_progress','revision'])) json_err('Order must be in progress or revision.');
        db_execute("UPDATE orders SET delivery_link=?,status='awaiting_final_payment',updated_at=datetime('now') WHERE id=? AND editor_id=?", [$link,$oid,$uid]);
        if ($o['client_id']) db_notify((int)$o['client_id'],'success','Delivery Ready',"Order \"{$o['title']}\" delivered! Review and make final payment.",'/dashboard');
        json_ok(['msg'=>'Delivery submitted. Client will make the final payment.']);
    }

    elseif ($action === 'mark_revision_done') {
        $oid = (int)($_POST['order_id'] ?? 0);
        if ($oid < 1) json_err('Invalid order.');
        $o = get_order_secured($oid,$uid,$role);
        if (!$o || $o['status'] !== 'revision') json_err('Order is not in revision.');
        db_execute("UPDATE orders SET status='in_progress',updated_at=datetime('now') WHERE id=? AND editor_id=?", [$oid,$uid]);
        json_ok(['msg'=>'Marked back in progress.']);
    }

    elseif ($action === 'update_profile') {
        $bio          = trim($_POST['bio'] ?? '');
        $specialties  = trim($_POST['specialties'] ?? '');
        $tools        = trim($_POST['tools'] ?? '');
        $portfolio_url= trim($_POST['portfolio_url'] ?? '');
        $timezone     = trim($_POST['timezone'] ?? '');
        $availability = trim($_POST['availability'] ?? '');
        $avatar_url   = trim($_POST['avatar_url'] ?? '');
        if ($portfolio_url && !filter_var($portfolio_url, FILTER_VALIDATE_URL)) json_err('Portfolio URL is not valid.');
        if ($avatar_url && !filter_var($avatar_url, FILTER_VALIDATE_URL)) json_err('Avatar URL is not valid.');
        db_execute(
            "INSERT INTO editor_profiles (user_id,bio,specialties,tools,portfolio_url,timezone,availability,avatar_url,updated_at)
             VALUES (?,?,?,?,?,?,?,?,datetime('now'))
             ON CONFLICT(user_id) DO UPDATE SET bio=excluded.bio,specialties=excluded.specialties,tools=excluded.tools,
             portfolio_url=excluded.portfolio_url,timezone=excluded.timezone,availability=excluded.availability,
             avatar_url=excluded.avatar_url,updated_at=excluded.updated_at",
            [$uid,$bio,$specialties,$tools,$portfolio_url,$timezone,$availability,$avatar_url]
        );
        if ($avatar_url) {
            db_execute("UPDATE users SET avatar=? WHERE id=?", [$avatar_url,$uid]);
            $_SESSION['user']['avatar'] = $avatar_url;
        }
        json_ok(['msg'=>'Profile updated successfully.']);
    }

    elseif ($action === 'mark_notifications_read') {
        db_execute("UPDATE notifications SET is_read=1 WHERE user_id=?", [$uid]);
        json_ok(['msg'=>'Marked read.']);
    }

    else { json_err('Unknown editor action.'); }
}

else { json_err('Unauthorized role.'); }

} catch (Throwable $e) {
    error_log('[ExtoArts] order-action: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    json_err('Server error. Please try again.', 500);
}
