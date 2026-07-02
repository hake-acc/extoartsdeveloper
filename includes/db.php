<?php
declare(strict_types=1);
/**
 * ExtoArts - Database Layer
 *
 * Transport: Supabase REST API (HTTPS/cURL on port 443).
 * Two execution paths - tried in order:
 *
 *   Path A  php_exec RPC  ─ runs any SQL server-side (all queries, including JOINs).
 *                            Requires setup-supabase-rpc.sql run once in Supabase SQL Editor.
 *
 *   Path B  PostgREST     ─ translates simple SQL to Supabase's built-in REST API.
 *                            Works immediately, zero setup. Covers all login/register queries.
 *
 * On every request the dispatcher tries Path A first. If php_exec is not installed
 * (Supabase returns PGRST202 / 404) it transparently falls back to Path B for that
 * request. Once php_exec is installed, Path A is used for everything including complex
 * dashboard JOINs/aggregates.
 */

define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://bigopvwtprisrfhuayxs.supabase.co');
define('SUPABASE_KEY', getenv('SUPABASE_KEY') ?: 'sb_secret_iF2eDIlkYI88ckjHCH-h0g_4KZZ4lBE');

/**
 * Set to true only after running setup-supabase-rpc.sql in the Supabase SQL Editor.
 * When false, _sb_execute skips the php_exec RPC attempt entirely - eliminating
 * one failed HTTPS round-trip (~150-300ms) on every cold-start worker process.
 */
define('SUPABASE_RPC_ENABLED', false);

// Legacy constants (health.php, historical code)
define('DB_HOST', getenv('DB_HOST') ?: 'aws-1-ap-northeast-1.pooler.supabase.com');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'postgres');
define('DB_USER', getenv('DB_USER') ?: 'postgres.bigopvwtprisrfhuayxs');
define('DB_PASS', getenv('DB_PASS') ?: 'EditoHubWasTakenComeBackSoon69');

// ─────────────────────────────────────────────────────────────────────────────
// FakeStatement  – PDO-compatible wrapper so all existing callers work unchanged
// ─────────────────────────────────────────────────────────────────────────────
class FakeStatement {
    private readonly array $rows;
    private int            $cursor   = 0;
    private readonly int   $affected;

    public function __construct(array $rows = [], int $affected = 0) {
        $this->rows     = $rows;
        $this->affected = $affected ?: count($rows);
    }
    public function fetchAll(int $mode = 0): array   { return $this->rows; }
    public function rowCount(): int                  { return $this->affected; }
    public function execute(array $p = []): bool     { return true; }
    public function fetch(int $mode = 0): array|false {
        return $this->rows[$this->cursor++] ?? false;
    }
    public function fetchColumn(int $col = 0): mixed {
        $row = $this->fetch();
        if ($row === false) return false;
        return array_values($row)[$col] ?? false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core HTTP helper
// ─────────────────────────────────────────────────────────────────────────────
function _sb_http(string $method, string $url, ?array $body, array $extra_headers = []): array {
    if (!function_exists('curl_init')) {
        throw new RuntimeException('cURL extension is not available on this server.');
    }

    $headers = [
        'apikey: '               . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Accept: application/json',
    ];
    if ($body !== null) $headers[] = 'Content-Type: application/json';
    foreach ($extra_headers as $h) $headers[] = $h;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => strtoupper($method),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER     => $headers,
        // Connection reuse: return handle to pool on close so the next call to
        // Supabase (same host/port/TLS) skips TCP+TLS setup (~80-150ms saving).
        CURLOPT_FORBID_REUSE   => false,
        CURLOPT_FRESH_CONNECT  => false,
        // TCP keepalive: prevents the OS from killing idle connections between
        // sequential Supabase calls on the same PHP worker process.
        CURLOPT_TCP_KEEPALIVE  => 1,
        CURLOPT_TCP_KEEPIDLE   => 60,
        CURLOPT_TCP_KEEPINTVL  => 30,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));

