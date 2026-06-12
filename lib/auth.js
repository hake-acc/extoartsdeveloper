/**
 * Server-side auth utilities for Next.js API routes and getServerSideProps.
 * Uses Supabase access tokens validated against /auth/v1/user.
 */
import { getAdminClient, getServerSupabase } from './supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify a Supabase access token and return the user's app DB record
export async function verifyToken(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

// Get the logged-in user from the Supabase session cookie (SSR)
export async function getSessionUser(req, res) {
  try {
    const sb = getServerSupabase(req, res);
    const { data: { user } } = await sb.auth.getUser();
    if (!user?.email) return null;
    // Load app-level user data (role, status, etc.) from our users table
    const db = getAdminClient();
    const { data } = await db.from('users').select('*').eq('email', user.email.toLowerCase()).maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

// Redirect to login if not authenticated (use in getServerSideProps)
export function requireAuth(handler, allowedRoles = null) {
  return async (context) => {
    const user = await getSessionUser(context.req, context.res);
    if (!user) {
      return { redirect: { destination: '/login?expired=1', permanent: false } };
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { redirect: { destination: '/dashboard', permanent: false } };
    }
    return handler(context, user);
  };
}

// Cloudflare Turnstile CAPTCHA verification
export async function verifyTurnstile(token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  // Test key auto-passes
  if (token === '1x0000000000000000000000000000000AA') return true;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Simple in-memory rate limiter (resets on cold start - use Redis for production)
const rateLimitMap = new Map();
export function rateLimit(key, max, windowSec) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, reset: now + windowSec * 1000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowSec * 1000; }
  entry.count++;
  rateLimitMap.set(key, entry);
  return entry.count <= max;
}
