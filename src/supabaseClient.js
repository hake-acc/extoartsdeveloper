import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL        = "https://bigopvwtprisrfhuayxs.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_5QawXQjuLRNFj1wgB5BrcQ_1nbmxTwP";

// Use implicit flow (not PKCE) for this client-side SPA.
//
// PKCE stores a code_verifier locally and sends a code_challenge to Supabase,
// which stores matching state in its flow_state table. That state lookup can
// fail (producing "bad_oauth_state") when:
//   - The redirectTo URL is not in Supabase's Redirect URL allowlist, OR
//   - The state expires (5-minute TTL), OR
//   - There is a browser/storage restriction that clears the code_verifier.
//
// Implicit flow bypasses server-side PKCE state entirely: Supabase returns
// tokens directly in the URL hash (#access_token=...) which supabase-js reads
// via detectSessionInUrl. This is the recommended approach for SPAs where the
// PHP backend is only used as a session bridge (tokens never need to be
// server-accessible).
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: {
        autoRefreshToken:   true,
        persistSession:     true,
        detectSessionInUrl: true,
        flowType:           'implicit',
    }
});

// ---------------------------------------------------------------------------
// OAuth helpers
// ---------------------------------------------------------------------------
// Store the OAuth flow intent in localStorage before redirecting to the
// provider. The callback page reads it and clears it (see oauth-callback.php).
// A clean redirectTo URL (no query params) is required so it matches the
// exact URL registered in Supabase Auth > URL Configuration.
//
// flow: 'oauth-login'  = login page  (error if no existing local account)
//       'oauth-signup' = register page (create local account if new)

const _callbackBase = () => window.location.origin + '/auth/callback';

export async function signInWithGoogle(flow = 'oauth-login') {
    try { localStorage.setItem('extoarts_oauth_flow', flow); } catch {}
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo:  _callbackBase(),
            queryParams: { access_type: 'offline', prompt: 'select_account' },
        }
    });
    if (error) { try { localStorage.removeItem('extoarts_oauth_flow'); } catch {} }
    return error;
}

export async function signInWithDiscord(flow = 'oauth-login') {
    try { localStorage.setItem('extoarts_oauth_flow', flow); } catch {}
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: _callbackBase(),
            scopes:     'identify email',
        }
    });
    if (error) { try { localStorage.removeItem('extoarts_oauth_flow'); } catch {} }
    return error;
}
