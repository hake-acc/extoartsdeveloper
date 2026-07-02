<?php
declare(strict_types=1);
/**
 * ExtoArts - Error Visibility System
 *
 * Guarantees ALL PHP errors (fatal, warning, notice, exception) are shown
 * as a prominent on-page overlay - impossible to miss, with full details
 * and a "copy to report" button for the dev team.
 *
 * Loaded at the very top of router.php via require_once.
 * API endpoints (define _EXTOARTS_JSON_ENDPOINT) get structured JSON instead.
 */

$GLOBALS['_xta_errors'] = [];

// Buffer all output so we can inject the overlay before anything is sent
ob_start();

// ---------------------------------------------------------------------------
// Non-fatal error handler (warnings, notices, deprecated, strict)
// ---------------------------------------------------------------------------
set_error_handler(function (int $errno, string $errstr, string $errfile, int $errline): bool {
    if (!(error_reporting() & $errno)) return false;
    $labels = [
        E_WARNING           => ['Warning',          'warn'],
        E_NOTICE            => ['Notice',            'info'],
        E_DEPRECATED        => ['Deprecated',        'info'],
        E_USER_ERROR        => ['User Error',        'fatal'],
        E_USER_WARNING      => ['User Warning',      'warn'],
        E_USER_NOTICE       => ['User Notice',       'info'],
        E_STRICT            => ['Strict',            'info'],
        E_RECOVERABLE_ERROR => ['Recoverable Error', 'warn'],
    ];
    [$label, $sev] = $labels[$errno] ?? ["Error($errno)", 'warn'];
    $GLOBALS['_xta_errors'][] = [
        'label' => $label,
        'sev'   => $sev,
        'msg'   => $errstr,
        'file'  => $errfile,
        'line'  => $errline,
        'trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 12),
        'ts'    => microtime(true),
    ];
    return true; // suppress PHP's own output
});

// ---------------------------------------------------------------------------
// Uncaught exception handler
// ---------------------------------------------------------------------------
set_exception_handler(function (Throwable $e): void {
    $GLOBALS['_xta_errors'][] = [
        'label' => get_class($e),
        'sev'   => 'fatal',
        'msg'   => $e->getMessage(),
        'file'  => $e->getFile(),
        'line'  => $e->getLine(),
        'trace' => $e->getTrace(),
        'ts'    => microtime(true),
    ];
    _xta_flush();
    exit(1);
});

// ---------------------------------------------------------------------------
// Shutdown handler - catches E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR
// ---------------------------------------------------------------------------
register_shutdown_function(function (): void {
    $last  = error_get_last();
    $fatal = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR, E_RECOVERABLE_ERROR];
    if ($last && in_array($last['type'], $fatal, true)) {
        $labels = [E_ERROR => 'Fatal Error', E_PARSE => 'Parse Error', E_CORE_ERROR => 'Core Error',
                   E_COMPILE_ERROR => 'Compile Error', E_USER_ERROR => 'User Fatal', E_RECOVERABLE_ERROR => 'Recoverable Error'];
        $GLOBALS['_xta_errors'][] = [
            'label' => $labels[$last['type']] ?? 'Fatal Error',
            'sev'   => 'fatal',
            'msg'   => $last['message'],
            'file'  => $last['file'],
            'line'  => $last['line'],
            'trace' => null,
            'ts'    => microtime(true),
        ];
    }
    _xta_flush();
});

// ---------------------------------------------------------------------------
// Core flush - injects overlay or JSON and sends buffered output
// ---------------------------------------------------------------------------
function _xta_flush(): void
{
    if (empty($GLOBALS['_xta_errors'])) {
        if (ob_get_level() > 0) ob_end_flush();
        return;
    }

    // On production: log silently, never expose details or file paths to users
    $isProd = in_array(
        strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]),
        ['extoarts.in', 'www.extoarts.in'],
        true
    );
    if ($isProd) {
        foreach ($GLOBALS['_xta_errors'] as $e) {
            error_log('[ExtoArts] ' . ($e['label'] ?? 'Error') . ': '
                . ($e['msg'] ?? '') . ' in '
                . ($e['file'] ?? '') . ':' . ($e['line'] ?? ''));
        }
        if (ob_get_level() > 0) ob_end_flush();
        return;
    }

    // JSON endpoint - return structured error
    if (defined('_EXTOARTS_JSON_ENDPOINT')) {
        if (ob_get_level() > 0) ob_end_clean();
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json');
        }
        $first = $GLOBALS['_xta_errors'][0];
        echo json_encode([
            'ok'     => false,
            'error'  => $first['label'] . ': ' . $first['msg'],
            '_debug' => array_map(fn($e) => [
                'type' => $e['label'], 'msg' => $e['msg'],
                'file' => $e['file'],  'line' => $e['line'],
            ], $GLOBALS['_xta_errors']),
        ]);
        return;
    }

    // HTML page - inject overlay
    $content = ob_get_level() > 0 ? ob_get_clean() : '';
    $overlay = _xta_build_overlay($GLOBALS['_xta_errors']);

    if (stripos($content, '</body>') !== false) {
        $content = substr_replace($content, $overlay . "\n", strripos($content, '</body>'), 0);
    } elseif (stripos($content, '</html>') !== false) {
        $content = substr_replace($content, $overlay . "\n", strripos($content, '</html>'), 0);
    } else {
        $content .= "\n" . $overlay;
    }

    echo $content;
}

