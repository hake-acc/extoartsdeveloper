-- ============================================================
-- ExtoArts - Supabase PostgreSQL Schema
-- Run this ONCE in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bigopvwtprisrfhuayxs/sql
-- ============================================================

-- Extension for case-insensitive text columns
CREATE EXTENSION IF NOT EXISTS citext;

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    username      CITEXT    UNIQUE NOT NULL,
    email         CITEXT    UNIQUE NOT NULL,
    password_hash TEXT      NOT NULL DEFAULT '',
    name          TEXT      NOT NULL DEFAULT '',
    role          TEXT      NOT NULL DEFAULT 'client',
    status        TEXT      NOT NULL DEFAULT 'active',
    avatar        TEXT               DEFAULT '',
    created_at    TIMESTAMPTZ        DEFAULT NOW(),
    last_login    TIMESTAMPTZ,
    deleted_at    TIMESTAMPTZ,
    provider      TEXT               DEFAULT '',
    provider_id   TEXT               DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_users_role    ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status  ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

CREATE TABLE IF NOT EXISTS editor_applications (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT   NOT NULL,
    display_name     TEXT              DEFAULT '',
    bio              TEXT              DEFAULT '',
    specialties      TEXT              DEFAULT '',
    tools            TEXT              DEFAULT '',
    experience_years INTEGER           DEFAULT 0,
    drive_links      TEXT              DEFAULT '',
    portfolio_url    TEXT              DEFAULT '',
    timezone         TEXT              DEFAULT '',
    availability     TEXT              DEFAULT '',
    agreed_tos       INTEGER           DEFAULT 0,
    status           TEXT              DEFAULT 'pending',
    admin_note       TEXT              DEFAULT '',
    submitted_at     TIMESTAMPTZ       DEFAULT NOW(),
    reviewed_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ea_user_id ON editor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_ea_status  ON editor_applications(status);

CREATE TABLE IF NOT EXISTS orders (
    id               BIGSERIAL PRIMARY KEY,
    client_id        BIGINT   NOT NULL,
    editor_id        BIGINT,
    package_slug     TEXT              DEFAULT '',
    package_name     TEXT              DEFAULT 'Custom Project',
    title            TEXT     NOT NULL,
    description      TEXT              DEFAULT '',
    reference_links  TEXT              DEFAULT '',
    budget           TEXT              DEFAULT '',
    deadline         TEXT,
    status           TEXT     NOT NULL DEFAULT 'pending',
    payment_amount   NUMERIC(10,2),
    delivery_link    TEXT              DEFAULT '',
    admin_note       TEXT              DEFAULT '',
    chat_cleared     INTEGER           DEFAULT 0,
    created_at       TIMESTAMPTZ       DEFAULT NOW(),
    updated_at       TIMESTAMPTZ       DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_client  ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_editor  ON orders(editor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_interests (
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT NOT NULL,
    editor_id  BIGINT NOT NULL,
    message    TEXT            DEFAULT '',
    created_at TIMESTAMPTZ     DEFAULT NOW(),
    UNIQUE(order_id, editor_id)
);
CREATE INDEX IF NOT EXISTS idx_oi_order  ON order_interests(order_id);
CREATE INDEX IF NOT EXISTS idx_oi_editor ON order_interests(editor_id);

CREATE TABLE IF NOT EXISTS order_payments (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT   NOT NULL,
    payment_type TEXT     NOT NULL DEFAULT 'half',
    amount       NUMERIC(10,2),
    reference    TEXT     NOT NULL,
    note         TEXT              DEFAULT '',
    submitted_by BIGINT   NOT NULL,
    submitted_at TIMESTAMPTZ       DEFAULT NOW(),
    approved_by  BIGINT,
    approved_at  TIMESTAMPTZ,
    status       TEXT     NOT NULL DEFAULT 'pending'
);
CREATE INDEX IF NOT EXISTS idx_op_order  ON order_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_op_status ON order_payments(status);

CREATE TABLE IF NOT EXISTS payment_methods (
    id           BIGSERIAL PRIMARY KEY,
    type         TEXT     NOT NULL,
    label        TEXT     NOT NULL,
    value        TEXT     NOT NULL,
    network      TEXT              DEFAULT '',
    qr_url       TEXT              DEFAULT '',
    instructions TEXT              DEFAULT '',
    is_active    INTEGER           DEFAULT 1,
    sort_order   INTEGER           DEFAULT 0,
    created_at   TIMESTAMPTZ       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT,
    name        TEXT             DEFAULT '',
    email       TEXT             DEFAULT '',
    subject     TEXT    NOT NULL,
    message     TEXT    NOT NULL,
    category    TEXT             DEFAULT 'general',
    priority    TEXT             DEFAULT 'normal',
    status      TEXT    NOT NULL DEFAULT 'open',
    created_at  TIMESTAMPTZ      DEFAULT NOW(),
    updated_at  TIMESTAMPTZ      DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_tickets_user   ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id          BIGSERIAL PRIMARY KEY,
    ticket_id   BIGINT  NOT NULL,
    sender_id   BIGINT           DEFAULT 0,
    sender_role TEXT             DEFAULT 'user',
    message     TEXT    NOT NULL,
    created_at  TIMESTAMPTZ      DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tr_ticket ON ticket_replies(ticket_id);

CREATE TABLE IF NOT EXISTS login_attempts (
    id            BIGSERIAL PRIMARY KEY,
    attempt_key   TEXT    UNIQUE NOT NULL,
    attempts      INTEGER        DEFAULT 1,
    first_attempt BIGINT  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_la_key ON login_attempts(attempt_key);

CREATE TABLE IF NOT EXISTS editor_profiles (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT  UNIQUE NOT NULL,
    avatar_url    TEXT            DEFAULT '',
    bio           TEXT            DEFAULT '',
    specialties   TEXT            DEFAULT '',
    tools         TEXT            DEFAULT '',
    portfolio_url TEXT            DEFAULT '',
    timezone      TEXT            DEFAULT '',
    availability  TEXT            DEFAULT '',
    updated_at    TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notes (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT  NOT NULL,
    admin_id   BIGINT  NOT NULL,
    note       TEXT    NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_un_user ON user_notes(user_id);

CREATE TABLE IF NOT EXISTS notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT  NOT NULL,
    type       TEXT             DEFAULT 'info',
    title      TEXT    NOT NULL,
    body       TEXT             DEFAULT '',
    link       TEXT             DEFAULT '',
    is_read    INTEGER          DEFAULT 0,
    created_at TIMESTAMPTZ      DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGSERIAL PRIMARY KEY,
    actor_id    BIGINT   NOT NULL DEFAULT 0,
    action      TEXT     NOT NULL,
    target_type TEXT              DEFAULT '',
    target_id   BIGINT            DEFAULT 0,
    detail      TEXT              DEFAULT '',
    ip          TEXT              DEFAULT '',
    created_at  TIMESTAMPTZ       DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor   ON audit_log(actor_id);

-- Chat messages table (replaces Firebase Firestore)
CREATE TABLE IF NOT EXISTS chat_messages (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT   NOT NULL,
    sender_id   BIGINT   NOT NULL,
    sender_name TEXT              DEFAULT '',
    sender_role TEXT              DEFAULT 'client',
    message     TEXT     NOT NULL,
    created_at  TIMESTAMPTZ       DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cm_order     ON chat_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_cm_created   ON chat_messages(order_id, created_at);

-- ── Auth Triggers: DO NOT RECREATE ───────────────────────────────────────────
-- Triggers on auth.users (on_auth_user_created, on_auth_user_login) were
-- deliberately DROPPED. They caused "Database error saving new user" on every
-- signup because supabase_auth_admin lacks INSERT on public.users even when the
-- function is SECURITY DEFINER. User creation in public.users is handled by
-- api/auth-session.php after email verification. Do not add triggers back.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_login   ON auth.users;

-- ── Row Level Security: disable for all tables (service role key used) ─────────
-- The PHP layer uses the service role key which bypasses RLS automatically.
-- Keeping RLS off for simplicity. Enable per-table if you add client JS access.

ALTER TABLE users               DISABLE ROW LEVEL SECURITY;
ALTER TABLE editor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders              DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_interests     DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments      DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods     DISABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets     DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies      DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts      DISABLE ROW LEVEL SECURITY;
ALTER TABLE editor_profiles     DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes          DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log           DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages       DISABLE ROW LEVEL SECURITY;

-- ── RPC Functions ─────────────────────────────────────────────────────────────
-- These are called by PHP via POST /rest/v1/rpc/{function_name}
-- SECURITY DEFINER means they run with the owner's privileges.

-- Helper: substitute {{{N}}} placeholders with safely-quoted values from a JSON array.
-- Triple-brace format avoids any collision with SQL syntax or user-supplied values.
CREATE OR REPLACE FUNCTION _sb_bind(query_text text, params jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    n      int  := jsonb_array_length(COALESCE(params, '[]'::jsonb));
    i      int;
    pval   jsonb;
    pstr   text;
    result text := query_text;
BEGIN
    FOR i IN 1..n LOOP
        pval := COALESCE(params, '[]'::jsonb)->(i-1);
        IF pval IS NULL OR jsonb_typeof(pval) = 'null' THEN
            pstr := 'NULL';
        ELSIF jsonb_typeof(pval) = 'number' THEN
            pstr := pval #>> '{}';
        ELSIF jsonb_typeof(pval) = 'boolean' THEN
            pstr := CASE WHEN (pval #>> '{}') = 'true' THEN 'true' ELSE 'false' END;
        ELSE
            pstr := quote_literal(pval #>> '{}');
        END IF;
        result := replace(result, '{{{' || i::text || '}}}', pstr);
    END LOOP;
    RETURN result;
END;
$$;

-- SELECT: returns a JSON array of row objects
CREATE OR REPLACE FUNCTION sb_exec_select(query_text text, params jsonb DEFAULT '[]')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    final_q text;
    result  jsonb;
BEGIN
    final_q := _sb_bind(query_text, params);
    EXECUTE format(
        'SELECT COALESCE(jsonb_agg(r), ''[]''::jsonb) FROM (%s) r',
        final_q
    ) INTO result;
    RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'sb_exec_select: % | query: %', SQLERRM, left(final_q, 300);
END;
$$;

-- INSERT: executes and returns the newly inserted row id (BIGINT)
CREATE OR REPLACE FUNCTION sb_exec_insert(query_text text, params jsonb DEFAULT '[]')
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    final_q    text;
    inserted_q text;
    result_id  bigint;
BEGIN
    final_q := _sb_bind(query_text, params);
    -- Append RETURNING id if not already present
    IF position('RETURNING' IN upper(final_q)) = 0 THEN
        inserted_q := rtrim(final_q, ' ;') || ' RETURNING id';
    ELSE
        inserted_q := final_q;
    END IF;
    EXECUTE inserted_q INTO result_id;
    RETURN COALESCE(result_id, 0);
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'sb_exec_insert: % | query: %', SQLERRM, left(final_q, 300);
END;
$$;

-- UPDATE / DELETE / other DML: executes and returns affected row count (INT)
CREATE OR REPLACE FUNCTION sb_exec_modify(query_text text, params jsonb DEFAULT '[]')
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    final_q       text;
    rows_affected int;
BEGIN
    final_q := _sb_bind(query_text, params);
    EXECUTE final_q;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'sb_exec_modify: % | query: %', SQLERRM, left(final_q, 300);
END;
$$;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- After running this script, verify by executing:
--   SELECT sb_exec_select('SELECT 1 AS ping', '[]');
-- Expected result: [{"ping": 1}]
