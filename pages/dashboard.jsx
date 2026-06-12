import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      // Fetch app-level user data
      const r = await fetch('/api/me');
      if (!r.ok) { router.push('/login'); return; }
      const data = await r.json();
      setUser(data.user);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050508',color:'#f0f0f5',fontFamily:'Urbanist,sans-serif',fontSize:'1.1rem'}}>
      Loading dashboard...
    </div>
  );

  return (
    <>
      <Head>
        <title>Dashboard | ExtoArts</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800;900&display=swap" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#050508;--surface:#0d0d1c;--primary:#22d3ee;--border:#1e2035;--text-main:#f0f0f5;--text-muted:#6b7280}
        body{background:var(--bg);color:var(--text-main);font-family:Urbanist,sans-serif;min-height:100vh}
        .dash-nav{background:var(--surface);border-bottom:1px solid var(--border);padding:0 24px;display:flex;align-items:center;gap:16px;height:60px}
        .dash-nav .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--text-main);font-weight:900;font-size:1.1rem}
        .dash-nav .logo img{width:30px;height:30px;border-radius:50%}
        .dash-nav .spacer{flex:1}
        .user-chip{display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid var(--border);border-radius:50px;font-size:0.85rem;font-weight:700}
        .user-chip img{width:24px;height:24px;border-radius:50%}
        .logout-btn{padding:7px 14px;border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:#ef4444;background:none;cursor:pointer;font-size:0.82rem;font-weight:700;font-family:inherit}
        .logout-btn:hover{background:rgba(239,68,68,0.1)}
        .dash-body{padding:32px 24px;max-width:1100px;margin:0 auto}
        .welcome{font-size:1.8rem;font-weight:900;margin-bottom:6px}
        .role-badge{display:inline-block;padding:3px 12px;border-radius:50px;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:28px}
        .role-badge.client{background:rgba(34,211,238,0.12);color:#22d3ee;border:1px solid rgba(34,211,238,0.2)}
        .role-badge.editor{background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.2)}
        .role-badge.admin{background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.2)}
        .dash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:32px}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;align-items:center;gap:16px}
        .stat-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
        .stat-label{font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
        .stat-val{font-size:1.5rem;font-weight:900}
        .action-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px}
        .btn-action{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:10px;font-weight:700;font-size:0.9rem;text-decoration:none;border:1px solid var(--border);color:var(--text-main);background:var(--surface);cursor:pointer;font-family:inherit;transition:.15s}
        .btn-action:hover{border-color:var(--primary);color:var(--primary)}
        .btn-action.primary{background:var(--primary);color:#000;border:none}
        .btn-action.primary:hover{opacity:.88}
        .discord-cta{background:var(--surface);border:1px solid rgba(88,101,242,0.3);border-radius:14px;padding:24px;display:flex;align-items:center;gap:20px}
        .discord-cta i{font-size:2.5rem;color:#5865f2}
        .discord-cta h3{font-size:1.1rem;font-weight:900;margin-bottom:4px}
        .discord-cta p{font-size:0.88rem;color:var(--text-muted);margin-bottom:12px}
        .discord-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:#5865f2;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;font-size:0.88rem}
      `}</style>

      <nav className="dash-nav">
        <a href="/" className="logo">
          <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" alt="ExtoArts" />
          ExtoArts
        </a>
        <span className="spacer" />
        <div className="user-chip">
          <img src={user?.avatar || 'https://i.ibb.co/JR76yvRp/1758037248-icon.png'} alt="Avatar" />
          {user?.username || user?.name}
        </div>
        <button className="logout-btn" onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}>
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      </nav>

      <div className="dash-body">
        <div className="welcome">Welcome, {user?.name || user?.username}</div>
        <span className={`role-badge ${user?.role}`}>{user?.role}</span>

        {user?.role === 'client' && (
          <>
            <div className="dash-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{background:'rgba(34,211,238,0.1)',color:'#22d3ee'}}><i className="fas fa-film" /></div>
                <div>
                  <div className="stat-label">Active Orders</div>
                  <div className="stat-val">0</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background:'rgba(34,197,94,0.1)',color:'#22c55e'}}><i className="fas fa-check-circle" /></div>
                <div>
                  <div className="stat-label">Completed</div>
                  <div className="stat-val">0</div>
                </div>
              </div>
            </div>
            <div className="action-row">
              <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" className="btn-action primary">
                <i className="fab fa-discord" /> Place New Order
              </a>
              <a href="/ticket" className="btn-action"><i className="fas fa-ticket-alt" /> Support Ticket</a>
            </div>
            <div className="discord-cta">
              <i className="fab fa-discord" />
              <div>
                <h3>Ready to start your next project?</h3>
                <p>Open a ticket on Discord to get a quote within hours.</p>
                <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" className="discord-btn">
                  <i className="fab fa-discord" /> Open Discord Ticket
                </a>
              </div>
            </div>
          </>
        )}

        {user?.role === 'editor' && (
          <div className="discord-cta">
            <i className="fab fa-discord" />
            <div>
              <h3>{user?.status === 'pending' ? 'Application under review' : 'Welcome, Editor!'}</h3>
              <p>{user?.status === 'pending' ? 'Your application is being reviewed. We\'ll reach out on Discord.' : 'Check Discord for available jobs and client briefs.'}</p>
              <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" className="discord-btn">
                <i className="fab fa-discord" /> Open Discord
              </a>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="action-row">
            <a href="/hq-portal" className="btn-action primary"><i className="fas fa-cog" /> HQ Portal</a>
          </div>
        )}
      </div>
    </>
  );
}
