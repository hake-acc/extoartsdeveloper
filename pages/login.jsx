import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('oauth_error')) setOauthError(decodeURIComponent(p.get('oauth_error')));
    if (p.get('expired')) setError('Your session expired. Please sign in again.');
    // Apply saved theme
    const t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.session) {
      const r = await fetch('/api/auth-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session.access_token, provider: 'email' }),
      });
      const result = await r.json();
      if (result.ok) router.push(result.redirect || '/dashboard');
      else { setError(result.error || 'Sign-in failed.'); setLoading(false); }
    }
  }

  async function signInWithGoogle() {
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback', queryParams: { access_type: 'offline', prompt: 'select_account' } },
    });
    if (err) setError(err.message);
  }

  async function signInWithDiscord() {
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/auth/callback', scopes: 'identify email' },
    });
    if (err) setError(err.message);
  }

  return (
    <>
      <Head>
        <title>Sign In | ExtoArts</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800;900&display=swap" />
      </Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#050508;--surface:#0d0d1c;--primary:#22d3ee;--border:#1e2035;--text-main:#f0f0f5;--text-muted:#6b7280;--radius:14px}
        [data-theme=light]{--bg:#f8fafc;--surface:#fff;--text-main:#111827;--text-muted:#6b7280;--border:#e5e7eb}
        body{background:var(--bg);color:var(--text-main);font-family:Urbanist,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .wrap{width:100%;max-width:420px}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-main);font-weight:900;font-size:1.3rem;justify-content:center;margin-bottom:32px}
        .logo img{width:36px;height:36px;border-radius:50%}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px}
        h1{font-size:1.5rem;font-weight:900;margin-bottom:6px}
        .sub{color:var(--text-muted);font-size:0.9rem;margin-bottom:24px}
        .oauth-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px;border-radius:10px;font-weight:700;font-size:0.92rem;cursor:pointer;border:1px solid var(--border);background:var(--bg);color:var(--text-main);transition:.15s;margin-bottom:10px;font-family:inherit}
        .oauth-btn:hover{border-color:var(--primary);color:var(--primary)}
        .oauth-btn.google:hover{border-color:#ea4335;color:#ea4335}
        .divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text-muted);font-size:0.8rem}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
        label{display:block;font-size:0.82rem;font-weight:700;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em}
        input{width:100%;padding:12px 14px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text-main);font-size:0.95rem;font-family:inherit;outline:none;transition:.15s;margin-bottom:16px}
        input:focus{border-color:var(--primary)}
        .btn-main{width:100%;padding:14px;background:var(--primary);color:#000;font-weight:900;font-size:1rem;border:none;border-radius:10px;cursor:pointer;font-family:inherit;transition:.15s}
        .btn-main:hover{opacity:.88}
        .btn-main:disabled{opacity:.5;cursor:not-allowed}
        .error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5;border-radius:9px;padding:12px 16px;font-size:0.88rem;margin-bottom:16px}
        .links{text-align:center;margin-top:20px;font-size:0.88rem;color:var(--text-muted)}
        .links a{color:var(--primary);text-decoration:none;font-weight:700}
      `}</style>
      <div className="wrap">
        <a href="/" className="logo">
          <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
          ExtoArts
        </a>
        <div className="card">
          <h1>Welcome back</h1>
          <p className="sub">Sign in to your ExtoArts account</p>

          {(error || oauthError) && <div className="error">{error || oauthError}</div>}

          <button className="oauth-btn" onClick={signInWithDiscord}>
            <i className="fab fa-discord" style={{color:'#5865f2',fontSize:'1.1rem'}} /> Continue with Discord
          </button>
          <button className="oauth-btn google" onClick={signInWithGoogle}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/></svg>
            Continue with Google
          </button>

          <div className="divider">or sign in with email</div>

          <form onSubmit={handleEmailLogin}>
            <label>Email</label>
            <input type="email" placeholder="you@gmail.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
            <label>Password</label>
            <input type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required />
            <button type="submit" className="btn-main" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          <div className="links">
            No account? <a href="/register">Create one</a>
          </div>
        </div>
      </div>
    </>
  );
}
