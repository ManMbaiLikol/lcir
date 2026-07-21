// Bloc « Suivre le laboratoire » : canaux de diffusion (WhatsApp / Telegram).
// S'ajoute au partage (share.js). Se monte sur les conteneurs [data-follow].
// Bilingue : bascule en anglais si <html lang="en">.
(function () {
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  // === Canaux de diffusion LCIR ===
  // Renseigner l'URL réelle du canal. Un href vide ou contenant « XXXX »
  // masque simplement le bouton correspondant.
  var CHANNELS = [
    { key: 'whatsapp', label: EN ? 'Follow on WhatsApp' : 'Suivre sur WhatsApp', href: 'https://whatsapp.com/channel/0029VbDwnnc4o7qNIpvFJq0k' },
    { key: 'telegram', label: EN ? 'Join on Telegram' : 'Rejoindre sur Telegram', href: '' }
  ];

  var HEADING = EN ? 'FOLLOW THE LABORATORY' : 'SUIVRE LE LABORATOIRE';
  var SUB = EN
    ? 'Get every new publication directly in your messaging app.'
    : 'Recevez chaque nouvelle publication directement sur votre messagerie.';

  var ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.5c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.6 1 1-3.5-.2-.4C3 15 2.5 13.5 2.5 12 2.5 6.8 6.8 2.5 12 2.5S21.5 6.8 21.5 12 17.2 21.5 12 21.5zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7 1 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M23.9 3.6l-3.6 17c-.3 1.2-1 1.5-2 .9l-5.5-4-2.7 2.6c-.3.3-.5.5-1 .5l.4-5.1L18.9 6c.4-.4-.1-.6-.6-.2L7.3 12.9l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L22.5 2c.9-.3 1.7.2 1.4 1.6z"/></svg>'
  };

  function isConfigured(href) { return !!href && href.indexOf('XXXX') === -1; }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function mount(container) {
    var active = CHANNELS.filter(function (c) { return isConfigured(c.href); });
    if (!active.length) { container.style.display = 'none'; return; }

    container.innerHTML =
      '<div class="follow-label">' + HEADING + '</div>' +
      '<div class="follow-sub">' + SUB + '</div>';

    var row = el('<div class="follow-row"></div>');
    active.forEach(function (c) {
      var a = el('<a class="follow-btn ' + c.key + '" target="_blank" rel="noopener noreferrer">' +
        ICONS[c.key] + c.label + '</a>');
      a.href = c.href;
      a.setAttribute('aria-label', c.label);
      row.appendChild(a);
    });
    container.appendChild(row);
  }

  function init() {
    document.querySelectorAll('[data-follow]').forEach(mount);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
