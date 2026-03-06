(function () {
  var isInner = window.location.pathname.indexOf('/scr/html/') !== -1;
  var root    = isInner ? '../../' : '';
  var inner   = isInner ? '' : 'scr/html/';

  var path = window.location.pathname;
  var active = path.indexOf('pricing')  !== -1 ? 'pricing'
             : path.indexOf('help')     !== -1 ? 'faq'
             : path.indexOf('contact')  !== -1 ? 'contact'
             : path.indexOf('schedule') !== -1 ? 'schedule'
             : 'home';

  function link(href, label, key) {
    var cls = 'nav-link' + (active === key ? ' active' : '');
    return '<a href="' + href + '" class="' + cls + '">' + label + '</a>';
  }

  /* ── Drawer link icons ── */
  var ICONS = {
    home: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5L7.5 2 13 7.5V13H9.5V10h-4v3H2V7.5z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>',
    pricing: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M8.5 2H13v4.5l-7 7L2 9.5l7-7z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><circle cx="10.5" cy="4.5" r="1" fill="currentColor"/></svg>',
    faq: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" stroke-width="1.1"/><path d="M6 5.5a1.5 1.5 0 012.8.75C8.8 7.5 7.5 8 7.5 9" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><circle cx="7.5" cy="11" r=".75" fill="currentColor"/></svg>',
    contact: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="3.5" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.1"/><path d="M1.5 4.5l6 4 6-4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
  };

  function drawerLink(href, label, key, icon) {
    var cls = 'drawer-link' + (active === key ? ' active' : '');
    return [
      '<a href="' + href + '" class="' + cls + '">',
        '<span class="drawer-link-icon">' + icon + '</span>',
        '<span class="drawer-link-text">' + label + '</span>',
      '</a>'
    ].join('');
  }

  var html = [
    /* ── Main nav ── */
    '<nav>',
      '<button class="hamburger" id="hamburger" aria-label="Open menu" onclick="toggleDrawer()">',
        '<span></span><span></span><span></span>',
      '</button>',
      '<a href="' + root + 'index.html" class="nav-logo">Arcera</a>',
      '<div class="nav-links">',
        link(inner + 'pricing.html',  'Pricing',  'pricing'),
        link(inner + 'help.html',     'FAQ',      'faq'),
        link(inner + 'contact.html',  'Contact',  'contact'),
        '<button class="nav-signin" id="auth-trigger">Sign In</button>',
        '<a href="' + inner + 'schedule.html" class="nav-cta">Schedule a Call</a>',
      '</div>',
    '</nav>',

    /* ── Service area sub-bar ── */
    '<div class="nav-sub' + (active === 'pricing' ? ' nav-sub--hidden' : '') + '">',
      '<span class="nav-sub-label">Currently serving</span>',
      '<span class="nav-sub-city">Los Angeles, CA</span>',
      '<span class="nav-sub-neighborhoods">&ensp;&middot;&ensp; Palisades &ensp;&middot;&ensp; Bel Air &ensp;&middot;&ensp; Brentwood &ensp;&middot;&ensp; Hancock Park &ensp;&middot;&ensp; Malibu &ensp;&middot;&ensp; Calabasas</span>',
    '</div>',

    /* ── Drawer overlay ── */
    '<div class="drawer-overlay" id="drawer-overlay" onclick="closeDrawer()"></div>',

    /* ── Mobile drawer ── */
    '<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">',

      /* Header */
      '<div class="drawer-header">',
        '<div class="drawer-header-title">',
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">',
            '<path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
          '</svg>',
          '<span>Menu</span>',
        '</div>',
        '<button class="drawer-close" aria-label="Close menu" onclick="closeDrawer()">',
          '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">',
            '<path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
          '</svg>',
        '</button>',
      '</div>',

      /* Nav links */
      '<nav class="drawer-nav" aria-label="Mobile navigation">',
        drawerLink(root + 'index.html',    'Home',    'home',    ICONS.home),
        drawerLink(inner + 'pricing.html', 'Pricing', 'pricing', ICONS.pricing),
        drawerLink(inner + 'help.html',    'FAQ',     'faq',     ICONS.faq),
        drawerLink(inner + 'contact.html', 'Contact', 'contact', ICONS.contact),
      '</nav>',

      /* CTA */
      '<div class="drawer-cta-section">',
        '<a href="' + inner + 'schedule.html" class="drawer-cta">',
        '<span>Schedule a Strategy Call</span>',
        '<svg class="drawer-cta-arrow" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2 6.5h9M7.5 3l3.5 3.5-3.5 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '</a>',
      '</div>',

      /* Auth — populated by login.js */
      '<div class="drawer-auth" id="drawer-auth">',
        '<button class="drawer-auth-btn" id="drawer-signin-btn">Sign In</button>',
      '</div>',

    '</div>'
  ].join('');

  var placeholder = document.getElementById('site-nav');
  if (placeholder) placeholder.outerHTML = html;

  /* ── Drawer toggle ── */
  window.toggleDrawer = function () {
    var drawer  = document.getElementById('drawer');
    var overlay = document.getElementById('drawer-overlay');
    var burger  = document.getElementById('hamburger');
    if (!drawer) return;
    var open = drawer.classList.toggle('open');
    overlay.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  window.closeDrawer = function () {
    var drawer  = document.getElementById('drawer');
    var overlay = document.getElementById('drawer-overlay');
    var burger  = document.getElementById('hamburger');
    if (!drawer) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeDrawer();
  });
})();
