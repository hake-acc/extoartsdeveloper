import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  const token = req.query.token;
  if (token !== process.env.HEALTH_CHECK_TOKEN) return res.status(401).json({ ok: false });

  let dbOk = false;
  try {
    const sb = getAdminClient();
    await sb.from('users').select('id').limit(1);
    dbOk = true;
  } catch {}

  res.setHeader('Cache-Control', 'no-store');
  return res.status(dbOk ? 200 : 503).json({
    ok: dbOk,
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV,
    supabase: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
