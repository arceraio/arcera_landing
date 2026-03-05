/* ═══════════════════════════════════════════════════════════════
   Arcera — Login modal
   Requires Supabase CDN loaded before this script.
   Exposes window.openLogin() — call it from any Sign In button.
   Auto-attaches to #auth-trigger if present on the page.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const SUPABASE_URL      = 'https://ttfwgtdivflnjjvwzsdo.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_W-U3SfFQyJppD_KlbzU7Bg_ivSFGqBc';
  const APP_URL           = 'https://arceraio.netlify.app';

  const { createClient } = window.supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { redirectTo: APP_URL }
  });

  let isSignUp = false;
  let overlay  = null;

  /* ── Inject modal HTML ── */
  function buildModal() {
    overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.className = 'login-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Sign in to Arcera');
    document.body.appendChild(overlay);
    render();

    // Close on backdrop click
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeLogin();
    });
  }

  /* ── Render form into modal ── */
  function render() {
    overlay.innerHTML = `
      <div class="login-modal">
        <button class="login-modal-close" id="loginClose" aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="login-wordmark">Arcera</div>

        <div class="login-card">
          <h2 class="login-heading">${isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <div class="login-rule"></div>

          <form id="loginForm" novalidate>
            <div class="login-field">
              <label for="loginEmail">Email Address</label>
              <div class="login-input-wrap">
                <input type="email" id="loginEmail" name="email"
                  autocomplete="email" placeholder="you@example.com" />
              </div>
            </div>

            <div class="login-field">
              <label for="loginPassword">Password</label>
              <div class="login-input-wrap">
                <input type="password" id="loginPassword" name="password"
                  autocomplete="${isSignUp ? 'new-password' : 'current-password'}"
                  placeholder="••••••••••••" />
                <button type="button" class="login-password-toggle" id="loginPasswordToggle">show</button>
              </div>
            </div>

            ${!isSignUp ? `
            <div class="login-remember-row">
              <label class="login-checkbox-wrap" for="loginRemember">
                <input type="checkbox" id="loginRemember" name="remember" />
                <span class="login-checkbox-box">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3L3.5 5.5L8 1" stroke="#0D1B2A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </label>
              <label class="login-remember-label" for="loginRemember">Remember me for 30 days</label>
            </div>
            ` : ''}

            <div id="loginMsg" class="login-msg"></div>

            <button type="submit" class="login-btn-primary" id="loginSubmitBtn">
              <span>${isSignUp ? 'Create Account' : 'Sign In'}</span>
            </button>

            <div class="login-links-row">
              ${!isSignUp
                ? `<button type="button" class="login-link" id="loginForgotBtn">Forgot password?</button>`
                : `<span></span>`}
              <button type="button" class="login-link" id="loginToggleBtn">
                ${isSignUp ? 'Sign in instead' : 'Create account'}
              </button>
            </div>

            <div class="login-divider">
              <span class="login-divider-line"></span>
              <span class="login-divider-text">Or continue with</span>
              <span class="login-divider-line"></span>
            </div>

            <div class="login-social-row">
              <button type="button" class="login-btn-social" id="loginGoogleBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.59c1.52-1.4 2.39-3.46 2.39-5.87z" fill="#4285F4"/>
                  <path d="M8 16c2.16 0 3.97-.71 5.3-1.93l-2.59-2a4.8 4.8 0 01-2.71.75c-2.08 0-3.84-1.4-4.47-3.29H.86v2.07A8 8 0 008 16z" fill="#34A853"/>
                  <path d="M3.53 9.53A4.8 4.8 0 013.28 8c0-.53.09-1.05.25-1.53V4.4H.86A8 8 0 000 8c0 1.29.31 2.51.86 3.6l2.67-2.07z" fill="#FBBC05"/>
                  <path d="M8 3.18c1.17 0 2.22.4 3.05 1.19l2.28-2.28C11.96.8 10.15 0 8 0A8 8 0 00.86 4.4L3.53 6.47C4.16 4.58 5.92 3.18 8 3.18z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" class="login-btn-social" id="loginFacebookBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M16 8A8 8 0 100 8a8 8 0 0016 0z" fill="#1877F2"/>
                  <path d="M11.12 10.22l.37-2.4H9.18V6.27c0-.66.32-1.3 1.36-1.3h1.05V2.94s-.95-.16-1.86-.16c-1.9 0-3.14 1.15-3.14 3.23v1.81H4.49v2.4H6.6V16a8.1 8.1 0 002.58 0v-5.78h1.94z" fill="white"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>

        <p class="login-footer-note">
          <span class="login-footer-label">Serving</span>
          <span class="login-footer-locations">Los Angeles &bull; Brentwood &bull; Malibu &bull; Pacific Palisades &bull; Hancock Park &bull; Calabasas</span>
        </p>
      </div>
    `;

    bindEvents();
  }

  /* ── Bind all form events ── */
  function bindEvents() {
    document.getElementById('loginClose').addEventListener('click', closeLogin);

    // Password toggle
    document.getElementById('loginPasswordToggle').addEventListener('click', function () {
      const input = document.getElementById('loginPassword');
      input.type = input.type === 'password' ? 'text' : 'password';
      this.textContent = input.type === 'password' ? 'show' : 'hide';
    });

    // Mode toggle
    document.getElementById('loginToggleBtn').addEventListener('click', () => {
      isSignUp = !isSignUp;
      render();
      setTimeout(() => document.getElementById('loginEmail').focus(), 50);
    });

    // Forgot password
    if (!isSignUp) {
      document.getElementById('loginForgotBtn').addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) { showMsg('Enter your email address first.', 'error'); return; }
        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: APP_URL + '/reset-password'
        });
        showMsg(
          error ? error.message : 'Password reset email sent. Check your inbox.',
          error ? 'error' : 'success'
        );
      });
    }

    // Form submit
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn      = document.getElementById('loginSubmitBtn');
      const label    = isSignUp ? 'Create Account' : 'Sign In';

      btn.disabled = true;
      btn.querySelector('span').textContent = isSignUp ? 'Creating account…' : 'Signing in…';

      if (isSignUp) {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) showMsg(error.message, 'error');
        else showMsg('Account created! Check your email to confirm.', 'success');
        btn.disabled = false;
        btn.querySelector('span').textContent = label;
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
          showMsg(error.message, 'error');
          btn.disabled = false;
          btn.querySelector('span').textContent = label;
        } else {
          window.location.href = APP_URL;
        }
      }
    });

    // Google OAuth
    document.getElementById('loginGoogleBtn').addEventListener('click', async () => {
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: APP_URL }
      });
      if (error) showMsg(error.message, 'error');
    });

    // Facebook OAuth
    document.getElementById('loginFacebookBtn').addEventListener('click', async () => {
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: APP_URL }
      });
      if (error) showMsg(error.message, 'error');
    });
  }

  /* ── Message helper ── */
  function showMsg(text, type) {
    const el = document.getElementById('loginMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'login-msg login-msg--' + type;
    el.style.display = 'block';
  }

  /* ── Open / close ── */
  function openLogin() {
    if (!overlay) buildModal();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('loginEmail')?.focus(), 100);
  }

  function closeLogin() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Expose globally ── */
  window.openLogin = openLogin;

  /* ── Escape key ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay?.classList.contains('open')) closeLogin();
  });

  /* ── Auth state: redirect on sign-in (OAuth callback), update UI on sign-out ── */
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      window.location.href = APP_URL;
    }
    if (event === 'SIGNED_OUT') {
      updateTriggerUI(null);
    }
  });

  /* ── Update Sign In button when session exists ── */
  function updateTriggerUI(user) {
    const btn = document.getElementById('auth-trigger');
    if (!btn) return;
    if (user) {
      const initial = (user.email || 'U')[0].toUpperCase();
      btn.innerHTML = `<span class="nav-user-avatar">${initial}</span>`;
      btn.title = `Signed in as ${user.email} — click to sign out`;
      btn.dataset.loggedIn = 'true';
      btn.onclick = () => sb.auth.signOut();
    } else {
      btn.innerHTML = 'Sign In';
      btn.title = '';
      btn.dataset.loggedIn = 'false';
      btn.onclick = openLogin;
    }
  }

  /* ── Auto-attach to #auth-trigger + check session on load ── */
  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('auth-trigger');
    if (trigger) trigger.addEventListener('click', openLogin);

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) updateTriggerUI(session.user);
    });
  });
})();
