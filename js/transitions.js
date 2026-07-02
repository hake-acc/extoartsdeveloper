/**
 * ExtoArts — Page Transition Engine
 *
 * Determines navigation direction before each page load, saves it to
 * sessionStorage, and sets data-ea-trans on <html> so the correct CSS
 * animation fires for both the exiting page (VT old snapshot) and the
 * entering page (VT new snapshot / JS fallback entrance).
 *
 * Direction logic
 *   Going to a page with HIGHER or EQUAL order index → "up"  (forward)
 *   Going to a page with LOWER order index           → "down" (back)
 *
 * Browser handling
 *   Chrome 126+ / Edge 126+  — @view-transition { navigation: auto } in CSS
 *     handles everything automatically.  JS only sets the direction and
 *     navigates; the browser manages snapshots and animation.
 *
 *   Other browsers (Firefox, Safari, older Chrome) — JS adds .pt-exit to
 *     <body>, waits for the CSS transition to complete, then navigates.
 *     On the new page, the head script reads sessionStorage and sets
 *     data-ea-trans so .pt-enter-up / .pt-enter-down fire correctly.
 */
(function () {
    'use strict';

    /* ── Site page hierarchy ──────────────────────────────────────────────── */
    var PAGE_ORDER = {
        '/':                         0,
        '/services':                 1,
        '/thumbnail-design':         1,
        '/gaming-video-editing':     1,
        '/faceless-youtube-channel': 1,
        '/youtube-shorts-editing':   1,
        '/portfolio':                2,
        '/pricing':                  3,
        '/estimate':                 3,
        '/workflow':                 4,
        '/faq':                      4,
        '/collab':                   5,
        '/about':                    5,
        '/contact':                  6,
        '/tos':                      7,
        '/privacy':                  7,
        '/ticket':                   8,
        '/support':                  8,
        '/login':                    9,
        '/register':                 9,
        '/dashboard':                9,
        '/apply':                    9,
        '/hq-portal':                10,
    };

    /* ── Detect cross-document View Transitions support ───────────────────── */
    /* CSS.supports('view-transition-name','none') is true in Chrome 111+.
       Combined with the Navigation API ('navigation' in window, Chrome 102+),
       this reliably identifies Chrome 111+ where @view-transition { navigation:
       auto } works.  For these browsers we skip the JS fallback entirely and
       let the CSS handle everything. */
    var hasViewTransitions = (
        typeof CSS !== 'undefined' &&
        CSS.supports('view-transition-name', 'none') &&
        'navigation' in window
    );

    /* ── Current page ─────────────────────────────────────────────────────── */
    var currentPath  = window.location.pathname.replace(/\/$/, '') || '/';
    var currentOrder = PAGE_ORDER[currentPath] !== undefined
        ? PAGE_ORDER[currentPath]
        : 4;

    /* ── Direction helper ─────────────────────────────────────────────────── */
    function getDir(href) {
        try {
            var url         = new URL(href, window.location.href);
            var targetPath  = url.pathname.replace(/\/$/, '') || '/';
            var targetOrder = PAGE_ORDER[targetPath] !== undefined
                ? PAGE_ORDER[targetPath]
                : 4;
            return targetOrder >= currentOrder ? 'up' : 'down';
        } catch (e) {
            return 'up';
        }
    }

    /* ── Filter: only same-origin non-fragment links ─────────────────────── */
    function isInternalNav(link) {
        var href = link.getAttribute('href');
        if (!href)                              return false;
        if (href.charAt(0) === '#')             return false;
        if (href.indexOf('mailto:') === 0)      return false;
        if (href.indexOf('tel:') === 0)         return false;
        if (link.hasAttribute('download'))      return false;
        if (link.target === '_blank')           return false;
        if (link.dataset && link.dataset.noTransition !== undefined) return false;
        try {
            var url = new URL(href, window.location.href);
            return url.hostname === window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    /* ── Navigate with the correct direction ─────────────────────────────── */
    function navigate(href, dir) {
        /* Persist direction so the new page head script picks it up */
        try { sessionStorage.setItem('ea_trans_dir', dir); } catch (e) {}

        if (hasViewTransitions) {
            /* Set direction on current document so the VT old-page snapshot
               includes data-ea-trans — the CSS uses it to pick the animation. */
            document.documentElement.dataset.eaTrans = dir;
            window.location.href = href;
        } else {
            /* JS fallback: set direction + exit transform, add exit class,
               wait for the CSS transition (200ms) then navigate. */
            document.documentElement.dataset.eaTrans = dir;
            document.body.style.setProperty(
                '--pt-exit-transform',
                dir === 'up'
                    ? 'translateY(-14px) scale(0.985)'
                    : 'translateY(14px)  scale(0.985)'
            );
            document.body.classList.add('pt-exit');
            setTimeout(function () { window.location.href = href; }, 220);
        }
    }

    /* ── Attach click handlers to all eligible links ─────────────────────── */
    function attachHandlers() {
        document.querySelectorAll('a').forEach(function (link) {
            if (link._ptAttached) return;
            link._ptAttached = true;
            if (!isInternalNav(link)) return;
            link.addEventListener('click', function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                if (!isInternalNav(this)) return;
                var href = this.getAttribute('href');
                e.preventDefault();
                navigate(href, getDir(href));
            });
        });
    }

    /* ── JS fallback: apply entrance animation on new page ───────────────── */
    function applyEntrance() {
        if (hasViewTransitions) return; /* CSS View Transitions handles it */

        /* Only animate when the intro loader has been skipped (returning visitor).
           First-time visitors see the intro loader instead of the entrance anim. */
        var isReturn = document.documentElement.dataset.eaReturn === '1';
        if (!isReturn) return;

        var dir = document.documentElement.dataset.eaTrans || 'up';
        document.body.classList.add('pt-enter-' + dir);

        function cleanup(e) {
            if (e.animationName === 'ptEnterUp' || e.animationName === 'ptEnterDown') {
                document.body.classList.remove('pt-enter-up', 'pt-enter-down');
                document.body.removeEventListener('animationend', cleanup);
            }
        }
        document.body.addEventListener('animationend', cleanup);
    }

    /* ── Restore body state after bfcache restore (back/forward) ─────────── */
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            document.body.classList.remove('pt-exit', 'pt-enter-up', 'pt-enter-down');
            document.body.style.removeProperty('--pt-exit-transform');
            document.body.style.removeProperty('opacity');
            document.body.style.removeProperty('filter');
            delete document.documentElement.dataset.eaTrans;
        }
    });

    /* ── Boot ─────────────────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        attachHandlers();
        applyEntrance();
    });

}());
