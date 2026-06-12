import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState({ title: 'Completing sign-in...', msg: 'Please wait while we verify your account.', error: null });

  useEffect(() => {
    // Check for OAuth errors in URL (Supabase sends them to hash or query)
    const urlParams  = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const oauthError = urlParams.get('error') || hashParams.get('error');
    if (oauthError) {
      const desc = hashParams.get('error_description') || urlParams.get('error_description') || oauthError;
      setStatus({ title: 'Sign-in failed', msg: null, error: decodeURIComponent(desc.replace(/\+/g, ' ')) });
      return;
    }
    completeOAuth();
  }, []);

  async function completeOAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setStatus({ title: 'Sign-in failed', msg: null, error: error?.message || 'No session returned. Please try again.' });
        return;
      }
      const r = await fetch('/api/auth-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: session.access_token, provider: session.user?.app_metadata?.provider || 'oauth' }),
      });
      const result = await r.json();
      if (result.ok) {
        setStatus({ title: 'Signed in!', msg: 'Redirecting to your dashboard...', error: null });
        setTimeout(() => router.push(result.redirect || '/dashboard'), 400);
      } else {
        setStatus({ title: 'Sign-in failed', msg: null, error: result.error || 'Authentication failed. Please try again.' });
      }
    } catch {
      setStatus({ title: 'Network error', msg: null, error: 'Please check your connection and try again.' });
    }
  }

  return (
    <>
      <Head>
        <title>Signing in... | ExtoArts</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap" />
      </Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#07070c;--primary:#00c4f0;--text-main:#f5f5f7;--text-muted:#6b7280}
        body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .wrap{text-align:center;max-width:380px}
        .logo-ring{width:72px;height:72px;border-radius:50%;border:2px solid rgba(0,196,240,0.3);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;animation:ringPulse 2s ease-in-out infinite}
        @keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,196,240,0.25)}50%{box-shadow:0 0 0 14px rgba(0,196,240,0)}}
        .logo-ring img{width:52px;height:52px;border-radius:50%}
        .spinner{width:40px;height:40px;border:3px solid rgba(0,196,240,0.15);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 18px}
        @keyframes spin{to{transform:rotate(360deg)}}
        h2{font-size:1.25rem;font-weight:800;margin-bottom:8px}
        p{font-size:0.87rem;color:var(--text-muted);line-height:1.6}
        .error-box{margin-top:20px;padding:14px 18px;border-radius:14px;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;font-size:0.87rem}
        .btn{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:11px 22px;background:var(--primary);color:#000;font-weight:700;font-size:0.88rem;border:none;border-radius:12px;cursor:pointer;font-family:inherit;text-decoration:none}
      `}</style>
      <div className="wrap">
        <div className="logo-ring">
          <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
        </div>
        {!status.error && <div className="spinner" />}
        <h2>{status.title}</h2>
        {status.msg && <p>{status.msg}</p>}
        {status.error && (
          <div className="error-box">
            {status.error}
            <br />
            <a className="btn" href="/login">Back to Sign In</a>
          </div>
        )}
      </div>
    </>
  );
}
