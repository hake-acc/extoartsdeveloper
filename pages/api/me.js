// Returns the currently logged-in user from session cookie
export default function handler(req, res) {
  const cookie = req.cookies?.exto_session;
  if (!cookie) return res.status(401).json({ ok: false, error: 'Not authenticated' });
  try {
    const user = JSON.parse(Buffer.from(cookie, 'base64').toString());
    if (user.exp && user.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ ok: false, error: 'Session expired' });
    }
    return res.status(200).json({ ok: true, user });
  } catch {
    return res.status(401).json({ ok: false, error: 'Invalid session' });
  }
}
