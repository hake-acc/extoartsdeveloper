/**
 * ExtoArts - Animations & Scroll Systems
 * Scroll reveal, AOS, count-up, shimmer, entrance animations, video reel.
 * extoReady fires immediately on DOMContentLoaded — no loader delay.
 */

/* ---- Dispatch extoReady immediately on DOMContentLoaded ---- */
document.addEventListener('DOMContentLoaded', function () {
    document.dispatchEvent(new CustomEvent('extoReady'));
});

document.addEventListener('DOMContentLoaded', () => {
    const SELECTOR = [
        'section:not(.no-reveal)',
        '.service-card',
        '.portfolio-item',
        '.blog-card',
        '.pricing-card',
        '.workflow-step',
        '.stat-card',
        '.team-card',
        '.faq-item',
        '.case-study-card',
        '.tool-card',
        '.testimonial-card',
        '[data-reveal]'
    ].join(', ');

    const targets = document.querySelectorAll(SELECTOR);
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                const siblings = el.parentElement
                    ? Array.from(el.parentElement.children).filter(c => c.classList.contains('scroll-reveal'))
                    : [];
                const sibIdx = siblings.indexOf(el);
                const stagger = sibIdx > 0 ? sibIdx * 40 : 0;
                el.style.transitionDelay = stagger + 'ms';
                el.classList.remove('sr-exit');
                el.classList.add('sr-visible');
                io.unobserve(el); /* one-time reveal — never re-blur on scroll-back */
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -2% 0px' });

    // Accepts a pre-computed rect — no getBoundingClientRect call inside
    const CARD_SEL = '.service-card,.blog-card,.portfolio-item,.pricing-card,.testimonial-card,.case-study-card,.tool-card,.stat-card,.workflow-step,.team-card,.faq-item';
    function assignDirectionFromRect(el, idx, rect) {
        if (el.tagName.toLowerCase() === 'section') return;

        const elCenterX = rect.left + rect.width / 2;

        if (el.matches(CARD_SEL)) {
            const allCards = el.parentElement
                ? Array.from(el.parentElement.children).filter(c => c.matches(CARD_SEL))
                : [];
            const cardIdx = allCards.indexOf(el);
            if      (cardIdx % 3 === 0) el.classList.add('sr-left');
            else if (cardIdx % 3 === 1) el.classList.add('sr-right');
            else                         el.classList.add('sr-zoom');
            return;
        }

        if      (elCenterX < vw * 0.38) el.classList.add('sr-left');
        else if (elCenterX > vw * 0.62) el.classList.add('sr-right');
        else if (idx % 2 === 0)          el.classList.add('sr-zoom');
    }

    // ── Phase 1: batch ALL layout reads before any writes ──────────────────
    // Reading getBoundingClientRect after classList.add() forces a sync reflow.
    // Collecting every rect first lets the browser satisfy all reads from a
    // single layout pass; subsequent writes never invalidate it mid-loop.
    const targetRects = Array.from(targets, el => el.getBoundingClientRect());

    // ── Phase 2: writes only — no further layout reads in this pass ─────────
    targets.forEach((el, idx) => {
        const rect = targetRects[idx];
        if (rect.top < vh && rect.bottom > 0) return; // already in viewport
        assignDirectionFromRect(el, idx, rect);
        el.classList.add('scroll-reveal');
        io.observe(el);
    });
});

