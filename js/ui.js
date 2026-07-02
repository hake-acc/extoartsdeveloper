/**
 * ExtoArts - UI Interactions
 * Theme toggle, mobile nav, custom cursor, modal helpers.
 * Extracted from header.php inline script.
 */

function toggleTheme() {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTimeout(() => html.classList.remove('theme-transitioning'), 500);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.style.transform = 'rotate(180deg) scale(0.5)';
        icon.style.opacity = '0';
        setTimeout(() => {
            icon.className = isLight ? 'ti ti-moon' : 'ti ti-sun';
            icon.style.transform = 'rotate(0deg) scale(1)';
            icon.style.opacity = '1';
        }, 200);
    }
    /* Re-theme any TrustBox widgets on the page */
    document.querySelectorAll('.trustpilot-widget').forEach(function (el) {
        el.dataset.theme = nextTheme;
        if (window.Trustpilot) { window.Trustpilot.loadFromElement(el, true); }
    });
}

function setHamburgerIcon(open) {
    const icon = document.getElementById('hamburgerIcon');
    if (!icon) return;
    icon.style.transform = 'rotate(90deg) scale(0.5)';
    icon.style.opacity = '0';
    setTimeout(() => {
        icon.className = open ? 'ti ti-x' : 'ti ti-menu-2';
        icon.style.transform = 'rotate(0deg) scale(1)';
        icon.style.opacity = '1';
    }, 150);
}

function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav.classList.contains('active') || nav.classList.contains('is-closing')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

function openMobileNav() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburgerBtn');
    nav.classList.remove('is-closing');
    nav.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (btn) btn.setAttribute('aria-expanded', 'true');
    setHamburgerIcon(true);
}

function closeMobileNav() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburgerBtn');
    nav.classList.add('is-closing');
    document.body.style.overflow = '';
    if (btn) btn.setAttribute('aria-expanded', 'false');
    setHamburgerIcon(false);
    setTimeout(() => {
        nav.classList.remove('active');
        nav.classList.remove('is-closing');
    }, 380);
}
function openModal(id) { const m = document.getElementById(id); if(m){ m.style.display='flex'; setTimeout(()=>m.classList.add('show'),10); } }
function closeModal(id) { const m = document.getElementById(id); if(m){ m.classList.remove('show'); setTimeout(()=>m.style.display='none',300); } }

/* scroll-reveal initialised in footer.php after DOM is ready */


