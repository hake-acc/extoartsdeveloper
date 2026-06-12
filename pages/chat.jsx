import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  const router = useRouter();
  const { oid } = router.query;
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [optimistic, setOptimistic] = useState([]);
  const lastTs = useRef(null);
  const endRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => {
      if (!d.ok) { window.parent.postMessage('chat:unauth', '*'); return; }
      setUser(d.user);
    });
  }, []);

  useEffect(() => {
    if (!oid || !user) return;
    // Initial fetch - full history
    fetchMessages(true);
    pollRef.current = setInterval(() => fetchMessages(false), 2500);
    return () => clearInterval(pollRef.current);
  }, [oid, user]);

  async function fetchMessages(initial) {
    const url = `/api/chat-poll?oid=${oid}${!initial && lastTs.current ? '&after=' + encodeURIComponent(lastTs.current) : ''}`;
    const r = await fetch(url);
    const data = await r.json();
    if (!data.ok) return;
    if (initial) {
      setMessages(data.messages || []);
      const last = data.messages?.at(-1);
      lastTs.current = last ? last.created_at : new Date().toISOString();
    } else if (data.messages?.length) {
      setMessages(prev => {
        const ids = new Set(prev.map(m => m.id));
        const newMsgs = data.messages.filter(m => !ids.has(m.id));
        const merged = [...prev, ...newMsgs].sort((a,b) => a.created_at > b.created_at ? 1 : -1);
        lastTs.current = merged.at(-1)?.created_at || lastTs.current;
        // Clear matching optimistic messages
        setOptimistic(o => o.filter(om => !newMsgs.some(m => m.text === om.text)));
        return merged;
      });
    }
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, optimistic]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const msgText = text.trim();
    setText('');
    setSending(true);
    const tempId = Date.now();
    setOptimistic(o => [...o, { id: tempId, text: msgText, sender_name: user.username, sender_role: user.role, sending: true }]);
    const r = await fetch('/api/chat-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: oid, text: msgText }),
    });
    const data = await r.json();
    if (!data.ok) {
      setOptimistic(o => o.map(m => m.id === tempId ? { ...m, failed: true, sending: false } : m));
    }
    setSending(false);
  }

  const allMessages = [
    ...messages.map(m => ({ ...m, type: 'confirmed' })),
    ...optimistic.filter(o => !messages.some(m => m.text === o.text)).map(o => ({ ...o, type: 'optimistic' })),
  ];

  return (
    <>
      <Head>
        <title>Chat | ExtoArts</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800&display=swap" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#07070c;--surface:#0d0d1c;--primary:#22d3ee;--border:#1e2035;--text-main:#f0f0f5;--text-muted:#6b7280}
        [data-theme=light]{--bg:#f8fafc;--surface:#fff;--text-main:#111827;--border:#e5e7eb}
        body{background:var(--bg);color:var(--text-main);font-family:Urbanist,sans-serif;height:100vh;display:flex;flex-direction:column}
        .chat-header{padding:10px 14px;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.88rem}
        .chat-body{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
        .chat-body:empty::before{content:"No messages yet - start the conversation.";color:var(--text-muted);font-size:0.88rem;text-align:center;margin:auto}
        .msg{max-width:78%;padding:9px 13px;border-radius:12px;font-size:0.88rem;line-height:1.5;word-break:break-word}
        .msg.mine{background:rgba(34,211,238,.12);align-self:flex-end;border-bottom-right-radius:4px}
        .msg.theirs{background:var(--surface);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:4px}
        .msg.optimistic{opacity:.55}
        .msg.failed{opacity:.8;border:1px solid rgba(239,68,68,.4)!important;background:rgba(239,68,68,.06)!important}
        .msg-name{font-size:0.72rem;font-weight:700;color:var(--text-muted);margin-bottom:2px}
        .chat-input-row{padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:8px}
        textarea{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:9px;color:var(--text-main);font-family:inherit;font-size:0.88rem;padding:9px 12px;resize:none;outline:none;max-height:80px}
        textarea:focus{border-color:var(--primary)}
        button{padding:9px 16px;background:var(--primary);color:#000;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;font-family:inherit;flex-shrink:0}
        button:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
      <div className="chat-header">
        <i className="fas fa-comments" style={{color:'var(--primary)'}} />
        Order Chat {oid ? `#${String(oid).slice(0,8)}` : ''}
      </div>
      <div className="chat-body">
        {allMessages.map((m, i) => {
          const mine = m.sender_id === user?.id || (m.type === 'optimistic');
          return (
            <div key={m.id || i} className={`msg ${mine ? 'mine' : 'theirs'} ${m.sending ? 'optimistic' : ''} ${m.failed ? 'failed' : ''}`}>
              {!mine && <div className="msg-name">{m.sender_name} {m.sender_role && m.sender_role !== 'client' ? `[${m.sender_role}]` : ''}</div>}
              {m.text}
              {m.sending && <span style={{fontSize:'0.7rem',color:'var(--text-muted)',marginLeft:'6px'}}>sending...</span>}
              {m.failed && <span style={{fontSize:'0.7rem',color:'#ef4444',marginLeft:'6px'}}>failed</span>}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form className="chat-input-row" onSubmit={sendMessage}>
        <textarea
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
          autoFocus
        />
        <button type="submit" disabled={!text.trim() || sending}>
          <i className="fas fa-paper-plane" />
        </button>
      </form>
    </>
  );
}
