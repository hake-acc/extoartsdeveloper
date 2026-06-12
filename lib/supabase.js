import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser client (public anon key)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service-role admin client for server-side DB operations
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Server-side client that reads cookies for SSR auth
export function getServerSupabase(req, res) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies || {}).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${options?.maxAge ?? 3600}${options?.secure ? '; Secure' : ''}`;
          const existing = res.getHeader('Set-Cookie') || [];
          const arr = Array.isArray(existing) ? existing : [existing];
          res.setHeader('Set-Cookie', [...arr, cookie]);
        });
      },
    },
  });
}

// Get the authenticated user from server context (API routes + getServerSideProps)
export async function getAuthUser(req, res) {
  const sb = getServerSupabase(req, res);
  const { data: { user } } = await sb.auth.getUser();
  return user || null;
}
