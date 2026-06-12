import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', role: 'client', agreed_tos: false });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tsToken, setTsToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    // Load Turnstile
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.appendChild(s);
    s.onload = () => {
      window.turnstile && window.turnstile.render('#ts-container', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTsToken(token),
        'expired-callback': () => setTsToken(''),
        'error-callback': () => setTsToken(''),
      });
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]); setLoading(true);

    // Server-side validation first
    const vRes = await fetch('/api/validate-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ts_token: tsToken }),
    });
    const vData = await vRes.json();
    if (!vData.ok) { setErrors(vData.errors || ['Validation failed.']); setLoading(false); window.turnstile?.reset('#ts-container'); return; }

    // Supabase signup
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username, role: form.role },
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (signUpErr) { setErrors([signUpErr.message]); setLoading(false); window.turnstile?.reset('#ts-container'); return; }

    if (data.session) {
      // Auto-confirmed (e.g. dev mode) - create PHP session
      const r = await fetch('/api/auth-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session.access_token, provider: 'email' }),
      });
      const result = await r.json();
      if (result.ok) router.push(form.role === 'editor' ? '/apply?notice=registered' : '/dashboard?notice=welcome');
      else { setErrors([result.error || 'Account created but sign-in failed.']); setLoading(false); }
    } else {
      // Email confirmation needed
      router.push('/login?notice=check-email');
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } });
  }
  async function signInWithDiscord() {
    await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin + '/auth/callback', scopes: 'identify email' } });
  }

  return (
    <>
      <Head>
        <title>Create Account | ExtoArts</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800;900&display=swap" />
      </Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#050508;--surface:#0d0d1c;--primary:#22d3ee;--border:#1e2035;--text-main:#f0f0f5;--text-muted:#6b7280}
        [data-theme=light]{--bg:#f8fafc;--surface:#fff;--text-main:#111827;--border:#e5e7eb}
        body{background:var(--bg);color:var(--text-main);font-family:Urbanist,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .wrap{width:100%;max-width:460px}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-main);font-weight:900;font-size:1.3rem;justify-content:center;margin-bottom:28px}
        .logo img{width:36px;height:36px;border-radius:50%}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:32px}
        h1{font-size:1.5rem;font-weight:900;margin-bottom:6px}
        .sub{color:var(--text-muted);font-size:0.9rem;margin-bottom:24px}
        .oauth-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:12px;border-radius:10px;font-weight:700;font-size:0.9rem;cursor:pointer;border:1px solid var(--border);background:var(--bg);color:var(--text-main);transition:.15s;margin-bottom:10px;font-family:inherit}
        .oauth-btn:hover{border-color:var(--primary)}
        .divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--text-muted);font-size:0.8rem}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
        label{display:block;font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em}
        input,select{width:100%;padding:11px 13px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text-main);font-size:0.93rem;font-family:inherit;outline:none;margin-bottom:14px}
        input:focus,select:focus{border-color:var(--primary)}
        .btn-main{width:100%;padding:13px;background:var(--primary);color:#000;font-weight:900;font-size:0.98rem;border:none;border-radius:10px;cursor:pointer;font-family:inherit}
        .btn-main:disabled{opacity:.5;cursor:not-allowed}
        .error-list{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5;border-radius:9px;padding:12px 16px;font-size:0.88rem;margin-bottom:16px;list-style:none}
        .error-list li::before{content:'• ';margin-right:4px}
        .check-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;font-size:0.88rem;color:var(--text-muted)}
        .check-row input{width:auto;margin:0;flex-shrink:0;margin-top:2px}
        .links{text-align:center;margin-top:18px;font-size:0.88rem;color:var(--text-muted)}
        .links a{color:var(--primary);text-decoration:none;font-weight:700}
      `}</style>
      <div className="wrap">
        <a href="/" className="logo">
          <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
          ExtoArts
        </a>
        <div className="card">
          <h1>Create account</h1>
          <p className="sub">Join as a client or editor</p>

          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}

          <button className="oauth-btn" onClick={signInWithDiscord}>
            <i className="fab fa-discord" style={{color:'#5865f2'}} /> Sign up with Discord
          </button>
          <button className="oauth-btn" onClick={signInWithGoogle}>
            <i className="fab fa-google" style={{color:'#ea4335'}} /> Sign up with Google
          </button>

          <div className="divider">or with email</div>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input type="text" placeholder="your_username" value={form.username} onChange={e => setForm({...form,username:e.target.value})} required minLength={3} maxLength={30} />
            <label>Email (Gmail or Yahoo only)</label>
            <input type="email" placeholder="you@gmail.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
            <label>Password</label>
            <input type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required minLength={8} />
            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({...form,confirm:e.target.value})} required />
            <label>I am joining as</label>
            <select value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
              <option value="client">Client (I want videos edited)</option>
              <option value="editor">Editor (I want to work here)</option>
            </select>
            <div id="ts-container" style={{marginBottom:'14px'}} />
            <div className="check-row">
              <input type="checkbox" id="tos" checked={form.agreed_tos} onChange={e => setForm({...form,agreed_tos:e.target.checked})} required />
              <label htmlFor="tos" style={{textTransform:'none',letterSpacing:'normal',fontWeight:400,color:'var(--text-muted)',margin:0}}>
                I agree to the <a href="/tos" target="_blank" style={{color:'var(--primary)',textDecoration:'none',fontWeight:700}}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{color:'var(--primary)',textDecoration:'none',fontWeight:700}}>Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="btn-main" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <div className="links">Already have an account? <a href="/login">Sign in</a></div>
        </div>
      </div>
    </>
  );
}