// ---------------------------------------------------------------------------
// Build the error overlay HTML
// ---------------------------------------------------------------------------
function _xta_build_overlay(array $errors): string
{
    $root      = rtrim(__DIR__, '/\\');
    $count     = count($errors);
    $hasFatal  = array_reduce($errors, fn($c, $e) => $c || $e['sev'] === 'fatal', false);
    $pageUrl   = htmlspecialchars($_SERVER['REQUEST_URI'] ?? '/');

    $sevColor = fn(string $s): string => match ($s) {
        'fatal' => '#ef4444',
        'warn'  => '#f59e0b',
        default => '#6b7280',
    };
    $sevBg = fn(string $s): string => match ($s) {
        'fatal' => '#7f1d1d',
        'warn'  => '#78350f',
        default => '#1f2937',
    };

    // Build each error card
    $cards = '';
    foreach ($errors as $idx => $err) {
        $shortFile = htmlspecialchars(str_replace($root, '', $err['file'] ?? 'unknown'));
        $line      = (int) ($err['line'] ?? 0);
        $msg       = htmlspecialchars($err['msg'] ?? 'Unknown error');
        $label     = htmlspecialchars($err['label'] ?? 'Error');
        $ts        = isset($err['ts']) ? date('H:i:s', (int) $err['ts']) : '';
        $sc        = $sevColor($err['sev']);
        $n         = $idx + 1;

        // Stack trace block
        $traceHtml = '';
        if (!empty($err['trace'])) {
            $frames = '';
            foreach (array_slice($err['trace'], 0, 12) as $fi => $frame) {
                $ff  = htmlspecialchars(str_replace($root, '', $frame['file'] ?? '[internal]'));
                $fl  = $frame['line'] ?? '?';
                $fn  = htmlspecialchars(
                    ($frame['class'] ?? '') . ($frame['type'] ?? '') . ($frame['function'] ?? '{closure}')
                );
                $frames .= "<span style='color:#9ca3af'>#{$fi}</span> <span style='color:#60a5fa'>{$fn}()</span> <span style='color:#6b7280'>{$ff}:{$fl}</span>\n";
            }
            $fc = count($err['trace']);
            $traceHtml = "<details style='margin-top:10px'><summary style='cursor:pointer;color:#9ca3af;font-size:11px;user-select:none'>STACK TRACE ({$fc} frames) - click to expand</summary><pre style='margin-top:8px;font-size:11px;line-height:1.7;overflow-x:auto;padding:10px;background:#050508;border-radius:6px;white-space:pre-wrap;word-break:break-all'>{$frames}</pre></details>";
        }

        $cards .= <<<CARD
        <div style="background:#0d0306;border:1px solid {$sc}33;border-left:4px solid {$sc};border-radius:8px;padding:14px 16px;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
                <span style="background:{$sc};color:#fff;font-weight:900;padding:2px 9px;border-radius:4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase">{$label}</span>
                <code style="color:{$sc};font-size:12px;background:#0a0a0f;padding:2px 8px;border-radius:4px">{$shortFile}:{$line}</code>
                <span style="color:#374151;font-size:11px;margin-left:auto">{$ts}</span>
            </div>
            <p style="color:#f0f0f0;font-size:13.5px;line-height:1.65;margin:0;word-break:break-word">{$msg}</p>
            {$traceHtml}
        </div>
CARD;
    }

    $bannerText   = $hasFatal ? 'FATAL ERROR DETECTED' : 'PHP ERRORS DETECTED';
    $bannerBorder = $hasFatal ? '#ef4444' : '#f59e0b';
    $bannerBg     = $hasFatal ? '#7f1d1d' : '#78350f';
    $plural       = $count === 1 ? 'error' : 'errors';
    $badge        = $count > 1 ? " ($count)" : '';

    // JSON payload for copy button (escaped for inline JS)
    $reportJson = json_encode(
        array_map(fn($e) => [
            'type'    => $e['label'],
            'message' => $e['msg'],
            'file'    => str_replace($root, '', $e['file'] ?? ''),
            'line'    => $e['line'] ?? 0,
        ], $errors),
        JSON_PRETTY_PRINT
    );
    $reportJson = htmlspecialchars($reportJson, ENT_QUOTES);

    return <<<HTML
<style>
#_xtaOv{position:fixed;top:0;left:0;right:0;z-index:2147483647;font-family:'Courier New',Courier,monospace;animation:_xtaPulse 1.8s ease-in-out infinite}
@keyframes _xtaPulse{0%,100%{box-shadow:0 2px 30px rgba(239,68,68,.35)}50%{box-shadow:0 2px 60px rgba(239,68,68,.75)}}
#_xtaBody{max-height:72vh;overflow-y:auto;padding:12px 16px 16px;background:#09040a}
#_xtaBody::-webkit-scrollbar{width:5px}
#_xtaBody::-webkit-scrollbar-thumb{background:#ef4444;border-radius:3px}
._xtaBtn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:7px;font-size:11.5px;font-weight:700;border:none;cursor:pointer;font-family:inherit;letter-spacing:.04em;transition:opacity .15s}
._xtaBtn:hover{opacity:.8}
</style>
<div id="_xtaOv">
    <div style="background:{$bannerBg};border-bottom:3px solid {$bannerBorder};padding:10px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span style="font-size:20px;line-height:1">&#x26A0;</span>
        <strong style="color:#fff;font-size:13px;letter-spacing:.12em">{$bannerText}{$badge}</strong>
        <span style="color:#d1d5db;font-size:12px">Please report this to the development team.</span>
        <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <button class="_xtaBtn" id="_xtaCopyBtn" style="background:#1e293b;color:#e2e8f0"
                onclick="(function(){
                    var payload = {
                        url: location.href,
                        ua:  navigator.userAgent,
                        ts:  new Date().toISOString(),
                        errors: JSON.parse('{$reportJson}'.replace(/&amp;/g,'&').replace(/&quot;/g,'&quot;'))
                    };
                    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(function(){
                        var b = document.getElementById('_xtaCopyBtn');
                        b.textContent = 'Copied!';
                        b.style.background = '#14532d';
                        setTimeout(function(){ b.textContent = 'Copy Error Report'; b.style.background = '#1e293b'; }, 2800);
                    }).catch(function(){
                        var t = document.createElement('textarea');
                        t.value = JSON.stringify({url:location.href, errors:{$reportJson}}, null, 2);
                        document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
                        var b = document.getElementById('_xtaCopyBtn');
                        b.textContent = 'Copied!';
                        setTimeout(function(){ b.textContent = 'Copy Error Report'; }, 2800);
                    });
                })()">
                &#x1F4CB; Copy Error Report
            </button>
            <button class="_xtaBtn" style="background:#1e293b;color:#94a3b8"
                onclick="document.getElementById('_xtaOv').style.display='none';document.body.style.paddingTop=''">
                &#x2715; Dismiss
            </button>
        </div>
    </div>
    <div id="_xtaBody">
        <p style="color:#6b7280;font-size:11px;letter-spacing:.05em;padding:8px 0 6px;margin:0">
            {$count} {$plural} detected on this page
        </p>
        {$cards}
        <div style="margin-top:14px;padding:14px 16px;background:#050508;border:1px solid #1e293b;border-radius:8px;font-size:12px;line-height:1.8;color:#9ca3af">
            <strong style="color:#f1f5f9;display:block;margin-bottom:6px">How to report this error</strong>
            1. Click <strong style="color:#60a5fa">Copy Error Report</strong> above<br>
            2. Open the ExtoArts Discord server<br>
            3. Paste in <strong style="color:#60a5fa">#bug-reports</strong> with a description of what you were doing<br>
            <span style="color:#374151;font-size:11px;margin-top:4px;display:block">Page: <code style="color:#4b5563">{$pageUrl}</code></span>
        </div>
    </div>
</div>
<script>
(function(){
    var ov = document.getElementById('_xtaOv');
    if (!ov) return;
    function pad(){ document.body.style.paddingTop = ov.offsetHeight + 'px'; }
    pad();
    new ResizeObserver(pad).observe(ov);
})();
</script>
HTML;
}
