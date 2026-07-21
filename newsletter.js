// Bloc d'inscription à la newsletter du LCIR (MailerLite).
// Se monte sur tous les conteneurs [data-newsletter] de la page.
//
// SOURCE UNIQUE des identifiants MailerLite : ce fichier. Ne pas les recopier
// dans une page. Ils viennent du snippet « embed » du compte MailerLite, dans
// l'URL du formulaire : .../jsonp/ACCOUNT_ID/forms/FORM_ID/subscribe
//
// Usage minimal :   <div data-newsletter></div>
// Variantes :
//   data-newsletter="dark"   → version claire sur fond sombre (pied de page)
//   data-newsletter-title    → remplace le titre par défaut
//   data-newsletter-text     → remplace le texte d'accompagnement
(function () {
  var ACCOUNT = '2521453';
  var FORM = '193540420289955186';

  var TITLE = 'Soyez informé des parutions.';
  var TEXT = 'Recevez chaque nouvelle étude du laboratoire directement par e-mail. Analyses de fond, zéro spam, désinscription en un clic.';
  var KICKER = 'UNE NOUVELLE ÉTUDE, RÉGULIÈREMENT.';
  var NOTE = 'En vous inscrivant, vous acceptez de recevoir les publications du LCIR par e-mail.';

  var styleInjected = false;
  function injectStyle() {
    if (styleInjected) return;
    styleInjected = true;
    var css =
      '.lcir-nl{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px}' +
      '.lcir-nl-kicker{font-size:12px;font-weight:800;letter-spacing:.06em;color:#171410;margin-bottom:10px}' +
      '.lcir-nl-title{font-size:34px;font-weight:800;color:#171410;line-height:1.15;margin:0}' +
      '.lcir-nl-text{font-size:14px;color:rgba(23,20,16,.72);margin-top:12px;max-width:420px;line-height:1.5}' +
      '.lcir-nl-side{display:flex;flex-direction:column;gap:10px;min-width:300px}' +
      '.lcir-nl-form{display:flex;gap:10px;background:rgba(16,14,11,.06);padding:6px;border-radius:999px;border:1px solid rgba(16,14,11,.18)}' +
      '.lcir-nl-input{flex:1;min-width:0;font-family:inherit;font-size:15px;padding:12px 18px;border:none;background:transparent;color:#171410;outline:none}' +
      '.lcir-nl-input::placeholder{color:rgba(23,20,16,.5)}' +
      '.lcir-nl-btn{cursor:pointer;white-space:nowrap;font-family:inherit;font-size:12px;font-weight:800;letter-spacing:.05em;color:#f8f2e3;background:#171410;border:none;border-radius:999px;padding:14px 24px;transition:transform .2s,opacity .2s}' +
      '.lcir-nl-btn:hover{transform:translateY(-1px)}' +
      '.lcir-nl-btn:disabled{opacity:.55;cursor:default;transform:none}' +
      '.lcir-nl-ok{font-size:15px;font-weight:700;color:#171410;background:rgba(16,14,11,.08);border:1px solid rgba(16,14,11,.2);border-radius:14px;padding:16px 20px;line-height:1.5}' +
      '.lcir-nl-err{font-size:13px;font-weight:700;color:#8a1c14;padding-left:8px}' +
      '.lcir-nl-note{font-size:12px;color:rgba(23,20,16,.72);padding-left:8px}' +
      // Variante sur fond sombre (pied des pages de lecture)
      '.lcir-nl-dark .lcir-nl-kicker{color:#e7bb52}' +
      '.lcir-nl-dark .lcir-nl-title{color:#f8f2e3}' +
      '.lcir-nl-dark .lcir-nl-text{color:rgba(247,242,230,.7)}' +
      '.lcir-nl-dark .lcir-nl-form{background:rgba(247,242,230,.08);border-color:rgba(247,242,230,.22)}' +
      '.lcir-nl-dark .lcir-nl-input{color:#f8f2e3}' +
      '.lcir-nl-dark .lcir-nl-input::placeholder{color:rgba(247,242,230,.5)}' +
      '.lcir-nl-dark .lcir-nl-btn{background:#e7bb52;color:#171410}' +
      '.lcir-nl-dark .lcir-nl-ok{color:#f8f2e3;background:rgba(247,242,230,.1);border-color:rgba(247,242,230,.24)}' +
      '.lcir-nl-dark .lcir-nl-err{color:#f0a29a}' +
      '.lcir-nl-dark .lcir-nl-note{color:rgba(247,242,230,.5)}' +
      '@media(max-width:820px){' +
        '.lcir-nl-title{font-size:26px}' +
        '.lcir-nl-side{width:100%;min-width:0}' +
        '.lcir-nl-form{flex-direction:column;border-radius:18px;background:transparent;border:none;padding:0}' +
        '.lcir-nl-input{background:rgba(16,14,11,.06);border-radius:999px;border:1px solid rgba(16,14,11,.18)}' +
        '.lcir-nl-dark .lcir-nl-input{background:rgba(247,242,230,.08);border-color:rgba(247,242,230,.22)}' +
      '}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isEmail(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }

  // Brouillons conservés entre deux montages : les pages rendues par le
  // framework DC réécrivent le DOM, ce qui effacerait la saisie en cours.
  var drafts = {};
  var doneKeys = {};

  function keyOf(host) {
    var k = host.getAttribute('data-newsletter-key');
    if (!k) {
      k = 'nl' + Object.keys(drafts).length;
      host.setAttribute('data-newsletter-key', k);
    }
    return k;
  }

  function mount(host) {
    // Déjà monté et intact : ne rien faire.
    if (host.querySelector('.lcir-nl-form') || host.querySelector('.lcir-nl-ok')) return;
    var key = keyOf(host);
    injectStyle();

    // Inscription déjà validée : réafficher la confirmation, pas le formulaire.
    if (doneKeys[key]) {
      host.classList.add('lcir-nl');
      host.innerHTML = '<div class="lcir-nl-side"><div class="lcir-nl-ok">' +
        '✓ Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.</div></div>';
      return;
    }

    var title = host.getAttribute('data-newsletter-title') || TITLE;
    var text = host.getAttribute('data-newsletter-text') || TEXT;
    if (host.getAttribute('data-newsletter') === 'dark') host.classList.add('lcir-nl-dark');
    host.classList.add('lcir-nl');

    host.innerHTML =
      '<div>' +
        '<div class="lcir-nl-kicker">' + escapeHtml(KICKER) + '</div>' +
        '<p class="lcir-nl-title">' + escapeHtml(title) + '</p>' +
        '<div class="lcir-nl-text">' + escapeHtml(text) + '</div>' +
      '</div>' +
      '<div class="lcir-nl-side">' +
        '<div class="lcir-nl-form">' +
          '<input type="email" class="lcir-nl-input" placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail" autocomplete="email">' +
          '<button type="button" class="lcir-nl-btn">S\'INSCRIRE</button>' +
        '</div>' +
        '<div class="lcir-nl-err" hidden></div>' +
        '<div class="lcir-nl-note">' + escapeHtml(NOTE) + '</div>' +
      '</div>';

    var side = host.querySelector('.lcir-nl-side');
    var form = host.querySelector('.lcir-nl-form');
    var input = host.querySelector('.lcir-nl-input');
    var btn = host.querySelector('.lcir-nl-btn');
    var err = host.querySelector('.lcir-nl-err');
    var note = host.querySelector('.lcir-nl-note');
    var busy = false;

    // Restaure la saisie perdue lors d'un re-rendu du framework.
    if (drafts[key]) input.value = drafts[key];
    input.addEventListener('input', function () { drafts[key] = input.value; });

    function showError(msg) {
      err.textContent = msg;
      err.hidden = false;
    }

    async function subscribe() {
      if (busy) return;
      var email = (input.value || '').trim();
      if (!isEmail(email)) { showError('Merci d’entrer une adresse e-mail valide.'); input.focus(); return; }
      err.hidden = true;
      busy = true;
      btn.disabled = true;
      btn.textContent = 'ENVOI…';
      try {
        var body = new URLSearchParams();
        body.append('fields[email]', email);
        body.append('ml-submit', '1');
        body.append('anticsrf', 'true');
        // mode no-cors : la réponse est opaque, on ne peut pas lire le statut.
        await fetch('https://assets.mailerlite.com/jsonp/' + ACCOUNT + '/forms/' + FORM + '/subscribe',
          { method: 'POST', mode: 'no-cors', body: body });
        doneKeys[key] = true;
        drafts[key] = '';
        form.remove();
        note.remove();
        err.remove();
        var ok = document.createElement('div');
        ok.className = 'lcir-nl-ok';
        ok.textContent = '✓ Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.';
        side.appendChild(ok);
      } catch (e) {
        showError('Une erreur est survenue. Merci de réessayer dans un instant.');
        btn.disabled = false;
        btn.textContent = 'S\'INSCRIRE';
        busy = false;
      }
    }

    btn.addEventListener('click', subscribe);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); subscribe(); }
    });
  }

  function mountAll() {
    var hosts = document.querySelectorAll('[data-newsletter]');
    for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }
  window.addEventListener('load', mountAll);

  // Les pages rendues par le framework DC (accueil, publications) réécrivent
  // leur DOM après coup et à chaque changement d'état : on remonte le bloc
  // dès qu'il a été effacé. mount() ne fait rien si le formulaire est intact,
  // donc l'observateur ne provoque pas de re-rendu en boucle.
  var pending = null;
  var observer = new MutationObserver(function () {
    if (pending) return;
    pending = setTimeout(function () { pending = null; mountAll(); }, 60);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