/* ---- GLOBAL COUNT-UP FOR .stat-number ---- */
(function() {
    function initCountUp() {
        const statEls = document.querySelectorAll('.stat-number');
        if (!statEls.length) return;
        const run = (el) => {
            if (el.dataset.counted) return;
            el.dataset.counted = '1';
            const raw = el.textContent.trim();
            const m = raw.match(/[\d.]+/);
            if (!m) return;
            const numStr = m[0];
            const target  = parseFloat(numStr);
            const isFloat = numStr.includes('.');
            const suffix  = raw.slice(raw.indexOf(numStr) + numStr.length);
            const prefix  = raw.slice(0, raw.indexOf(numStr));
            const dur = 2000;
            let t0 = null;
            el.classList.add('counting');
            const step = (ts) => {
                if (!t0) t0 = ts;
                const pct   = Math.min((ts - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - pct, 3);
                el.textContent = prefix + (isFloat ? (eased * target).toFixed(1) : Math.round(eased * target)) + suffix;
                if (pct < 1) { requestAnimationFrame(step); }
                else { el.textContent = raw; el.classList.remove('counting'); el.classList.add('done'); }
            };
            requestAnimationFrame(step);
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
        }, { threshold: 0.35, rootMargin: '0px 0px -5% 0px' });
        statEls.forEach(el => io.observe(el));
    }
    document.addEventListener('extoReady', initCountUp, { once: true });
})();

/* ---- GLOBAL CARD SHIMMER ON SCROLL-IN ---- */
(function() {
    function initShimmer() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const SEL = [
            '.service-card', '.price-card', '.story-card', '.process-card',
            '.info-card', '.c-card', '.blog-card', '.tilt-card',
            '.founder-card-inline', '.seo-card'
        ].join(', ');
        const cards = document.querySelectorAll(SEL);
        if (!cards.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    io.unobserve(e.target);
                    e.target.classList.add('shimmer-active');
                    setTimeout(() => e.target.classList.remove('shimmer-active'), 2000);
                }
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
        cards.forEach(c => io.observe(c));
    }
    document.addEventListener('extoReady', initShimmer, { once: true });
})();

/* ---- HERO + STAT ENTRANCE ANIMATIONS ---- */
(function() {
    function initEntrances() {
        const words = document.querySelectorAll('.ea-word');
        words.forEach(function(w, i) {
            w.style.animationDelay = (i * 70) + 'ms';
            w.classList.add('ea-word-in');
        });

        var lineAcc = document.querySelector('.ea-line-enter');
        if (lineAcc) {
            setTimeout(function() {
                lineAcc.classList.add('ea-in');
            }, words.length * 70 + 60);
        }

        var stats = document.querySelectorAll('.stat-item');
        stats.forEach(function(el, i) {
            el.style.animationDelay = (120 + i * 85) + 'ms';
            el.classList.add('ea-card-bounce');
        });
    }
    document.addEventListener('extoReady', initEntrances, { once: true });
})();

/* ---- AOS INIT ---- */
document.addEventListener('extoReady', function () {
    const aosOpts = { duration: 500, easing: 'ease-out-quart', once: true, mirror: false, offset: 30, delay: 0 };
    if (typeof AOS !== 'undefined') {
        AOS.init(aosOpts);
    } else {
        window.addEventListener('load', function () {
            if (typeof AOS !== 'undefined') AOS.init(aosOpts);
        }, { once: true });
    }
}, { once: true });

/* ---- VIDEO REEL ---- */
(function() {
    var cards = document.querySelectorAll('.reel-card');
    if (!cards.length) return;
    var active = null;
    function playCard(card) {
        if (active && active !== card) stopCard(active);
        var vid = card.querySelector('video');
        var src = card.dataset.src;
        if (!vid.src && src) vid.src = src;
        card.classList.add('playing');
        vid.play().catch(function(){});
        active = card;
    }
    function stopCard(card) {
        var vid = card.querySelector('video');
        vid.pause();
        card.classList.remove('playing');
        if (active === card) active = null;
    }
    cards.forEach(function(card) {
        var isMobile = window.matchMedia('(pointer:coarse)').matches;
        if (!isMobile) {
            card.addEventListener('mouseenter', function() { playCard(card); });
            card.addEventListener('mouseleave', function() { stopCard(card); });
        } else {
            card.addEventListener('click', function() {
                if (card.classList.contains('playing')) { stopCard(card); }
                else { playCard(card); }
            });
        }
    });
})();
