import { getAdminClient } from '../../lib/supabase';
import { notifyNewApplication } from '../../lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const cookie = req.cookies?.exto_session;
  if (!cookie) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  let sessionUser;
  try { sessionUser = JSON.parse(Buffer.from(cookie, 'base64').toString()); }
  catch { return res.status(401).json({ ok: false, error: 'Invalid session' }); }

  const { portfolio, skills, tools, about, rate, discord } = req.body || {};
  if (!portfolio || !skills || !tools || !discord) {
    return res.status(400).json({ ok: false, error: 'All fields are required.' });
  }

  const sb = getAdminClient();
  const { error } = await sb.from('applications').insert({
    user_id: sessionUser.id,
    username: sessionUser.username,
    email: sessionUser.email,
    portfolio: portfolio.trim(),
    skills: skills.trim(),
    tools: tools.trim(),
    about: (about || '').trim(),
    rate: (rate || '').trim(),
    discord: discord.trim(),
    status: 'pending',
  });

  if (error) return res.status(500).json({ ok: false, error: 'DB error: ' + error.message });

  try { await notifyNewApplication(sessionUser.username, sessionUser.email, 'editor'); } catch {}
  return res.status(200).json({ ok: true });
}
