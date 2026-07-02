-- ExtoArts - Supabase PHP Execution Bridge
-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bigopvwtprisrfhuayxs/sql/new
--
-- This creates a SECURITY DEFINER function that PHP calls via the REST API
-- (/rest/v1/rpc/php_exec) using HTTPS instead of a direct port 5432 connection.
-- Required because many shared hosts block outbound TCP on port 5432 and/or
-- do not have the pdo_pgsql extension loaded.

CREATE OR REPLACE FUNCTION php_exec(q text, p text[] DEFAULT '{}')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  bound_q text := q;
  i       int;
  n       int;
  affected int;
BEGIN
  -- Normalise datetime syntax
  bound_q := regexp_replace(bound_q, $$datetime\('now'\)$$, 'NOW()', 'gi');

  -- Bind ? placeholders in order using properly escaped values.
  -- regexp_replace without 'g' replaces one occurrence per call, so
  -- iterating i = 1..n replaces them left-to-right in sequence.
  n := COALESCE(array_length(p, 1), 0);
  FOR i IN 1..n LOOP
    bound_q := regexp_replace(bound_q, '\?', quote_nullable(p[i]));
  END LOOP;

  -- SELECT / WITH / queries that have RETURNING: return a JSON array of rows
  IF bound_q ~* '^\s*(SELECT|WITH)' OR bound_q ~* '\mRETURNING\M' THEN
    EXECUTE 'SELECT json_agg(r) FROM (' || bound_q || ') r' INTO result;
    RETURN COALESCE(result, '[]'::json);
  END IF;

  -- INSERT / UPDATE / DELETE without RETURNING: return affected row count
  EXECUTE bound_q;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN json_build_object('affected', affected)::json;
END;
$$;

-- Grant execute to authenticated and service_role
GRANT EXECUTE ON FUNCTION php_exec(text, text[]) TO authenticated, service_role;

-- Quick smoke test (should return [{"?column?":1}])
SELECT php_exec('SELECT 1');
