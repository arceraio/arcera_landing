(function () {
  'use strict';

  var STORAGE_KEY = 'arcera_privacy_prefs';

  function savePrefs(prefs) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (_) {}
  }

  // ── Build modal DOM ───────────────────────────────────────────────────────
  function buildModal() {
    if (document.getElementById('pm-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'pm-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Your Privacy Choices');

    overlay.innerHTML = [
      '<div id="pm-card">',

        // Header
        '<div class="pm-header">',
          '<span class="pm-title">Your Privacy Choices</span>',
          '<button class="pm-close" aria-label="Close">',
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">',
              '<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
            '</svg>',
          '</button>',
        '</div>',

        // Body
        '<div class="pm-body">',
          '<p class="pm-desc">',
            'Depending on where you live, you may have the right to opt out of any \u201csale\u201d or \u201csharing\u201d ',
            'of your personal information for targeted advertising purposes. We do not sell your ',
            'personal information for monetary compensation. However, we may share personal information ',
            'with analytics providers in ways that may qualify as sharing for cross-context behavioral ',
            'advertising under California law. Use the options below to exercise your rights.',
          '</p>',
        '</div>',

        // Action buttons
        '<div class="pm-actions">',
          '<button class="pm-action-btn" id="pm-opt-cookies">',
            'Opt Out of Non-Essential Cookies and Other Trackers',
          '</button>',
          '<a class="pm-action-btn" href="/privacy-choices">',
            'Opt Out of Other Types of Information Sharing',
          '</a>',
        '</div>',

      '</div>' // #pm-card
    ].join('');

    document.body.appendChild(overlay);

    // ── Wire up events ──────────────────────────────────────────────────────

    var cookieBtn = document.getElementById('pm-opt-cookies');
    cookieBtn.addEventListener('click', function () {
      savePrefs({ analytics: false });
      window.dispatchEvent(new CustomEvent('arcera:privacy-saved', { detail: { analytics: false } }));
      cookieBtn.textContent = '\u2713 Preference Saved';
      cookieBtn.classList.add('pm-action-btn--saved');
      cookieBtn.disabled = true;
      setTimeout(closeModal, 1400);
    });

    overlay.querySelector('.pm-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function openModal() {
    buildModal();
    var overlay = document.getElementById('pm-overlay');

    // Reset cookie button state in case modal was already built
    var cookieBtn = document.getElementById('pm-opt-cookies');
    if (cookieBtn) {
      cookieBtn.textContent = 'Opt Out of Non-Essential Cookies and Other Trackers';
      cookieBtn.classList.remove('pm-action-btn--saved');
      cookieBtn.disabled = false;
    }

    overlay.classList.add('pm-visible');
    document.body.style.overflow = 'hidden';
    var closeBtn = overlay.querySelector('.pm-close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);
  }

  function closeModal() {
    var overlay = document.getElementById('pm-overlay');
    if (overlay) {
      overlay.classList.remove('pm-visible');
      document.body.style.overflow = '';
    }
    document.removeEventListener('keydown', handleKeydown);
  }

  // ── Intercept all links pointing to privacy-choices ───────────────────────
  function attachTriggers() {
    document.querySelectorAll('a[href*="privacy-choices"], [data-privacy-modal]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTriggers);
  } else {
    attachTriggers();
  }

  window.openPrivacyModal = openModal;
})();
