/* ═══════════════════════════════════════════════════════════════
   Arcera — Auth state + nav swap + user dropdown
   • Checks Supabase session on load
   • Signed in  → Dashboard link + avatar button (opens dropdown)
   • Not signed in → Sign In redirects to app.arcera.io
   Requires Supabase CDN loaded before this script.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const SUPABASE_URL      = 'https://ttfwgtdivflnjjvwzsdo.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_W-U3SfFQyJppD_KlbzU7Bg_ivSFGqBc';
  const APP_URL           = 'https://app.arcera.io';

  const { createClient } = window.supabase;

  /* ── Cookie storage — shares session across arcera.io ↔ app.arcera.io ──
     localStorage is scoped per origin, so a session created on app.arcera.io
     is invisible here. Cookies with domain=.arcera.io are readable by all
     subdomains, solving the cross-subdomain auth problem.
     app.arcera.io must use the same cookieStorage config for full sync.     ── */
  const _host   = window.location.hostname;
  const _domain = _host.endsWith('arcera.io') ? '.arcera.io' : _host;
  const _secure = window.location.protocol === 'https:';
  const _maxAge = 60 * 60 * 24 * 365; // 1 year

  const cookieStorage = {
    getItem(key) {
      const prefix = key + '=';
      for (const c of document.cookie.split('; ')) {
        if (c.startsWith(prefix)) return decodeURIComponent(c.slice(prefix.length));
      }
      return null;
    },
    setItem(key, value) {
      let c = `${key}=${encodeURIComponent(value)}; path=/; max-age=${_maxAge}; SameSite=Lax`;
      if (_domain) c += `; domain=${_domain}`;
      if (_secure) c += '; Secure';
      document.cookie = c;
    },
    removeItem(key) {
      let c = `${key}=; path=/; max-age=0; SameSite=Lax`;
      if (_domain) c += `; domain=${_domain}`;
      document.cookie = c;
    },
  };

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage:          cookieStorage,
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true,
    },
  });

  let dropdown    = null;
  let currentLang = 'fn'; // default per wireframe

  /* ── Icons (thin line SVGs) ── */
  const ICONS = {
    settings: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="1.8" stroke="currentColor" stroke-width="1"/>
      <path d="M6.5 1.5v1M6.5 10.5v1M1.5 6.5h1M10.5 6.5h1M2.9 2.9l.7.7M9.4 9.4l.7.7M9.4 3.6l-.7.7M3.6 9.4l-.7.7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    items: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 3.5h9M2 6.5h9M2 9.5h5.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    browser: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="11" height="9" rx="1.2" stroke="currentColor" stroke-width="1"/>
      <path d="M1 5h11" stroke="currentColor" stroke-width="1"/>
      <circle cx="3.2" cy="3.5" r=".55" fill="currentColor"/>
      <circle cx="5.2" cy="3.5" r=".55" fill="currentColor"/>
    </svg>`,
    resource: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 1.5h5l3 3v7h-8v-10z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <path d="M7.5 1.5v3h3" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <path d="M4.5 6.5h4M4.5 8.5h2.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    support: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M11 7.5c0 2-2 3.5-4.5 3.5S2 9.5 2 7.5 4 2 6.5 2 11 5.5 11 7.5z" stroke="currentColor" stroke-width="1"/>
      <path d="M4.5 11l-.5 1.5h5L8.5 11" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
    </svg>`,
    logout: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M5 2H2.5a1 1 0 00-1 1v7a1 1 0 001 1H5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
      <path d="M8.5 9.5l3-3-3-3M11.5 6.5H5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };

  /* ── Build & inject dropdown ── */
  function buildDropdown(user) {
    const old = document.getElementById('user-dropdown');
    if (old) old.remove();

    const email   = user.email || '';
    const initial = (email || 'U')[0].toUpperCase();

    dropdown = document.createElement('div');
    dropdown.id        = 'user-dropdown';
    dropdown.className = 'user-dropdown';
    dropdown.setAttribute('role', 'menu');

    const langRows = [
      { code: 'en', label: 'Eng'  },
      { code: 'fn', label: 'Fr.'  },
      { code: 'es', label: 'Esp'  },
    ].map(l => `
      <button class="ud-lang-item${currentLang === l.code ? ' active' : ''}" data-lang="${l.code}" role="menuitemradio" aria-checked="${currentLang === l.code}">
        <span class="ud-lang-dot">${currentLang === l.code ? '●' : ''}</span>${l.label}
      </button>`).join('');

    dropdown.innerHTML = `
      <!-- Section 1: user + account -->
      <div class="ud-section">
        <div class="ud-user-row">
          <span class="ud-avatar-sm" aria-hidden="true">${initial}</span>
          <span class="ud-email">${email}</span>
        </div>
        <a href="${APP_URL}/settings" class="ud-item" role="menuitem">${ICONS.settings}Account Settings</a>
        <a href="${APP_URL}/items"    class="ud-item" role="menuitem">${ICONS.items}Items</a>
      </div>

      <!-- Section 2: navigation -->
      <div class="ud-section ud-section--divided">
        <a href="${APP_URL}"           class="ud-item" role="menuitem">${ICONS.browser}app.arcera.io</a>
        <a href="${APP_URL}/resources" class="ud-item" role="menuitem">${ICONS.resource}Resource</a>
        <a href="${APP_URL}/support"   class="ud-item" role="menuitem">${ICONS.support}Support</a>
      </div>

      <!-- Section 3: language -->
      <div class="ud-section ud-section--divided">
        <p class="ud-lang-label">Language</p>
        <div class="ud-lang-list" role="group" aria-label="Select language">${langRows}</div>
      </div>

      <!-- Section 4: logout -->
      <div class="ud-section ud-section--divided">
        <button class="ud-item ud-logout" id="ud-logout-btn" role="menuitem">${ICONS.logout}Logout</button>
      </div>
    `;

    document.body.appendChild(dropdown);
    positionDropdown();

    /* Language selection */
    dropdown.querySelectorAll('.ud-lang-item').forEach(btn => {
      btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        buildDropdown(user); // rebuild in place with new selection
        requestAnimationFrame(() => dropdown.classList.add('open'));
      });
    });

    /* Logout */
    document.getElementById('ud-logout-btn').addEventListener('click', async () => {
      closeDropdown();
      await sb.auth.signOut();
    });
  }

  /* ── Position dropdown fixed below avatar button ── */
  function positionDropdown() {
    if (!dropdown) return;
    const btn = document.getElementById('nav-avatar-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    dropdown.style.top   = (rect.bottom + 8) + 'px';
    dropdown.style.right = (window.innerWidth - rect.right) + 'px';
  }

  function openDropdown(user) {
    buildDropdown(user);
    requestAnimationFrame(() => dropdown.classList.add('open'));
  }

  function closeDropdown() {
    if (!dropdown) return;
    dropdown.classList.remove('open');
    setTimeout(() => { if (dropdown) { dropdown.remove(); dropdown = null; } }, 200);
  }

  /* ── Close on outside click ── */
  document.addEventListener('click', e => {
    if (dropdown && !dropdown.contains(e.target)) closeDropdown();
  });

  /* ── Reposition on resize ── */
  window.addEventListener('resize', positionDropdown);

  /* ── Swap nav elements based on auth state ── */
  function updateTriggerUI(user) {
    const trigger  = document.getElementById('auth-trigger');
    const cta      = document.querySelector('nav .nav-cta');
    const navLinks = document.querySelector('.nav-links');

    const existing = document.getElementById('nav-auth-group');
    if (existing) existing.remove();
    closeDropdown();

    /* ── Drawer auth section ── */
    const drawerAuth = document.getElementById('drawer-auth');

    if (user) {
      if (trigger) trigger.style.display = 'none';
      if (cta)     cta.style.display     = 'none';

      const initial = (user.email || 'U')[0].toUpperCase();
      const group   = document.createElement('div');
      group.id        = 'nav-auth-group';
      group.className = 'nav-auth-group';
      group.innerHTML = `
        <a href="${APP_URL}" class="nav-dashboard">Dashboard</a>
        <button id="nav-avatar-btn" class="nav-user-btn" aria-label="Account menu" aria-haspopup="true" aria-expanded="false">
          <span class="nav-user-avatar">${initial}</span>
        </button>
      `;
      if (navLinks) navLinks.appendChild(group);

      document.getElementById('nav-avatar-btn').addEventListener('click', e => {
        e.stopPropagation();
        const avatarBtn = document.getElementById('nav-avatar-btn');
        if (dropdown) {
          closeDropdown();
          if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'false');
        } else {
          openDropdown(user);
          if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'true');
        }
      });

      /* Drawer: signed in → Dashboard + Log Out */
      if (drawerAuth) {
        drawerAuth.innerHTML = `
          <a href="${APP_URL}" class="drawer-auth-btn drawer-auth-btn--dashboard">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="5" height="5" rx=".8" stroke="currentColor" stroke-width="1.1"/>
              <rect x="8" y="1" width="5" height="5" rx=".8" stroke="currentColor" stroke-width="1.1"/>
              <rect x="1" y="8" width="5" height="5" rx=".8" stroke="currentColor" stroke-width="1.1"/>
              <rect x="8" y="8" width="5" height="5" rx=".8" stroke="currentColor" stroke-width="1.1"/>
            </svg>
            Dashboard
          </a>
          <button class="drawer-auth-btn drawer-auth-btn--logout" id="drawer-logout-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5.5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
              <path d="M9.5 10l3-3-3-3M12.5 7H5.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Log Out
          </button>
        `;
        document.getElementById('drawer-logout-btn').addEventListener('click', async () => {
          window.closeDrawer && window.closeDrawer();
          await sb.auth.signOut();
        });
      }

    } else {
      if (trigger) trigger.style.display = '';
      if (cta)     cta.style.display     = '';

      /* Drawer: signed out → Sign In */
      if (drawerAuth) {
        drawerAuth.innerHTML = `
          <button class="drawer-auth-btn" id="drawer-signin-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.1"/>
              <path d="M1.5 12.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
            </svg>
            Sign In
          </button>
        `;
        document.getElementById('drawer-signin-btn').addEventListener('click', () => {
          window.location.href = APP_URL;
        });
      }
    }
  }

  /* ── Auth state listener (handles session refresh + sign-out after load) ── */
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') updateTriggerUI(null);
  });

  /* ── On load: always start from signed-out state, then verify with Supabase ── */
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Default nav = not signed in (Sign In button visible, CTA visible)
    updateTriggerUI(null);

    // 2. Wire Sign In button → redirect to app login
    const trigger = document.getElementById('auth-trigger');
    if (trigger) trigger.addEventListener('click', () => { window.location.href = APP_URL; });

    // 3. Check real session — swap nav only if Supabase confirms a valid session
    const { data: { session } } = await sb.auth.getSession();
    if (session) updateTriggerUI(session.user);
  });
})();
