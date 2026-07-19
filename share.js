// Boutons de partage réseaux sociaux pour les pages de lecture.
// Utilise l'URL canonique de la page (ou l'URL courante) et son titre.
(function () {
  function shareUrl() {
    var link = document.querySelector('link[rel="canonical"]');
    return (link && link.href) || location.href;
  }
  function shareTitle() {
    var og = document.querySelector('meta[property="og:title"]');
    return (og && og.content) || document.title.replace(/\s*[—–|]\s*LCIR.*$/, '').trim();
  }

  var ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.5c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.6 1 1-3.5-.2-.4C3 15 2.5 13.5 2.5 12 2.5 6.8 6.8 2.5 12 2.5S21.5 6.8 21.5 12 17.2 21.5 12 21.5zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7 1 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 10.9 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4C19.6 22.9 24 18 24 12z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9zm-1.3 19.4h2L6.5 3.3H4.4l13.2 17.3z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1.8 13H3.5V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-.9-.8-1.7-1.8-1.7z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10.6 13.4a1 1 0 0 0 1.4 0l4-4a3 3 0 0 0-4.2-4.2l-1.8 1.8a1 1 0 1 0 1.4 1.4l1.8-1.8a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 0 0 1.4zm2.8-2.8a1 1 0 0 0-1.4 0l-4 4a3 3 0 0 0 4.2 4.2l1.8-1.8a1 1 0 0 0-1.4-1.4l-1.8 1.8a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 0 0-1.4z"/></svg>',
    native: '<svg viewBox="0 0 24 24"><path d="M18 16c-.8 0-1.5.3-2 .8l-7-4a2.6 2.6 0 0 0 0-1.6l7-4c.5.5 1.2.8 2 .8a3 3 0 1 0-3-3v.4L8 9.4a3 3 0 1 0 0 5.2l7 4.1v.3a3 3 0 1 0 3-3z"/></svg>'
  };

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function mount(container) {
    var url = shareUrl();
    var title = shareTitle();
    var u = encodeURIComponent(url);
    var t = encodeURIComponent(title);
    var tu = encodeURIComponent(title + ' — ' + url);

    var targets = [
      { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/?text=' + tu },
      { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + u },
      { key: 'x', label: 'X', href: 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u },
      { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u }
    ];

    var row = el('<div class="share-row"></div>');

    // Partage natif (feuille de partage du téléphone) si disponible.
    if (navigator.share) {
      var nb = el('<button class="share-btn" type="button">' + ICONS.native + 'Partager</button>');
      nb.addEventListener('click', function () {
        navigator.share({ title: title, url: url }).catch(function () {});
      });
      row.appendChild(nb);
    }

    targets.forEach(function (item) {
      var a = el('<a class="share-btn" target="_blank" rel="noopener noreferrer">' +
        ICONS[item.key] + item.label + '</a>');
      a.href = item.href;
      a.setAttribute('aria-label', 'Partager sur ' + item.label);
      row.appendChild(a);
    });

    // Copier le lien.
    var cb = el('<button class="share-btn" type="button">' + ICONS.link + 'Copier le lien</button>');
    cb.addEventListener('click', function () {
      var done = function () {
        var original = cb.innerHTML;
        cb.classList.add('copied');
        cb.innerHTML = ICONS.link + 'Lien copié !';
        setTimeout(function () { cb.classList.remove('copied'); cb.innerHTML = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
    row.appendChild(cb);

    container.innerHTML = '<div class="share-label">PARTAGER CETTE PUBLICATION</div>';
    container.appendChild(row);
  }

  function init() {
    var containers = document.querySelectorAll('[data-share]');
    containers.forEach(function (c) { mount(c); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
