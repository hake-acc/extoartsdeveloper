/**
 * ExtoArts — Premium UX Enhancement System v1
 * Scroll progress, back-to-top, extended magnetics, click ripple,
 * copy-to-clipboard, nav active, form premium, preview parallax,
 * tilt-card depth, digital haptics, keyboard shortcuts,
 * stat hover, anchor scroll, social link glow.
 *
 * GPU-safe: all visual changes use transform + opacity only.
 * Respects: prefers-reduced-motion, data-perf="low", pointer:coarse.
 */
(function () {
    'use strict';

    /* ─── CAPABILITY FLAGS ─── */
    var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine     = window.matchMedia('(pointer: fine)').matches;
    var lowPerf  = document.documentElement.getAttribute('data-perf') === 'low';
    var touchDev = ('ontouchstart' in window);

    /* ─── RAF THROTTLE HELPER ─── */
    function rafThrottle(fn) {
        var ticking = false;
        return function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () { fn(); ticking = false; });
        };
    }

    /* ═══════════════════════════════════════════════════════════════
       1. SCROLL PROGRESS BAR
       After loader clears (extoReady), hijacks #page-progress to
       show reading progress instead of load progress.
    ═══════════════════════════════════════════════════════════════ */
    function initScrollProgress() {
        var bar = document.getElementById('page-progress');
        if (!bar) return;

        /* Reset any load-progress state */
        bar.style.transition  = 'none';
        bar.style.transform   = 'scaleX(0)';
        bar.style.opacity     = '0';

        requestAnimationFrame(function () {
            bar.style.transition = 'transform 0.16s ease, opacity 0.32s ease';
        });

        var update = rafThrottle(function () {
            var doc   = document.documentElement;
            var total = doc.scrollHeight - doc.clientHeight;
            if (total <= 0) return;
            var pct = (window.scrollY / total) * 100;
            bar.style.transform = 'scaleX(' + (pct / 100).toFixed(4) + ')';
            bar.style.opacity   = pct > 1.5 ? '1' : '0';
        });

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ═══════════════════════════════════════════════════════════════
       2. BACK-TO-TOP BUTTON
       Floating circular button with SVG scroll-progress ring.
       Appears after 400px of scroll. Smooth-scrolls on click.
    ═══════════════════════════════════════════════════════════════ */
    function initBackToTop() {
        if (document.getElementById('ea-btt')) return; /* Already injected */

        var btn = document.createElement('button');
        btn.id  = 'ea-btt';
        btn.setAttribute('aria-label', 'Back to top');
        btn.setAttribute('title', 'Back to top');
        btn.innerHTML =
            '<svg class="btt-ring" viewBox="0 0 36 36" aria-hidden="true">' +
                '<circle class="btt-track" cx="18" cy="18" r="15.9" fill="none" stroke-width="2.2"/>' +
                '<circle class="btt-fill"  cx="18" cy="18" r="15.9" fill="none" stroke-width="2.2"' +
                ' stroke-dasharray="99.9 99.9" stroke-dashoffset="99.9"/>' +
            '</svg>' +
            '<i class="ti ti-chevron-up" aria-hidden="true"></i>';

        document.body.appendChild(btn);

        var fill    = btn.querySelector('.btt-fill');
        var visible = false;

        var update = rafThrottle(function () {
            var doc   = document.documentElement;
            var total = doc.scrollHeight - doc.clientHeight;
            var pct   = total > 0 ? window.scrollY / total : 0;

            /* Update SVG ring: dashoffset 99.9 = empty, 0 = full */
            if (fill) {
                fill.style.strokeDashoffset = (99.9 - pct * 99.9).toFixed(2);
            }

            var shouldShow = window.scrollY > 400;
            if (shouldShow !== visible) {
                visible = shouldShow;
                btn.classList.toggle('btt-visible', shouldShow);
            }
        });

        window.addEventListener('scroll', update, { passive: true });

        /* Click — smooth scroll to top */
        btn.addEventListener('click', function () {
            if (reduced) { window.scrollTo(0, 0); }
            else          { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        });

        /* Press haptic */
        btn.addEventListener('mousedown', function () {
            btn.style.transition = 'transform 0.07s ease';
            btn.style.transform  = 'scale(0.91)';
        });
        function bttRelease() {
            btn.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
            btn.style.transform  = '';
            setTimeout(function () { btn.style.transition = ''; btn.style.transform = ''; }, 400);
        }
        btn.addEventListener('mouseup',    bttRelease);
        btn.addEventListener('mouseleave', bttRelease);
    }

    /* ═══════════════════════════════════════════════════════════════
       3. CLICK RIPPLE EFFECT
       Injects an .ea-ripple element at the click point for
       buttons, cards, badges, and other interactive surfaces.
    ═══════════════════════════════════════════════════════════════ */
    function initRipple() {
        if (reduced || lowPerf) return;

        var RIPPLE_SEL = [
            '.btn-main', '.btn-outline', '.btn-glass', '.btn-luma',
            '.tilt-card', '.service-card', '.preview-card',
            '.tstack-badge', '.hp-badge', '.footer-social',
            '.nav-links a', '.rev-card', '.cap-chip'
        ].join(', ');

        document.addEventListener('click', function (e) {
            var target = e.target.closest(RIPPLE_SEL);
            if (!target) return;
            if (target.dataset.noRipple) return;

            /* Ensure position is not static */
            if (getComputedStyle(target).position === 'static') {
                target.style.position = 'relative';
            }

            var rect = target.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height) * 2.2;
            var x    = e.clientX - rect.left  - size / 2;
            var y    = e.clientY - rect.top   - size / 2;

            var ripple = document.createElement('span');
            ripple.className  = 'ea-ripple';
            ripple.style.cssText =
                'width:'  + size + 'px;' +
                'height:' + size + 'px;' +
                'left:'   + x.toFixed(1) + 'px;' +
                'top:'    + y.toFixed(1) + 'px;';

            target.appendChild(ripple);
            setTimeout(function () {
                if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
            }, 700);
        }, true);
    }

    /* ═══════════════════════════════════════════════════════════════
       4. EXTENDED MAGNETIC SYSTEM
       Expands the magnetic pull from .btn-luma (in interactions.js)
       to include .btn-main, .btn-glass, .btn-outline, and badges.
       Cards get a very subtle pull (3px).
    ═══════════════════════════════════════════════════════════════ */
    function initExtendedMagnetic() {
        if (!fine || lowPerf || reduced) return;

        function magnetize(el, maxPull, radiusMult) {
            if (el.dataset.mag === '1') return; /* Skip already-magnetized */
            el.dataset.mag = '1';

            el.addEventListener('mousemove', function (e) {
                var rect  = el.getBoundingClientRect();
                var cx    = rect.left + rect.width  / 2;
                var cy    = rect.top  + rect.height / 2;
                var dx    = e.clientX - cx;
                var dy    = e.clientY - cy;
                var dist  = Math.sqrt(dx * dx + dy * dy);
                var r     = Math.max(rect.width, rect.height) * (radiusMult || 0.88);
                var pull  = Math.max(0, 1 - dist / r);
                var mx    = Math.max(-maxPull, Math.min(maxPull, dx * pull * 0.26));
                var my    = Math.max(-maxPull, Math.min(maxPull, dy * pull * 0.26));
                el.style.transform = 'translateX(' + mx.toFixed(1) + 'px) translateY(' + my.toFixed(1) + 'px)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transition = 'transform 0.44s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.transform  = '';
                setTimeout(function () { el.style.transition = ''; }, 450);
            });
        }

        /* Buttons — 6px pull */
        document.querySelectorAll('.btn-main, .btn-outline, .btn-glass').forEach(function (el) {
            magnetize(el, 6, 0.92);
        });

        /* Trust badges — 3px pull */
        document.querySelectorAll('.tstack-badge').forEach(function (el) {
            magnetize(el, 3, 0.78);
        });

        /* Platform badges (hp-badge) — 4px pull */
        document.querySelectorAll('.hp-badge').forEach(function (el) {
            magnetize(el, 4, 0.82);
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       6. COPY TO CLIPBOARD
       Clicking email links copies the address and shows a toast.
       Elements with [data-copy] copy that attribute value.
    ═══════════════════════════════════════════════════════════════ */
    function initCopyToClipboard() {
        if (!navigator.clipboard) return;

        /* Toast element — reuse if already created */
        var toast = document.getElementById('ea-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ea-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }

        var toastTimer;
        function showToast(msg, icon) {
            toast.innerHTML = (icon ? '<i class="' + icon + '" aria-hidden="true"></i> ' : '') + msg;
            toast.classList.add('ea-toast-show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toast.classList.remove('ea-toast-show');
            }, 2400);
        }

        /* Email links */
        document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
            el.addEventListener('click', function () {
                var email = el.href.replace('mailto:', '').split('?')[0];
                navigator.clipboard.writeText(email)
                    .then(function () { showToast(email + ' copied!', 'ti ti-circle-check'); })
                    .catch(function () {});
            });
        });

        /* [data-copy] elements */
        document.querySelectorAll('[data-copy]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                var text = el.getAttribute('data-copy');
                navigator.clipboard.writeText(text)
                    .then(function () { showToast('Copied!', 'ti ti-circle-check'); })
                    .catch(function () {});
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       7. NAV ACTIVE STATE
       Marks the current page's nav and mobile-nav links with .active
       based on window.location.pathname.
    ═══════════════════════════════════════════════════════════════ */
    function initNavActive() {
        var path = window.location.pathname.replace(/\/$/, '') || '/';

        document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
            var href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
            var isActive = href === '/' ? path === '/' : path === href;
            if (isActive) a.classList.add('active');
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       8. FORM FIELD PREMIUMIZATION
       Adds floating-label feel: tracks filled state, focus glow.
       Applies to ALL inputs/textareas/selects on every page.
    ═══════════════════════════════════════════════════════════════ */
    function initFormPremium() {
        document.querySelectorAll('input, textarea, select').forEach(function (el) {
            /* has-value tracking */
            function checkFill() {
                el.classList.toggle('ea-has-value', el.value.trim().length > 0);
            }
            el.addEventListener('input',  checkFill);
            el.addEventListener('change', checkFill);
            checkFill(); /* Initial state */

            /* Parent focus group */
            var parent = el.closest('.form-group, .field-wrap, .form-field, .input-wrap, .auth-field');
            if (!parent) return;

            el.addEventListener('focus', function () { parent.classList.add('ea-focused'); });
            el.addEventListener('blur',  function () { parent.classList.remove('ea-focused'); });
        });

        /* Auto-sanitize phone fields */
        document.querySelectorAll('input[type="tel"]').forEach(function (el) {
            el.addEventListener('input', function () {
                el.value = el.value.replace(/[^\d+\-() ]/g, '');
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       9. PREVIEW CARD DEPTH PARALLAX
       On .preview-card hover, image translates opposite to cursor
       direction creating a layered 3D depth effect.
    ═══════════════════════════════════════════════════════════════ */
    function initPreviewParallax() {
        if (!fine || lowPerf || reduced) return;

        document.querySelectorAll('.preview-card').forEach(function (card) {
            var img = card.querySelector('img');
            if (!img) return;

            img.style.willChange = 'transform';

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var px   = (e.clientX - rect.left)  / rect.width  - 0.5; /* -0.5 to 0.5 */
                var py   = (e.clientY - rect.top)   / rect.height - 0.5;
                img.style.transition = 'transform 0.10s ease';
                img.style.transform  =
                    'scale(1.07) ' +
                    'translate(' + (-px * 9).toFixed(1) + 'px, ' + (-py * 7).toFixed(1) + 'px)';
            });

            card.addEventListener('mouseleave', function () {
                img.style.transition = 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)';
                img.style.transform  = '';
                setTimeout(function () { img.style.willChange = 'auto'; }, 540);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       10. TILT-CARD INNER CONTENT DEPTH
       tilt-inner content shifts subtly in hover direction,
       creating a parallax depth against the card background.
    ═══════════════════════════════════════════════════════════════ */
    function initTiltCardDepth() {
        if (!fine || reduced || lowPerf) return;

        document.querySelectorAll('.tilt-card').forEach(function (card) {
            /* Skip js-tilt cards — they handle their own tilt */
            if (!card.classList.contains('js-tilt')) {
                var inner = card.querySelector('.tilt-inner');
                if (!inner) return;
            } else {
                return; /* js-tilt cards are already handled */
            }
            /* This path handles non-js-tilt .tilt-cards if any */
            inner.style.willChange = 'transform';

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var px   = (e.clientX - rect.left)  / rect.width  - 0.5;
                var py   = (e.clientY - rect.top)   / rect.height - 0.5;
                inner.style.transition = 'transform 0.10s ease';
                inner.style.transform  =
                    'translate(' + (px * 6).toFixed(1) + 'px, ' + (py * 4).toFixed(1) + 'px)';
            });

            card.addEventListener('mouseleave', function () {
                inner.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
                inner.style.transform  = '';
                setTimeout(function () { inner.style.willChange = 'auto'; }, 460);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       11. DIGITAL HAPTICS — SPRING RELEASE
       After mouseup on any interactive element, applies a brief
       elastic bounce animation via the .ea-spring CSS class.
    ═══════════════════════════════════════════════════════════════ */
    function initDigitalHaptics() {
        if (reduced || lowPerf) return;

        var HAPTIC_SEL = [
            '.btn-main', '.btn-outline', '.btn-glass',
            '.tstack-badge', '.footer-social', '.hp-badge',
            '.cap-chip', '.tilt-card', '.preview-card',
            '.footer-pay-badge'
        ].join(', ');

        /* Track which element received mousedown */
        var lastPressed = null;

        document.addEventListener('mousedown', function (e) {
            lastPressed = e.target.closest(HAPTIC_SEL);
        }, { capture: true });

        document.addEventListener('mouseup', function () {
            if (!lastPressed) return;
            var el = lastPressed;
            lastPressed = null;
            el.classList.remove('ea-spring');
            /* Force reflow so animation restarts if rapid-clicked */
            void el.offsetWidth;
            el.classList.add('ea-spring');
            setTimeout(function () { el.classList.remove('ea-spring'); }, 500);
        }, { capture: true });
    }

    /* ═══════════════════════════════════════════════════════════════
       12. KEYBOARD SHORTCUTS
       Escape  — close any open modal or mobile nav.
       Shift+D — open Discord modal (if available).
    ═══════════════════════════════════════════════════════════════ */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            var tag = (document.activeElement || {}).tagName;
            var inInput = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

            /* Escape — close modals / mobile nav */
            if (e.key === 'Escape') {
                /* Close any visible modal */
                var openModal = document.querySelector('.modal[style]');
                if (openModal) {
                    var mid = openModal.id;
                    if (mid && typeof closeModal === 'function') closeModal(mid);
                }
                /* Close mobile nav */
                var nav = document.querySelector('.mobile-nav.active');
                if (nav && typeof closeMobileNav === 'function') {
                    closeMobileNav();
                }
            }

            /* Shift+D — open Discord modal */
            if (e.shiftKey && e.key === 'D' && !inInput) {
                if (typeof openModal === 'function') openModal('discordModal');
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       13. STAT ITEM HOVER — NUMBER PULSE
       Stat numbers scale up and glow when user hovers the card.
    ═══════════════════════════════════════════════════════════════ */
    function initStatHover() {
        if (reduced) return;

        document.querySelectorAll('.stat-item').forEach(function (item) {
            var num = item.querySelector('.stat-number');
            if (!num) return;

            num.style.transition = 'transform 0.38s cubic-bezier(0.22,1,0.36,1), filter 0.38s ease';
            num.style.display    = 'inline-block'; /* transform needs block/inline-block */

            item.addEventListener('mouseenter', function () {
                num.style.transform = 'scale(1.09)';
                num.style.filter    = 'drop-shadow(0 0 12px rgba(34,211,238,0.44))';
            });
            item.addEventListener('mouseleave', function () {
                num.style.transform = '';
                num.style.filter    = '';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       14. SMOOTH ANCHOR SCROLL
       Intercepts hash anchor clicks for smooth animated scrolling
       and updates URL without page jump.
    ═══════════════════════════════════════════════════════════════ */
    function initAnchorScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var hash   = a.getAttribute('href');
                if (hash.length <= 1) return; /* Bare # */
                var target;
                try { target = document.querySelector(hash); } catch (ex) { return; }
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({
                    behavior: reduced ? 'auto' : 'smooth',
                    block:    'start'
                });
                history.pushState(null, '', hash);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       15. FOOTER LINK HOVER ENHANCEMENT
       Footer links: add direction-aware underline reveal.
    ═══════════════════════════════════════════════════════════════ */
    function initFooterLinks() {
        document.querySelectorAll('.footer-link').forEach(function (a) {
            a.addEventListener('mouseenter', function () {
                a.style.paddingBottom = '2px';
            });
            a.addEventListener('mouseleave', function () {
                a.style.paddingBottom = '';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       16. SCROLL-REVEAL DEPTH LAYERS
       Sections that scroll in receive a subtle upward drift
       beyond what AOS provides — adds perceived 3D depth.
    ═══════════════════════════════════════════════════════════════ */
    function initScrollDepth() {
        if (reduced || lowPerf || !('IntersectionObserver' in window)) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity    = '1';
                    el.style.transform  = 'translateY(0) scale(1)';
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

        /* Observe stat items and quick-link cards for depth reveal.
           Skip elements already managed by AOS to avoid double-animation. */
        document.querySelectorAll('.stat-item, .quick-link, .c-card').forEach(function (el) {
            if (el.hasAttribute('data-aos') || el.closest('[data-aos]')) return;
            if (!el.style.opacity) {
                el.style.opacity   = '0';
                el.style.transform = 'translateY(16px) scale(0.98)';
            }
            obs.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       17. HERO BUTTON ATTENTION PULSE
       After 5 seconds without scroll or interaction, the primary
       CTA pulses once to recapture attention.
    ═══════════════════════════════════════════════════════════════ */
    function initAttentionPulse() {
        if (reduced || lowPerf) return;
        var cta     = document.querySelector('.galaxy-btn, .btn-luma');
        if (!cta)   return;
        var fired   = false;
        var timer;

        function pulse() {
            if (fired || window.scrollY > 200) return;
            fired = true;
            cta.classList.add('ea-attention');
            setTimeout(function () { cta.classList.remove('ea-attention'); }, 1000);
        }

        timer = setTimeout(pulse, 6000);

        /* Cancel if user engages early */
        function cancel() {
            fired = true;
            clearTimeout(timer);
            window.removeEventListener('scroll', cancel);
            document.removeEventListener('click', cancel);
        }
        window.addEventListener('scroll', cancel, { once: true, passive: true });
        document.addEventListener('click', cancel, { once: true });
    }

    /* ═══════════════════════════════════════════════════════════════
       18. LOADING STATE FEEDBACK
       Adds a loading class to submit buttons on form submit,
       preventing double-submit and giving visual feedback.
    ═══════════════════════════════════════════════════════════════ */
    function initLoadingStates() {
        document.querySelectorAll('form').forEach(function (form) {
            form.addEventListener('submit', function () {
                var btn = form.querySelector('[type="submit"], button:not([type="button"])');
                if (!btn) return;
                if (btn.dataset.loadingHandled) return;
                btn.dataset.loadingHandled = '1';

                var orig = btn.innerHTML;
                btn.disabled  = true;
                btn.innerHTML = '<i class="ti ti-loader-2 ea-spin" aria-hidden="true"></i> ' +
                                (btn.getAttribute('data-loading-text') || 'Processing...');
                btn.style.opacity = '0.75';
                btn.style.cursor  = 'not-allowed';

                /* Restore after 8s as safety net */
                setTimeout(function () {
                    btn.disabled     = false;
                    btn.innerHTML    = orig;
                    btn.style.opacity = '';
                    btn.style.cursor  = '';
                }, 8000);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       INIT SEQUENCE
       Core features init on DOMContentLoaded.
       Cursor + visual extras wait for extoReady (post-loader).
    ═══════════════════════════════════════════════════════════════ */
    function initCore() {
        initBackToTop();
        initRipple();
        initNavActive();
        initFormPremium();
        initKeyboardShortcuts();
        initDigitalHaptics();
        initAnchorScroll();
        initLoadingStates();
        initFooterLinks();
    }

    function initVisual() {
        initScrollProgress();
        initExtendedMagnetic();
        initCopyToClipboard();
        initPreviewParallax();
        initTiltCardDepth();
        initStatHover();
        initScrollDepth();
        initAttentionPulse();
    }

    /* Core — fire on DOM ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCore);
    } else {
        initCore();
    }

    /* Visual — fires on extoReady (dispatched immediately on DOMContentLoaded) */
    document.addEventListener('extoReady', function () {
        if (document.body.classList.contains('ea-ux-visual-done')) return;
        document.body.classList.add('ea-ux-visual-done');
        initVisual();
        setTimeout(function () {
            initExtendedMagnetic();
            initPreviewParallax();
        }, 500);
    }, { once: true });

})();
