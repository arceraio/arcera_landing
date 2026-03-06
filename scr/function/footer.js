(function () {
  var html = [
    '<footer>',
      '<div class="footer-inner">',
        '<div class="footer-grid">',
          '<div class="footer-brand">',
            '<a href="/" class="footer-logo">Arcera</a>',
            '<span class="footer-brand-sep" aria-hidden="true"></span>',
            '<p class="footer-tagline">Trusted in uncertainty.</p>',
          '</div>',
          '<div class="footer-links">',
            '<a href="/pricing" class="footer-link">Pricing</a>',
            '<a href="/faq" class="footer-link">FAQ</a>',
            '<a href="/schedule" class="footer-link footer-link--cta">Schedule a Call</a>',
            '<a href="/contact" class="footer-link">Contact</a>',
          '</div>',
        '</div>',
        '<div class="footer-bottom">',
          '<p class="footer-copy">Currently serving Los Angeles, CA</p>',
          '<div class="footer-contact">',
            '<a href="mailto:support@arcera.io">support@arcera.io</a>',
            '<a href="tel:9257086664">925-708-6664</a>',
          '</div>',
        '</div>',
        '<div class="footer-legal">',
          '<a href="/terms" class="footer-legal-link">Terms of Service</a>',
          '<span class="footer-legal-sep" aria-hidden="true">\u00b7</span>',
          '<a href="/privacy" class="footer-legal-link">Privacy Policy</a>',
          '<span class="footer-legal-sep" aria-hidden="true">\u00b7</span>',
          '<a href="/privacy-choices" class="footer-legal-link">Privacy Settings</a>',
        '</div>',
      '</div>',
    '</footer>'
  ].join('');

  var placeholder = document.getElementById('site-footer');
  if (placeholder) placeholder.outerHTML = html;
})();
