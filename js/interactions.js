/**
 * ExtoArts — Premium Interaction System
 * Magnetic CTA, press states, card content reveal, icon motion.
 * GPU-friendly: only transforms + opacity.
 */

(function () {
    'use strict';

    /* ── 1. MAGNETIC CTA ────────────────────────────────────────────
       Only applies to .btn-luma (primary CTA). Max 8px pull.
       Disabled on touch devices and low-perf mode.
    ──────────────────────────────────────────────────────────────── */
    function initMagnetic() {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        if (document.documentElement.getAttribute('data-perf') === 'low') return;

        document.querySelectorAll('.btn-luma').forEach(function (btn) {
            var isActive = false;

            btn.addEventListener('mouseenter', function () { isActive = true; });

            btn.addEventListener('mousemove', function (e) {
                if (!isActive) return;
                var rect   = btn.getBoundingClientRect();
                var cx     = rect.left + rect.width  / 2;
                var cy     = rect.top  + rect.height / 2;
                var dx     = e.clientX - cx;
                var dy     = e.clientY - cy;
                var dist   = Math.sqrt(dx * dx + dy * dy);
                var radius = Math.max(rect.width, rect.height) * 0.85;
                var pull   = Math.max(0, 1 - dist / radius);
                var mx     = dx * pull * 0.28;
                var my     = dy * pull * 0.28;
                mx = Math.max(-8, Math.min(8, mx));
                my = Math.max(-8, Math.min(8, my));
                btn.style.transform = 'translateX(' + mx + 'px) translateY(' + (my - 2) + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                isActive = false;
                btn.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
                btn.style.transform  = '';
                setTimeout(function () { btn.style.transition = ''; }, 460);
            });
        });
    }

    /* ── 2. PRESS STATE (spring return) ─────────────────────────────
       Adds physical press feedback to all .btn elements.
    ──────────────────────────────────────────────────────────────── */
    function initPressStates() {
        document.querySelectorAll('.btn, .btn-luma, .btn-luma-white').forEach(function (btn) {
            btn.addEventListener('mousedown', function () {
                btn.style.transition = 'transform 0.08s ease';
                btn.style.transform  = (btn.style.transform || '') + ' scale(0.96)';
            });

            function release() {
                btn.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
                btn.style.transform  = '';
                setTimeout(function () { btn.style.transition = ''; btn.style.transform = ''; }, 400);
            }

            btn.addEventListener('mouseup',    release);
            btn.addEventListener('mouseleave', release);
        });
    }

    /* ── 3. BUTTON ICON MOTION ───────────────────────────────────────
       Arrow icons inside buttons slide right on hover.
       Discord icon tilts on hover.
    ──────────────────────────────────────────────────────────────── */
    function initButtonIconMotion() {
        document.querySelectorAll('.btn, .btn-luma, .btn-luma-white, .galaxy-btn, .gb-inner').forEach(function (btn) {
            /* Tabler Icons used site-wide — match ti- prefixed classes */
            var arrow   = btn.querySelector(
                'i.ti-arrow-right, i.ti-arrow-narrow-right, i.ti-chevron-right, ' +
                'i.fa-arrow-right, i.fa-long-arrow-alt-right, i.fa-chevron-right'
            );
            var discord = btn.querySelector('i.ti-brand-discord, i.fa-discord');
            var rocket  = btn.querySelector('i.ti-rocket');
            var ext     = btn.querySelector(
                'i.ti-external-link, i.ti-arrow-up-right, ' +
                'i.fa-external-link-alt, i.fa-arrow-up-right-from-square'
            );

            if (arrow) {
                btn.addEventListener('mouseenter', function () {
                    arrow.style.transition = 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)';
                    arrow.style.transform  = 'translateX(5px)';
                });
                btn.addEventListener('mouseleave', function () {
                    arrow.style.transform = '';
                });
            }

            if (discord) {
                btn.addEventListener('mouseenter', function () {
                    discord.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                    discord.style.transform  = 'rotate(8deg) scale(1.12)';
                });
                btn.addEventListener('mouseleave', function () {
                    discord.style.transform = '';
                });
            }

            if (rocket) {
                btn.addEventListener('mouseenter', function () {
                    rocket.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                    rocket.style.transform  = 'translateY(-3px) rotate(-8deg) scale(1.18)';
                });
                btn.addEventListener('mouseleave', function () {
                    rocket.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
                    rocket.style.transform  = '';
                });
            }

            if (ext) {
                btn.addEventListener('mouseenter', function () {
                    ext.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
                    ext.style.transform  = 'translate(3px, -3px)';
                });
                btn.addEventListener('mouseleave', function () {
                    ext.style.transform = '';
                });
            }
        });
    }

    /* ── 4. CARD CONTENT REVEAL ──────────────────────────────────────
       Service cards reveal a "Learn more" indicator on hover.
       Only injected if card has no existing reveal element.
    ──────────────────────────────────────────────────────────────── */
    function initCardReveal() {
        document.querySelectorAll('.service-card').forEach(function (card) {
            if (card.querySelector('.card-reveal-hint')) return;
            var hint = document.createElement('div');
            hint.className    = 'card-reveal-hint';
            hint.innerHTML    = '<span>Explore</span><i class="ti ti-arrow-right" aria-hidden="true"></i>';
            hint.style.cssText = [
                'display:flex', 'align-items:center', 'gap:6px',
                'font-size:0.72rem', 'font-weight:700', 'text-transform:uppercase',
                'letter-spacing:1.5px', 'color:var(--primary)',
                'opacity:0', 'transform:translateY(6px)',
                'transition:opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                'margin-top:14px', 'pointer-events:none'
            ].join(';');
            card.appendChild(hint);

            card.addEventListener('mouseenter', function () {
                hint.style.opacity   = '1';
                hint.style.transform = 'translateY(0)';
                var arr = hint.querySelector('i');
                if (arr) arr.style.transform = 'translateX(4px)';
            });
            card.addEventListener('mouseleave', function () {
                hint.style.opacity   = '0';
                hint.style.transform = 'translateY(6px)';
                var arr = hint.querySelector('i');
                if (arr) arr.style.transform = '';
            });
        });
    }

    /* ── 5. FOOTER SOCIAL — LIFT + SCALE, NO GLOW ───────────────────
       Replaces any residual color-glow on footer social circles.
    ──────────────────────────────────────────────────────────────── */
    function initSocialLift() {
        document.querySelectorAll('.footer-social').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                el.style.transition = 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, background 0.22s ease';
                el.style.transform  = 'translateY(-4px) scale(1.12)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ── 6. FAQ SMOOTH ACCORDION ─────────────────────────────────────
       Converts static FAQ items into smooth height-animated accordions.
       Works on both faq.php (static) and any page with .faq-item .faq-q.
    ──────────────────────────────────────────────────────────────── */
    function initFaqAccordion() {
        var items = document.querySelectorAll('.faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            var q = item.querySelector('.faq-q');
            var a = item.querySelector('.faq-a');
            if (!q || !a) return;

            /* Use existing Tabler chevron (.faq-chevron) if present,
               otherwise inject one (about.php / legacy pages). */
            var chev = item.querySelector('.faq-chevron');
            if (!chev) {
                chev = document.createElement('i');
                chev.className = 'ti ti-chevron-down faq-chevron';
                chev.setAttribute('aria-hidden', 'true');
                q.appendChild(chev);
            }

            /* If the chevron was already in the HTML (faq.php CSS-driven style),
               use pure CSS class toggling on the item — no JS wrapping needed. */
            var hadStaticChevron = !!item.querySelector('.faq-chevron');
            var isOpen = false;

            if (hadStaticChevron) {
                function openCss() {
                    isOpen = true;
                    item.classList.add('active');
                    item.setAttribute('aria-expanded', 'true');
                }
                function closeCss() {
                    isOpen = false;
                    item.classList.remove('active');
                    item.setAttribute('aria-expanded', 'false');
                }
                item.addEventListener('click', function () {
                    if (isOpen) { closeCss(); } else { openCss(); }
                });
                item.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isOpen) { closeCss(); } else { openCss(); }
                    }
                });
                return;
            }

            /* Legacy JS-driven accordion (about.php and other pages) */
            q.style.cssText += ';cursor:pointer;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:0;';

            /* Grid trick: animates grid-template-rows 0fr→1fr.
               Avoids max-height animation (layout thrash) and the
               "snapping" artefact from a large max-height value.     */
            var wrap = document.createElement('div');
            wrap.style.cssText = 'display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.38s cubic-bezier(0.22,1,0.36,1);';
            var inner = document.createElement('div');
            inner.style.cssText = 'min-height:0;overflow:hidden;';
            a.style.cssText += ';padding-top:14px;';
            a.parentNode.insertBefore(wrap, a);
            inner.appendChild(a);
            wrap.appendChild(inner);

            a.style.opacity    = '0';
            a.style.transition = 'opacity 0.26s cubic-bezier(0.0, 0, 0.2, 1)';

            function open() {
                isOpen = true;
                wrap.style.gridTemplateRows = '1fr';
                chev.style.transition = 'transform 0.32s cubic-bezier(0.22,1,0.36,1), color 0.2s ease';
                chev.style.transform  = 'rotate(180deg)';
                chev.style.color      = 'var(--primary)';
                setTimeout(function () { a.style.opacity = '1'; }, 40);
                item.classList.add('active');
                item.setAttribute('aria-expanded', 'true');
            }

            function close() {
                isOpen = false;
                a.style.opacity         = '0';
                chev.style.transform    = 'rotate(0deg)';
                chev.style.color        = '';
                setTimeout(function () { wrap.style.gridTemplateRows = '0fr'; }, 40);
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            }

            if (item === items[0]) { setTimeout(open, 120); }

            q.addEventListener('click', function () {
                if (isOpen) { close(); } else { open(); }
            });

            q.setAttribute('tabindex', '0');
            q.setAttribute('role', 'button');
            q.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isOpen) { close(); } else { open(); }
                }
            });
        });
    }

    /* ── 7. STAT COUNT-UP (viewport-triggered, once) ─────────────────
       Runs on any element with [data-count] attribute.
       Format: data-count="90" data-suffix="%" data-prefix=""
    ──────────────────────────────────────────────────────────────── */
    function initStatCountUp() {
        var els = document.querySelectorAll('[data-count]');
        if (!els.length) return;
        if (!('IntersectionObserver' in window)) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el      = entry.target;
                var target  = parseFloat(el.getAttribute('data-count'));
                var suffix  = el.getAttribute('data-suffix') || '';
                var prefix  = el.getAttribute('data-prefix') || '';
                var dur     = 1600;
                var start   = performance.now();
                obs.unobserve(el);

                function tick(now) {
                    var p  = Math.min((now - start) / dur, 1);
                    var ep = 1 - Math.pow(1 - p, 3);
                    var v  = ep * target;
                    el.textContent = prefix + (Number.isInteger(target) ? Math.round(v) : v.toFixed(1)) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = prefix + target + suffix;
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });

        els.forEach(function (el) { obs.observe(el); });
    }

    /* ── 8. CARD CONTENT LIFT — inner text moves up 2px on hover ────
       Subtle z-depth feel: content shifts slightly upward on hover.
    ──────────────────────────────────────────────────────────────── */
    function initCardContentLift() {
        document.querySelectorAll('.service-card, .price-card, .c-card').forEach(function (card) {
            var inner = card.querySelector('.sc-body, .card-body, .pc-body, .c-body, h3, .card-title');
            if (!inner) return;
            inner.style.transition = 'transform 0.32s cubic-bezier(0.22,1,0.36,1)';
            card.addEventListener('mouseenter', function () {
                inner.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', function () {
                inner.style.transform = '';
            });
        });
    }

    /* ── 9. PORTFOLIO THUMBNAIL ZOOM ─────────────────────────────────
       Subtle scale on portfolio item images.
    ──────────────────────────────────────────────────────────────── */
    function initPortfolioZoom() {
        document.querySelectorAll('.portfolio-item img, .port-thumb img').forEach(function (img) {
            img.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
            var card = img.closest('.portfolio-item, .port-thumb');
            if (!card) return;
            card.addEventListener('mouseenter', function () { img.style.transform = 'scale(1.04)'; });
            card.addEventListener('mouseleave', function () { img.style.transform = ''; });
        });
    }

    /* ── INIT ────────────────────────────────────────────────────────
       Everything deferred until after page content is ready.
    ──────────────────────────────────────────────────────────────── */
    function init() {
        initMagnetic();
        initPressStates();
        initButtonIconMotion();
        initCardReveal();
        initSocialLift();
        initFaqAccordion();
        initStatCountUp();
        initCardContentLift();
        initPortfolioZoom();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Re-run on extoReady (after loader) for elements injected post-DOM */
    document.addEventListener('extoReady', function () {
        initMagnetic();
        initPortfolioZoom();
    }, { once: true });

})();
