import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const cookie = req.cookies?.exto_session;
  if (!cookie) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  let sessionUser;
  try { sessionUser = JSON.parse(Buffer.from(cookie, 'base64').toString()); }
  catch { return res.status(401).json({ ok: false, error: 'Invalid session' }); }

  const { oid, after } = req.query;
  if (!oid) return res.status(400).json({ ok: false, error: 'Missing order id' });

  const sb = getAdminClient();

  // Verify user has access to this order
  const { data: order } = await sb.from('orders').select('id,client_id,editor_id').eq('id', oid).maybeSingle();
  if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });
  if (sessionUser.role !== 'admin' && order.client_id !== sessionUser.id && order.editor_id !== sessionUser.id) {
    return res.status(403).json({ ok: false, error: 'Access denied' });
  }

  let query = sb.from('chat_messages').select('*').eq('order_id', oid).order('created_at', { ascending: true });
  if (after) query = query.gt('created_at', after);

  const { data: messages, error } = await query;
  if (error) return res.status(500).json({ ok: false, error: error.message });

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, messages: messages || [] });
}
