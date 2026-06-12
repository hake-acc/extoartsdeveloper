import { getAdminClient } from '../../lib/supabase';

const ALLOWED_TRANSITIONS = {
  admin:  ['pending','active','in_progress','review','completed','cancelled','on_hold'],
  editor: ['in_progress','review','completed'],
  client: ['cancelled'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const cookie = req.cookies?.exto_session;
  if (!cookie) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  let sessionUser;
  try { sessionUser = JSON.parse(Buffer.from(cookie, 'base64').toString()); }
  catch { return res.status(401).json({ ok: false, error: 'Invalid session' }); }

  const { order_id, action } = req.body || {};
  if (!order_id || !action) return res.status(400).json({ ok: false, error: 'Missing order_id or action' });

  const allowed = ALLOWED_TRANSITIONS[sessionUser.role] || [];
  if (!allowed.includes(action)) return res.status(403).json({ ok: false, error: 'Not permitted' });

  const sb = getAdminClient();
  const { error } = await sb.from('orders').update({ status: action, updated_at: new Date().toISOString() }).eq('id', order_id);
  if (error) return res.status(500).json({ ok: false, error: error.message });

  return res.status(200).json({ ok: true });
}
