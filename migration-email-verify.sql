-- ============================================================
-- ExtoArts - Email Verification Migration
-- Run this ONCE in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bigopvwtprisrfhuayxs/sql
-- ============================================================

-- Step 1: Add verification columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified      BOOLEAN     DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_token  TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_expires TIMESTAMPTZ;

-- Step 2: Grandfather all existing accounts as verified
-- (They registered before verification was required - do not lock them out)
UPDATE users SET email_verified = TRUE
WHERE email_verified IS FALSE OR email_verified IS NULL;

-- Step 3: Set future default to FALSE so new signups start unverified
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT FALSE;

-- Step 4: Index for fast token lookups (one lookup per verification click)
CREATE INDEX IF NOT EXISTS idx_users_verify_token
    ON users(email_verify_token)
    WHERE email_verify_token IS NOT NULL;
