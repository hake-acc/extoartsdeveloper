/**
 * Database utilities - wraps Supabase REST API.
 * Uses the service-role admin client for all server-side operations.
 */
import { getAdminClient } from './supabase';

// Fetch a single row
export async function dbFetch(table, conditions = {}) {
  const sb = getAdminClient();
  let q = sb.from(table).select('*');
  Object.entries(conditions).forEach(([col, val]) => { q = q.eq(col, val); });
  const { data, error } = await q.maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// Fetch multiple rows
export async function dbFetchAll(table, conditions = {}, limit = 100) {
  const sb = getAdminClient();
  let q = sb.from(table).select('*').limit(limit);
  Object.entries(conditions).forEach(([col, val]) => { q = q.eq(col, val); });
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

// Raw SQL via RPC (for complex queries)
export async function dbQuery(sql, params = []) {
  const sb = getAdminClient();
  const { data, error } = await sb.rpc('php_exec', { q: sql, p: params });
  if (error) throw new Error(error.message);
  return data || [];
}

// Insert a row
export async function dbInsert(table, row) {
  const sb = getAdminClient();
  const { data, error } = await sb.from(table).insert(row).select('id').single();
  if (error) throw new Error(error.message);
  return data?.id;
}

// Update rows
export async function dbUpdate(table, conditions, updates) {
  const sb = getAdminClient();
  let q = sb.from(table).update(updates);
  Object.entries(conditions).forEach(([col, val]) => { q = q.eq(col, val); });
  const { error } = await q;
  if (error) throw new Error(error.message);
}

// Delete rows
export async function dbDelete(table, conditions) {
  const sb = getAdminClient();
  let q = sb.from(table).delete();
  Object.entries(conditions).forEach(([col, val]) => { q = q.eq(col, val); });
  const { error } = await q;
  if (error) throw new Error(error.message);
}

// Check if username/email already exists
export async function isUsernameTaken(username) {
  const sb = getAdminClient();
  const { count } = await sb.from('users').select('id', { count: 'exact', head: true }).ilike('username', username);
  return (count || 0) > 0;
}

export async function isEmailTaken(email) {
  const sb = getAdminClient();
  const { count } = await sb.from('users').select('id', { count: 'exact', head: true }).eq('email', email.toLowerCase());
  return (count || 0) > 0;
}
