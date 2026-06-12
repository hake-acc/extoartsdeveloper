import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const cookie = req.cookies?.exto_session;
  if (!cookie) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  let sessionUser;
  try { sessionUser = JSON.parse(Buffer.from(cookie, 'base64').toString()); }
  catch { return res.status(401).json({ ok: false, error: 'Invalid session' }); }

  const { order_id, text } = req.body || {};
  if (!order_id || !text?.trim()) return res.status(400).json({ ok: false, error: 'Missing order_id or text' });

  const sb = getAdminClient();

  const { data: order } = await sb.from('orders').select('id,client_id,editor_id').eq('id', order_id).maybeSingle();
  if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });
  if (sessionUser.role !== 'admin' && order.client_id !== sessionUser.id && order.editor_id !== sessionUser.id) {
    return res.status(403).json({ ok: false, error: 'Access denied' });
  }

  const { data: msg, error } = await sb.from('chat_messages').insert({
    order_id,
    sender_id: sessionUser.id,
    sender_name: sessionUser.username || sessionUser.name,
    sender_role: sessionUser.role,
    text: text.trim().slice(0, 2000),
  }).select('*').single();

  if (error) return res.status(500).json({ ok: false, error: error.message });
  return res.status(200).json({ ok: true, message: msg });
}