    $resp   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $cerr   = curl_error($ch);
    curl_close($ch);

    if ($cerr) throw new RuntimeException('Supabase cURL: ' . $cerr);
    if (!$resp) return [];

    $data = json_decode($resp, true) ?? [];

    if ($status >= 400) {
        $msg = is_array($data) ? ($data['message'] ?? $data['hint'] ?? $data['details'] ?? $resp) : $resp;
        throw new RuntimeException('Supabase ' . $status . ': ' . $msg . ' (' . SUPABASE_URL . ')');
    }

    return is_array($data) ? $data : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH A  –  php_exec RPC (runs any SQL on the Supabase server)
// ─────────────────────────────────────────────────────────────────────────────
function _rpc_exec(string $sql, array $params): array {
    $p = array_values(array_map(fn($v) => $v === null ? null : (string)$v, $params));
    return _sb_http('POST', SUPABASE_URL . '/rest/v1/rpc/php_exec', ['q' => $sql, 'p' => $p]);
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH B  –  PostgREST (translates simple SQL to REST calls, zero setup)
// ─────────────────────────────────────────────────────────────────────────────

function _now_utc(): string { return gmdate('Y-m-d\TH:i:s'); }

/**
 * Bind ? placeholders with quoted SQL literals so the WHERE/SET parsers
 * can work purely on strings without a separate params array.
 */
function _bind(string $sql, array $params): string {
    $i = 0;
    return preg_replace_callback('/\?/', function() use (&$i, $params) {
        $v = $params[$i++] ?? null;
        if ($v === null) return 'NULL';
        if (is_bool($v))   return $v ? '1' : '0';
        if (is_int($v) || is_float($v)) return (string)$v;
        return "'" . str_replace("'", "''", (string)$v) . "'";
    }, $sql);
}

/** Unquote a SQL literal ('hello' → hello, NULL → null, 5 → 5) */
function _uq(string $v): string {
    $v = trim($v);
    if (preg_match("/^'(.*)'$/s", $v, $m)) return str_replace("''", "'", $m[1]);
    if (strtoupper($v) === 'NULL') return 'null';
    return $v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers — extracted to eliminate duplication across the DB layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a SQL literal token (e.g. NOW(), NULL, 'text', 42) to its PHP value.
 * Shared by _parse_set() and _parse_values_tpl() to avoid duplicated logic.
 */
function _sql_token_to_php(string $tok): mixed {
    $u = strtoupper(trim($tok));
    if ($u === 'NULL')                                             return null;
    if ($u === 'TRUE')                                             return true;
    if ($u === 'FALSE')                                            return false;
    if (str_starts_with($u, 'NOW') || $u === 'CURRENT_TIMESTAMP') return _now_utc();
    if (preg_match("/^'(.*)'$/s", $tok, $m))                       return str_replace("''", "'", $m[1]);
    if (is_numeric($tok))                                          return str_contains($tok, '.') ? (float)$tok : (int)$tok;
    return $tok;
}

/**
 * Normalise SQLite/mixed SQL syntax to PostgreSQL in one pass.
 * Replaces the pg_prep_sql() + _resolve_ignore() two-step pipeline.
 */
function _normalize_sql(string $sql): string {
    $sql = preg_replace("/datetime\(\s*'now'\s*\)/i", 'NOW()', $sql);
    if (preg_match('/INSERT\s+OR\s+IGNORE\s+INTO/i', $sql)) {
        $sql = preg_replace('/INSERT\s+OR\s+IGNORE\s+INTO\s+/i', 'INSERT INTO ', $sql);
        if (stripos($sql, 'ON CONFLICT') === false) {
            $sql = rtrim($sql, '; ') . ' ON CONFLICT DO NOTHING';
        }
    }
    return $sql;
}

/**
 * Return true when a RuntimeException is a known PostgREST-fallback limitation
 * (JOIN, GROUP BY, un-parseable SQL). Used by db_fetch_all() and db_value()
 * to silence expected failures and return graceful empty/null results.
 */
function _is_postgrest_fallback_err(string $msg): bool {
    return str_contains($msg, 'PostgREST')
        || str_contains($msg, 'JOINs')
        || str_contains($msg, 'cannot parse');
}

/**
 * Translate a bound (params already substituted) SELECT statement to a
 * Supabase PostgREST URL plus metadata needed for result post-processing.
 * Returns null when the query cannot be expressed as a REST call.
 * Shared by _rest_exec() (sequential) and db_fetch_parallel() (concurrent).
 *
 * @return array{url: string, cols: string, is_count: bool}|null
 */
/**
 * Convert SQL ORDER BY clause ("col ASC, col2 DESC") to PostgREST format ("col.asc,col2.desc").
 * PostgREST does NOT accept raw SQL direction keywords — it requires "column.direction" notation.
 */
function _order_to_rest(string $order): string {
    $parts = array_map('trim', explode(',', $order));
    $out = [];
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part === '') continue;
        if (preg_match('/^(\w+)\s+(ASC|DESC)$/i', $part, $m)) {
            $out[] = $m[1] . '.' . strtolower($m[2]);
        } elseif (preg_match('/^(\w+)$/i', $part, $m)) {
            $out[] = $m[1] . '.asc';
        }
        // Ignore unparseable ORDER BY terms rather than passing them raw
    }
    return implode(',', $out);
}

function _select_to_rest_url(string $bound): ?array {
    if (!preg_match(
        '/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?\s*;?\s*$/is',
        $bound, $m
    )) {
        return null;
    }
    [$cols, $table, $where, $order, $limit] = [
        trim($m[1]), trim($m[2]), trim($m[3] ?? ''), trim($m[4] ?? ''), trim($m[5] ?? ''),
    ];
    $is_count = (bool) preg_match('/^COALESCE\s*\(|^COUNT\s*\(/i', $cols);
    $qs = [];
    if (!$is_count && $cols !== '*') $qs[] = 'select=' . rawurlencode($cols);
    if ($where) foreach (_where_qs($where) as $p) $qs[] = $p;
    if ($order) {
        $rest_order = _order_to_rest($order);
        if ($rest_order) $qs[] = 'order=' . rawurlencode($rest_order);
    }
    if ($limit) $qs[] = 'limit=' . (int)$limit;
    return [
        'url'      => SUPABASE_URL . '/rest/v1/' . $table . ($qs ? '?' . implode('&', $qs) : ''),
        'cols'     => $cols,
        'is_count' => $is_count,
    ];
}

/** Convert a single WHERE condition to PostgREST col=op.val string */
function _cond(string $c): string {
    $c = trim($c);
    if (!$c) return '';
    if (preg_match('/^(\w+)\s+IS\s+NOT\s+NULL$/i', $c, $m))    return $m[1] . '=not.is.null';
    if (preg_match('/^(\w+)\s+IS\s+NULL$/i', $c, $m))           return $m[1] . '=is.null';
    if (preg_match('/^(\w+)\s+IN\s*\((.+)\)$/i', $c, $m)) {
        $vals = implode(',', array_map(fn($v) => rawurlencode(_uq(trim($v))), explode(',', $m[2])));
        return $m[1] . '=in.(' . $vals . ')';
    }
    foreach ([['!=', 'neq'], ['<>', 'neq'], ['>=', 'gte'], ['<=', 'lte'], ['>', 'gt'], ['<', 'lt'], ['=', 'eq']] as [$sym, $op]) {
        if (preg_match('/^(\w+)\s*' . preg_quote($sym, '/') . '\s*(.+)$/', $c, $m)) {
            return $m[1] . '=' . $op . '.' . rawurlencode(_uq($m[2]));
        }
    }
    return '';
}

/** Same but "col.op.val" for use inside or=(...) */
function _cond_dot(string $c): string {
    $f = _cond($c);
    return $f ? preg_replace('/^(\w+)=/', '$1.', $f) : '';
}

/** Convert WHERE clause to array of PostgREST query string params */
function _where_qs(string $where): array {
    $where = trim($where);
    $parts = [];

    // (col = X OR col2 = Y) [AND extra ...]
    if (preg_match('/^\(\s*(.+?)\s*\)\s*(?:AND\s+(.+))?$/is', $where, $m)) {
        $or_filters = array_filter(array_map(
            fn($c) => _cond_dot(trim($c)),
            preg_split('/\s+OR\s+/i', $m[1])
        ));
        if ($or_filters) $parts[] = 'or=(' . implode(',', $or_filters) . ')';
        $rest = trim($m[2] ?? '');
        if ($rest) {
            foreach (preg_split('/\s+AND\s+/i', $rest) as $c) {
                $f = _cond(trim($c)); if ($f) $parts[] = $f;
            }
        }
        return $parts;
    }

    // Bare OR (no parens): col = X OR col2 = Y
    if (preg_match('/\bOR\b/i', $where) && !preg_match('/\bAND\b/i', $where)) {
        $or_filters = array_filter(array_map(
            fn($c) => _cond_dot(trim($c)),
            preg_split('/\s+OR\s+/i', $where)
        ));
        if ($or_filters) $parts[] = 'or=(' . implode(',', $or_filters) . ')';
        return $parts;
    }

    // AND conditions only
    foreach (preg_split('/\s+AND\s+/i', $where) as $c) {
        $f = _cond(trim($c)); if ($f) $parts[] = $f;
    }
    return $parts;
}

/**
 * Parse VALUES(...) template, substituting ? from $params and converting
 * SQL keywords (NOW(), NULL) to PHP values suitable for a JSON body.
 */
function _parse_values_tpl(string $tpl, array &$params, int &$pi): array {
    $result = [];
    $i = 0; $n = strlen($tpl);
    while ($i < $n) {
        while ($i < $n && ctype_space($tpl[$i])) $i++;
        if ($i >= $n || $tpl[$i] === ')') break;

        if ($tpl[$i] === '?') {
            $result[] = $params[$pi++] ?? null;
            $i++;
        } elseif ($tpl[$i] === "'") {
            $i++; $str = '';
            while ($i < $n) {
                if ($tpl[$i] === "'" && isset($tpl[$i+1]) && $tpl[$i+1] === "'") { $str .= "'"; $i += 2; }
                elseif ($tpl[$i] === "'") { $i++; break; }
                else { $str .= $tpl[$i++]; }
            }
            $result[] = $str;
        } else {
            $tok = '';
            $depth = 0;
            while ($i < $n && ($tpl[$i] !== ',' || $depth > 0)) {
                if ($tpl[$i] === '(') $depth++;
                elseif ($tpl[$i] === ')') { if ($depth === 0) break; $depth--; }
                $tok .= $tpl[$i++];
            }
            $tok = trim($tok);
            $result[] = _sql_token_to_php($tok);
        }
        while ($i < $n && ctype_space($tpl[$i])) $i++;
        if ($i < $n && $tpl[$i] === ',') $i++;
    }
    return $result;
}

/** Parse SET col=val, col2=val2 from bound SQL into a JSON body array */
function _parse_set(string $set): array {
    // Split on commas outside parentheses
    $parts = []; $cur = ''; $d = 0;
    foreach (str_split($set) as $c) {
        if ($c === '(') { $d++; $cur .= $c; }
        elseif ($c === ')') { $d--; $cur .= $c; }
        elseif ($c === ',' && $d === 0) { $parts[] = trim($cur); $cur = ''; }
        else { $cur .= $c; }
    }
    if (trim($cur)) $parts[] = trim($cur);

    $body = [];
    foreach ($parts as $part) {
        if (!preg_match('/^(\w+)\s*=\s*(.+)$/', trim($part), $m)) continue;
        [$col, $val] = [trim($m[1]), trim($m[2])];
        // Skip relative updates (col = col + 1) — not supported via JSON PATCH
        if (preg_match('/^\w+\s*[+\-\*\/]/', $val)) continue;
        $body[$col] = _sql_token_to_php($val);
    }
    return $body;
}

/**
 * Extract the VALUES(...) content from an INSERT statement, handling
 * quoted strings that may contain parens or commas.
 */
function _extract_values_block(string $sql): array {
    // Find VALUES keyword
    $vs = stripos($sql, 'VALUES');
    if ($vs === false) return ['', $sql];
    $open = strpos($sql, '(', $vs);
    if ($open === false) return ['', $sql];

    $depth = 1; $i = $open + 1; $n = strlen($sql);
    while ($i < $n && $depth > 0) {
        $c = $sql[$i];
        if ($c === "'") {
            $i++;
            while ($i < $n) {
                if ($sql[$i] === "'" && isset($sql[$i+1]) && $sql[$i+1] === "'") { $i += 2; continue; }
                if ($sql[$i] === "'") { $i++; break; }
                $i++;
            }
            continue;
        }
        if ($c === '(') $depth++;
        elseif ($c === ')') $depth--;
        $i++;
    }
    return [substr($sql, $open + 1, $i - $open - 2), substr($sql, $i)];
}

/** Translate SQL to Supabase PostgREST REST calls */
function _rest_exec(string $sql, array $params): array {
    // SQL is pre-normalised by callers (_normalize_sql applied before _sb_execute).
    $type = strtoupper(substr(ltrim($sql), 0, 6));

    // ── SELECT ────────────────────────────────────────────────────────────────
    if ($type === 'SELECT') {
        if (preg_match('/\b(JOIN|GROUP\s+BY|HAVING|UNION)\b/i', $sql)) {
            throw new RuntimeException('PostgREST fallback: JOINs/GROUP BY require php_exec (run setup-supabase-rpc.sql).');
        }
        $bound  = _bind($sql, $params);
        $parsed = _select_to_rest_url($bound);
        if (!$parsed) {
            throw new RuntimeException('PostgREST: cannot parse SELECT: ' . substr($bound, 0, 120));
        }
        $rows = _sb_http('GET', $parsed['url'], null);
        if ($parsed['is_count']) {
            $cols = $parsed['cols'];
            preg_match('/^(?:COALESCE\s*\(\s*)?COUNT\s*\(\s*\*\s*\)|SUM\s*\((\w+)\))\s*(?:,.*)?(?:AS\s+(\w+))?/i', $cols, $cm);
            $alias = $cm[2] ?? (str_contains(strtoupper($cols), 'SUM') ? 'sum' : 'count');
            if (str_contains(strtoupper($cols), 'SUM')) {
                $col = $cm[1] ?? 'amount';
                return [[$alias => array_sum(array_column($rows, $col))]];
            }
            return [[$alias => count($rows)]];
        }
        return is_array($rows) ? $rows : [];
    }

    // ── INSERT ────────────────────────────────────────────────────────────────
    if ($type === 'INSERT') {
        // Extract table and columns from the SQL template (not from bound SQL)
        if (!preg_match('/^INSERT\s+(?:IGNORE\s+)?INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(/i', $sql, $hm)) {
            throw new RuntimeException('PostgREST: cannot parse INSERT header: ' . substr($sql, 0, 120));
        }
        $table = trim($hm[1]);
        $cols  = array_map('trim', explode(',', $hm[2]));

        // Extract values block from template SQL (preserving ? placeholders)
        [$vals_tpl, $rest_sql] = _extract_values_block($sql);

        $pi   = 0;
        $vals = _parse_values_tpl($vals_tpl, $params, $pi);

        if (count($cols) !== count($vals)) {
            throw new RuntimeException("PostgREST INSERT col/value mismatch on {$table}: " . count($cols) . ' cols, ' . count($vals) . ' vals');
        }
        $body = array_combine($cols, $vals);
        $rest_sql = trim($rest_sql); // ON CONFLICT..., RETURNING..., etc.

        $has_return = (bool) preg_match('/\bRETURNING\b/i', $rest_sql);

        // ON CONFLICT(col) DO UPDATE SET col = col + 1  →  read-modify-write
        if (preg_match('/ON\s+CONFLICT\s*\((\w+)\)\s*DO\s+UPDATE\s+SET\s+(\w+)\s*=\s*\2\s*\+\s*1/i', $rest_sql, $cm)) {
            $ck = $cm[1]; $ic = $cm[2];
            $cv = rawurlencode((string)($body[$ck] ?? ''));
            $existing = _sb_http('GET', SUPABASE_URL . '/rest/v1/' . $table . '?' . $ck . '=eq.' . $cv, null);
            if (!empty($existing[0])) {
                _sb_http('PATCH', SUPABASE_URL . '/rest/v1/' . $table . '?' . $ck . '=eq.' . $cv,
                    [$ic => (int)($existing[0][$ic] ?? 0) + 1], ['Prefer: return=minimal']);
            } else {
                _sb_http('POST', SUPABASE_URL . '/rest/v1/' . $table, $body, ['Prefer: return=minimal']);
            }
            return ['affected' => 1];
        }

        $prefer = 'return=' . ($has_return ? 'representation' : 'minimal');
        if (preg_match('/ON\s+CONFLICT\s+DO\s+NOTHING/i', $rest_sql)) {
            $prefer = 'resolution=ignore-duplicates,' . $prefer;
        } elseif (str_starts_with($sql, 'INSERT IGNORE ')) {
            $prefer = 'resolution=ignore-duplicates,' . $prefer;
        }

        $rows = _sb_http('POST', SUPABASE_URL . '/rest/v1/' . $table, $body, ['Prefer: ' . $prefer]);
        if ($has_return) return is_array($rows) ? (isset($rows[0]) ? $rows : ($rows ? [$rows] : [])) : [];
        return ['affected' => 1];
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    if ($type === 'UPDATE') {
        $bound = _bind($sql, $params);
        if (!preg_match('/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+?)(?:\s*;)?\s*$/is', $bound, $m)) {
            throw new RuntimeException('PostgREST: cannot parse UPDATE: ' . substr($bound, 0, 120));
        }
        $table = trim($m[1]);
        $body  = _parse_set(trim($m[2]));
        $wqs   = _where_qs(trim($m[3]));
        if (empty($body)) throw new RuntimeException("PostgREST UPDATE produced empty body for {$table} - relative updates (col=col+1) not supported.");
        $qs = $wqs ? '?' . implode('&', $wqs) : '';
        _sb_http('PATCH', SUPABASE_URL . '/rest/v1/' . $table . $qs, $body, ['Prefer: return=minimal']);
        return ['affected' => 1];
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    if ($type === 'DELETE') {
        $bound = _bind($sql, $params);
        if (!preg_match('/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s*;)?\s*$/is', $bound, $m)) {
            throw new RuntimeException('PostgREST: cannot parse DELETE: ' . substr($bound, 0, 120));
        }
        $wqs = !empty($m[2]) ? _where_qs(trim($m[2])) : [];
        $qs  = $wqs ? '?' . implode('&', $wqs) : '';
        _sb_http('DELETE', SUPABASE_URL . '/rest/v1/' . trim($m[1]) . $qs, null);
        return ['affected' => 1];
    }

    throw new RuntimeException('PostgREST: unsupported SQL type: ' . substr($sql, 0, 50));
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart dispatcher  –  Path A first (if enabled), Path B fallback
// ─────────────────────────────────────────────────────────────────────────────
function _sb_execute(string $sql, array $params): array {
    // When SUPABASE_RPC_ENABLED=false we jump straight to PostgREST, skipping
    // the failed php_exec probe that would otherwise cost one full Supabase
    // round-trip (~150-300ms) on the first DB call of every worker process.
    static $rpc_ok = null;

    if (SUPABASE_RPC_ENABLED && $rpc_ok !== false) {
        try {
            $result  = _rpc_exec($sql, $params);
            $rpc_ok  = true;
            return $result;
        } catch (RuntimeException $e) {
            $msg = $e->getMessage();
            $not_installed = str_contains($msg, 'PGRST202')
                          || str_contains($msg, 'Could not find')
                          || str_contains($msg, 'php_exec')
                          || (str_contains($msg, '404') && $rpc_ok === null);
            if ($not_installed && $rpc_ok === null) {
                $rpc_ok = false;
            } else {
                throw $e;
            }
        }
    }

    return _rest_exec($sql, $params);
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL compat: normalise SQLite/mixed syntax → PostgreSQL
// _normalize_sql() does both steps in one pass (implementation at top of file).
// pg_prep_sql() and _resolve_ignore() are compatibility aliases — prefer _normalize_sql().
// ─────────────────────────────────────────────────────────────────────────────
function pg_prep_sql(string $sql): string    { return _normalize_sql($sql); }
function _resolve_ignore(string $sql): string { return _normalize_sql($sql); }

// ─────────────────────────────────────────────────────────────────────────────
// Convert raw _sb_execute result to FakeStatement
// ─────────────────────────────────────────────────────────────────────────────
function _to_stmt(array $data): FakeStatement {
    if (isset($data[0]) && is_array($data[0]))              return new FakeStatement($data, count($data));
    if (!empty($data) && !isset($data['affected'], $data[0])) return new FakeStatement([$data], 1);
    return new FakeStatement([], (int)($data['affected'] ?? 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API  –  identical contract to the original PDO-based db.php
// ─────────────────────────────────────────────────────────────────────────────
function db_query(string $sql, array $params = []): FakeStatement {
    return _to_stmt(_sb_execute(_normalize_sql($sql), $params));
}

function db_fetch_all(string $sql, array $params = []): array {
    try {
        return db_query($sql, $params)->fetchAll();
    } catch (RuntimeException $e) {
        if (_is_postgrest_fallback_err($e->getMessage())) {
            // Complex queries (JOINs, aggregates) fail gracefully in PostgREST fallback mode
            error_log('[ExtoArts] PostgREST fallback unsupported query - run setup-supabase-rpc.sql. SQL: ' . substr($sql, 0, 100));
            return [];
        }
        throw $e;
    }
}

function db_fetch(string $sql, array $params = []): ?array {
    $row = db_query($sql, $params)->fetch();
    return $row === false ? null : $row;
}

function db_value(string $sql, array $params = []): mixed {
    try {
        $row = db_fetch($sql, $params);
        return $row ? reset($row) : null;
    } catch (RuntimeException $e) {
        if (_is_postgrest_fallback_err($e->getMessage())) {
            error_log('[ExtoArts] PostgREST fallback unsupported: ' . substr($sql, 0, 100));
            return null;
        }
        throw $e;
    }
}

function db_insert(string $sql, array $params = []): int {
    $sql = _normalize_sql($sql);
    if (stripos($sql, 'RETURNING') === false) $sql = rtrim($sql, '; ') . ' RETURNING id';
    $data = _sb_execute($sql, $params);
    $rows = _to_stmt($data)->fetchAll();
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
}

function db_execute(string $sql, array $params = []): int {
    return db_query($sql, $params)->rowCount();
}

// ─────────────────────────────────────────────────────────────────────────────
// Parallel SELECT fetcher  –  fires N independent queries concurrently
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Execute multiple independent SELECT queries in parallel using curl_multi.
 * Cuts N×RTT down to ~1×RTT for pages with several independent DB reads.
 *
 * Usage:
 *   [$orders, $stats, $notifs] = db_fetch_parallel([
 *       ["SELECT * FROM orders WHERE client_id = ? LIMIT 20", [$uid]],
 *       ["SELECT COUNT(*) AS count FROM orders WHERE client_id = ?", [$uid]],
 *       ["SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", [$uid]],
 *   ]);
 *
 * Restrictions: SELECT only, no JOINs/GROUP BY (same as PostgREST fallback).
 * Falls back to sequential db_fetch_all() for any query it cannot parse.
 *
 * @param array $queries  Array of [$sql, $params] pairs
 * @return array          Array of result-sets, same order as $queries
 */
function db_fetch_parallel(array $queries): array {
    if (count($queries) <= 1) {
        return array_map(fn($q) => db_fetch_all($q[0], $q[1] ?? []), $queries);
    }

    $base_headers = [
        'apikey: '               . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Accept: application/json',
    ];

    $urls     = [];
    $fallback = [];

    foreach ($queries as $i => [$sql, $params]) {
        $params = $params ?? [];
        $sql    = _normalize_sql($sql);

        if (preg_match('/\b(JOIN|GROUP\s+BY|HAVING|UNION)\b/i', $sql)) {
            $fallback[$i] = [$sql, $params];
            continue;
        }

        $parsed = _select_to_rest_url(_bind($sql, $params));
        if (!$parsed) {
            $fallback[$i] = [$sql, $params];
            continue;
        }

        $urls[$i] = $parsed['url'];
    }

    $results = array_fill(0, count($queries), []);

    if (!empty($urls) && function_exists('curl_multi_exec')) {
        $mh      = curl_multi_init();
        $handles = [];

        foreach ($urls as $i => $url) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 12,
                CURLOPT_CONNECTTIMEOUT => 6,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_TCP_KEEPALIVE  => 1,
                CURLOPT_FORBID_REUSE   => false,
                CURLOPT_FRESH_CONNECT  => false,
                CURLOPT_HTTPHEADER     => $base_headers,
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[$i] = $ch;
        }

        do {
            $ms = curl_multi_exec($mh, $active);
            if ($active) curl_multi_select($mh);
        } while ($active && $ms === CURLM_OK);

        foreach ($handles as $i => $ch) {
            $resp  = curl_multi_getcontent($ch);
            $hcode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
            $data        = json_decode($resp ?? '', true) ?? [];
            $results[$i] = ($hcode < 400 && is_array($data)) ? $data : [];
        }

        curl_multi_close($mh);
    } elseif (!empty($urls)) {
        foreach ($urls as $i => $url) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 12,
                CURLOPT_CONNECTTIMEOUT => 6,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_HTTPHEADER     => $base_headers,
            ]);
            $resp  = curl_exec($ch);
            $hcode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            $data        = json_decode($resp ?: '', true) ?? [];
            $results[$i] = ($hcode < 400 && is_array($data)) ? $data : [];
        }
    }

    foreach ($fallback as $i => [$sql, $params]) {
        $results[$i] = db_fetch_all($sql, $params);
    }

    return $results;
}

// ── db() stub for health.php ──────────────────────────────────────────────────
function db(): object {
    return new class {
        public function query(string $sql): FakeStatement {
            return _to_stmt(_sb_execute($sql, []));
        }
    };
}

// ── Audit log ─────────────────────────────────────────────────────────────────
function db_audit(int $actor_id, string $action, string $target_type = '', int $target_id = 0, string $detail = ''): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    try {
        db_insert("INSERT INTO audit_log (actor_id,action,target_type,target_id,detail,ip,created_at) VALUES (?,?,?,?,?,?,NOW())",
            [$actor_id, $action, $target_type, $target_id, $detail, $ip]);
    } catch (Throwable) {}
}

// ── Notifications ─────────────────────────────────────────────────────────────
function db_notify(int $user_id, string $type, string $title, string $body = '', string $link = ''): void {
    try {
        db_insert("INSERT INTO notifications (user_id,type,title,body,link,created_at) VALUES (?,?,?,?,?,NOW())",
            [$user_id, $type, $title, $body, $link]);
    } catch (Throwable) {}
}
