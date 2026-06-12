import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Apply() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ portfolio: '', skills: '', tools: '', about: '', rate: '', discord: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => {
      if (!d.ok) { router.push('/login'); return; }
      setUser(d.user);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const r = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (data.ok) setSuccess('Application submitted! We will review it and reach out on Discord.');
    else setError(data.error || 'Submission failed. Please try again.');
    setLoading(false);
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Apply as Editor | ExtoArts</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800;900&display=swap" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#050508;--surface:#0d0d1c;--primary:#22d3ee;--border:#1e2035;--text-main:#f0f0f5;--text-muted:#6b7280}
        body{background:var(--bg);color:var(--text-main);font-family:Urbanist,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .wrap{width:100%;max-width:540px}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-main);font-weight:900;font-size:1.2rem;margin-bottom:28px;justify-content:center}
        .logo img{width:32px;height:32px;border-radius:50%}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:32px}
        h1{font-size:1.5rem;font-weight:900;margin-bottom:6px}
        .sub{color:var(--text-muted);font-size:0.9rem;margin-bottom:24px}
        label{display:block;font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em}
        input,textarea{width:100%;padding:11px 13px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text-main);font-size:0.93rem;font-family:inherit;outline:none;margin-bottom:14px;resize:vertical}
        input:focus,textarea:focus{border-color:var(--primary)}
        .btn-main{width:100%;padding:13px;background:var(--primary);color:#000;font-weight:900;font-size:0.98rem;border:none;border-radius:10px;cursor:pointer;font-family:inherit}
        .btn-main:disabled{opacity:.5;cursor:not-allowed}
        .error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5;border-radius:9px;padding:12px 16px;font-size:0.88rem;margin-bottom:14px}
        .success{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);color:#86efac;border-radius:9px;padding:12px 16px;font-size:0.88rem;margin-bottom:14px}
      `}</style>
      <div className="wrap">
        <a href="/" className="logo"><img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />ExtoArts</a>
        <div className="card">
          <h1>Apply as Editor</h1>
          <p className="sub">Tell us about your experience. We review all applications within 48 hours.</p>
          {error && <div className="error">{error}</div>}
          {success ? <div className="success">{success}</div> : (
            <form onSubmit={handleSubmit}>
              <label>Portfolio Link</label>
              <input type="url" placeholder="https://your-portfolio.com or Google Drive link" value={form.portfolio} onChange={e => setForm({...form,portfolio:e.target.value})} required />
              <label>Skills / Niche</label>
              <input type="text" placeholder="e.g. Gaming editing, Faceless channels, Motion graphics" value={form.skills} onChange={e => setForm({...form,skills:e.target.value})} required />
              <label>Tools You Use</label>
              <input type="text" placeholder="e.g. Premiere Pro, After Effects, DaVinci Resolve" value={form.tools} onChange={e => setForm({...form,tools:e.target.value})} required />
              <label>Discord Username</label>
              <input type="text" placeholder="username#0000 or just username" value={form.discord} onChange={e => setForm({...form,discord:e.target.value})} required />
              <label>Rate (USD / video or per hour)</label>
              <input type="text" placeholder="e.g. $15/video or $20/hr" value={form.rate} onChange={e => setForm({...form,rate:e.target.value})} required />
              <label>About yourself</label>
              <textarea rows={4} placeholder="Tell us about your editing experience..." value={form.about} onChange={e => setForm({...form,about:e.target.value})} required />
              <button type="submit" className="btn-main" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
