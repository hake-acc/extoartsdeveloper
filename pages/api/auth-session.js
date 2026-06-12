import { getAdminClient } from '../../lib/supabase';
import { notifyNewRegistration } from '../../lib/notify';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // DELETE = logout (clear cookie)
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'exto_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { access_token, provider } = req.body || {};
  if (!access_token) return res.status(400).json({ ok: false, error: 'Missing access token' });

  // Verify token with Supabase
  const vRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${access_token}` },
  });
  if (!vRes.ok) return res.status(401).json({ ok: false, error: 'Token verification failed. Please sign in again.' });

  const sbUser = await vRes.json();
  if (!sbUser.email) return res.status(400).json({ ok: false, error: 'No email address associated with this account.' });

  const email = sbUser.email.toLowerCase().trim();
  const trustedProviders = ['google', 'discord'];
  if (!trustedProviders.includes(provider)) {
    if (!/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i.test(email)) {
      return res.status(422).json({ ok: false, error: 'Only Gmail (@gmail.com) and Yahoo email addresses are accepted.' });
    }
  }

  const sb = getAdminClient();
  try {
    // Find or create user
    const { data: existing } = await sb.from('users').select('*').eq('email', email).maybeSingle();

    if (existing) {
      if (existing.status === 'banned') return res.status(403).json({ ok: false, error: 'Your account has been suspended. Contact us on Discord.' });
      await sb.from('users').update({ last_login: new Date().toISOString() }).eq('id', existing.id);
      setSessionCookie(res, existing);
      return res.status(200).json({ ok: true, redirect: '/dashboard' });
    }

    // New user
    const meta  = sbUser.user_metadata || {};
    const name  = (meta.full_name || meta.name || meta.preferred_username || meta.username || email.split('@')[0]).trim();
    const base  = (meta.username || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 25) || email.slice(0, 8);
    const safeBase = base.length < 3 ? Buffer.from(email).toString('hex').slice(0, 8) : base;
    const reserved = ['admin', 'xta_root', 'extoarts_admin'];
    let username = reserved.includes(safeBase) ? 'user_' + safeBase : safeBase;

    for (let i = 1; i <= 99; i++) {
      const { data: taken } = await sb.from('users').select('id').eq('username', username).maybeSingle();
      if (!taken) break;
      username = safeBase + i;
    }

    const newRole   = ['client','editor'].includes(meta.role) ? meta.role : 'client';
    const newStatus = newRole === 'editor' ? 'pending' : 'active';

    // Race guard
    const { data: raceCheck } = await sb.from('users').select('*').eq('email', email).maybeSingle();
    if (raceCheck) {
      if (raceCheck.status === 'banned') return res.status(403).json({ ok: false, error: 'Account suspended.' });
      setSessionCookie(res, raceCheck);
      return res.status(200).json({ ok: true, redirect: '/dashboard' });
    }

    const { data: newUser, error: insertErr } = await sb.from('users')
      .insert({ username, email, password_hash: 'oauth_' + Date.now(), name, role: newRole, status: newStatus })
      .select('*').single();

    if (insertErr) throw new Error(insertErr.message);

    setSessionCookie(res, newUser);
    try { await notifyNewRegistration(username, email, newRole); } catch {}

    return res.status(200).json({ ok: true, redirect: newRole === 'editor' ? '/apply?notice=registered' : '/dashboard?notice=welcome' });

  } catch (e) {
    console.error('[ExtoArts] auth-session error:', e.message);
    if (e.message?.includes('duplicate') || e.message?.includes('unique')) {
      return res.status(409).json({ ok: false, error: 'An account with this email already exists.' });
    }
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}

function setSessionCookie(res, user) {
  const payload = Buffer.from(JSON.stringify({
    id: user.id, username: user.username, email: user.email,
    name: user.name, role: user.role, status: user.status, avatar: user.avatar,
    exp: Math.floor(Date.now() / 1000) + 86400
  })).toString('base64');
  res.setHeader('Set-Cookie', `exto_session=${payload}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
}
