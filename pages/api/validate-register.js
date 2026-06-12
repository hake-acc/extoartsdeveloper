import { verifyTurnstile, rateLimit } from '../../lib/auth';
import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, errors: ['Method not allowed'] });

  const { username, email, password, confirm, role, ts_token, agreed_tos } = req.body || {};

  if (!agreed_tos) return res.status(200).json({ ok: false, errors: ['You must agree to the Terms of Service to register.'] });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!rateLimit('register_' + ip, 5, 3600)) {
    return res.status(429).json({ ok: false, errors: ['Too many registration attempts from your location. Please wait an hour.'] });
  }

  const ok = await verifyTurnstile(ts_token);
  if (!ok) return res.status(200).json({ ok: false, errors: ['Human verification failed. Please reload the page and try again.'] });

  const errors = [];
  const uname = (username || '').trim();
  const mail  = (email || '').toLowerCase().trim();
  const pass  = password || '';

  if (!uname) errors.push('Username is required.');
  else if (['admin','xta_root','extoarts_admin'].includes(uname.toLowerCase())) errors.push('That username is reserved.');
  else if (uname.length < 3 || uname.length > 30) errors.push('Username must be 3-30 characters.');
  else if (!/^[a-zA-Z0-9._-]+$/.test(uname)) errors.push('Username may only contain letters, numbers, dots, dashes, and underscores.');

  if (!mail) errors.push('Email address is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) errors.push('Please enter a valid email address.');
  else if (!/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i.test(mail)) errors.push('Only Gmail (@gmail.com) and Yahoo (@yahoo.com) addresses are accepted.');

  if (!pass) errors.push('Password is required.');
  else if (pass.length < 8) errors.push('Password must be at least 8 characters.');
  else if (pass !== confirm) errors.push('Passwords do not match.');

  if (errors.length > 0) return res.status(200).json({ ok: false, errors });

  // DB uniqueness check
  try {
    const sb = getAdminClient();
    const { data } = await sb.from('users').select('id').or(`username.ilike.${uname},email.eq.${mail}`).maybeSingle();
    if (data) return res.status(200).json({ ok: false, errors: ['That username or email is already registered.'] });
  } catch { /* DB unavailable - let Supabase catch it */ }

  return res.status(200).json({ ok: true, errors: [] });
}
