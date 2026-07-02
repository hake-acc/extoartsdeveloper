import { supabase } from '/src/supabaseClient.js';

(async () => {
    // getUser() does a server round-trip to verify the token, avoiding the
    // false-positive logout that getSession() (cache-only) causes when
    // autoRefreshToken is mid-refresh at page load time.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/login';
    }
})();
