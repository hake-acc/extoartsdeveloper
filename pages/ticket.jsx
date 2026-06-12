import Head from 'next/head';
import Layout from '../components/Layout';

export default function Page() {
  return (
    <Layout currentPage="ticket">
      <Head>
        <title>Support Tickets | ExtoArts</title>
        <meta name="description" content="ExtoArts - YouTube Video Editing Agency" />
      </Head>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title></title>
<meta name="robots" content="noindex, nofollow" />
<link rel="icon" type="image/png" href="https://i.ibb.co/JR76yvRp/1758037248-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800;900&display=swap" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
<script src="https://cdn.lordicon.com/lordicon.js" defer></script>
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
<div className="topbar">
    <a href="/" className="topbar-brand">
        <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
        <span>ExtoArts</span>
    </a>
    <div className="topbar-right">
        
        <a href="/dashboard"><i className="fas fa-home" style="margin-right:5px;"></i>Dashboard</a>
        <a href="/logout" style="color:#ef4444;">Logout</a>
        
        <a href="/login">Sign In</a>
        <a href="/">Home</a>
        
    </div>
</div>

<div className="container">
    <div className="page-head">
        <span className="badge">Support Center</span>
        <div style="margin:14px 0 20px;"><lord-icon src="https://cdn.lordicon.com/oqdmuxru.json" trigger="loop" delay="1500" colors="primary:#00c4f0" style="width:58px;height:58px;"></lord-icon></div>
        <h1>How can we help?</h1>
        <p>Submit a ticket and our team will get back to you. Usually within 24 hours.</p>
    </div>

    
    <div className="tab-bar">
        <button className="tab-btn " onclick="setTab('new')"><i className="fas fa-plus" style="margin-right:6px;"></i>New Ticket</button>
        <button className="tab-btn " onclick="setTab('list')"><i className="fas fa-list" style="margin-right:6px;"></i>My Tickets</button>
    </div>
    

    
    <div className="card" style="padding:0;overflow:hidden;">
        <div className="t-header">
            <h2></h2>
            <div className="t-header-meta">
                
                <span className="status-pill" style="background:22;color:;border:1px solid 44;"></span>
                
                <span className="status-pill" style="background:22;color:;border:1px solid 44;"> Priority</span>
                <span style="font-size:0.78rem;color:var(--text-muted);"></span>
                <span style="font-size:0.78rem;color:var(--text-muted);">Ticket #</span>
                <span style="font-size:0.78rem;color:var(--text-muted);"></span>
            </div>
        </div>

        <div className="alert alert-success" style="margin:16px 24px 0;"><i className="fas fa-check-circle" style="margin-right:8px;"></i>Reply sent successfully.</div>

        <div className="message-thread">
            <div className="msg">
                <div className="msg-avatar" style="background:rgba(255,255,255,0.08);">
                    <img src="" style="width:36px;height:36px;border-radius:50%;" alt=" profile photo" />
                </div>
                <div className="msg-body">
                    <div className="msg-meta"><span className="sender"></span><span></span></div>
                    <div className="msg-text"></div>
                </div>
            </div>

            
            <div className="msg ">
                <div className="msg-avatar">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <div className="msg-body">
                    <div className="msg-meta">
                        <span className="sender" style=""></span>
                        <span></span>
                    </div>
                    <div className="msg-text"></div>
                </div>
            </div>
            
        </div>

        
        <div className="reply-box">
            <h3>Add a Reply</h3>
            
            <div className="alert alert-error"><i className="fas fa-exclamation-circle" style="margin-right:8px;"></i></div>
            
            <form method="POST">
                
                <input type="hidden" name="reply_ticket" value="1" />
                <div className="form-group">
                    <textarea name="reply_message" placeholder="Describe your update or additional information..." required></textarea>
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i>Send Reply</button>
                    <a href="/ticket?my=1" className="btn btn-outline">Back to Tickets</a>
                </div>
            </form>
        </div>
        
        <div style="padding:20px 24px;border-top:1px solid var(--border);">
            <div className="alert alert-info" style="margin:0;"><i className="fas fa-lock" style="margin-right:8px;"></i>This ticket is closed. <a href="/ticket" style="color:var(--primary);">Open a new ticket</a> if you need further help.</div>
        </div>
        
    </div>

    
    
    <div className="empty-state"><i className="fas fa-ticket-alt"></i><h3>No tickets yet</h3><p>Submit a support ticket and we'll get back to you within 24 hours.</p><button className="btn btn-primary" onclick="setTab('new')" style="margin-top:20px;"><i className="fas fa-plus"></i>New Ticket</button></div>
    
    <div className="ticket-list">
        
        
        <a href="/ticket?id=" className="ticket-row">
            <div className="t-id">#</div>
            <div className="t-info">
                <div className="t-subject"></div>
                <div className="t-meta"> &middot; </div>
            </div>
            <div className="t-status">
                <span className="status-pill" style="background:22;color:;border:1px solid 44;"></span>
            </div>
        </a>
        
    </div>
    

    
    
    <div className="alert alert-success"><i className="fas fa-check-circle" style="margin-right:8px;"></i><strong>Ticket submitted successfully!</strong> We'll respond to your email within 24 hours.</div>
    
    
    <div className="alert alert-error"><i className="fas fa-exclamation-circle" style="margin-right:8px;"></i><br /></div>
    

    <div className="card">
        <form method="POST" id="ticketForm">
            
            
            <div className="two-col" style="margin-bottom:0;">
                <div className="form-group">
                    <label>Your Name <span className="req">*</span></label>
                    <input type="text" name="name" value="" required maxLength="255" />
                </div>
                <div className="form-group">
                    <label>Email Address <span className="req">*</span></label>
                    <input type="email" name="email" value="" required />
                    <small>We'll reply to this address</small>
                </div>
            </div>
            
            <input type="hidden" name="name" value="" />
            <input type="hidden" name="email" value="" />
            

            <div className="form-group">
                <label>Subject <span className="req">*</span></label>
                <input type="text" name="subject" value="" placeholder="Briefly describe your issue" required maxLength="500" />
            </div>

            <div className="two-col">
                <div className="form-group">
                    <label>Category <span className="req">*</span></label>
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
                <div className="form-group">
                    <label>Priority</label>
                    <select name="priority">
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Message <span className="req">*</span></label>
                <textarea name="message" placeholder="Describe your issue in detail. Include any order IDs, error messages, or relevant context..." required></textarea>
                <small>Minimum 20 characters. The more detail, the faster we can help.</small>
            </div>

            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i>Submit Ticket</button>
                
                <button type="button" className="btn btn-outline" onclick="setTab('list')">View My Tickets</button>
                
                <span style="font-size:0.8rem;color:var(--text-muted);">Usually responded within 24 hours</span>
            </div>
        </form>
    </div>

    <div style="margin-top:28px;display:flex;gap:20px;flex-wrap:wrap;">
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:rgba(88,101,242,0.1);border:1px solid rgba(88,101,242,0.25);border-radius:14px;color:var(--text-main);font-size:0.88rem;font-weight:700;transition:0.2s;" onmouseover="this.style.borderColor='#5865f2'" onmouseout="this.style.borderColor='rgba(88,101,242,0.25)'"><i className="fab fa-discord" style="color:#5865f2;font-size:1.2rem;"></i>For urgent help, join our Discord</a>
    </div>
    
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

    </Layout>
  );
}
