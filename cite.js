// Bloc « Citer ce cahier / cet article » : référence académique prête à copier.
// Se monte sur les conteneurs [data-cite]. Lit les métadonnées depuis les
// attributs data-* du conteneur + l'URL canonique de la page.
// Bilingue : bascule en anglais si <html lang="en">.
(function () {
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var COPY = '<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v13h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>';

  function canonical() {
    var l = document.querySelector('link[rel="canonical"]');
    return (l && l.href) || location.href;
  }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function todayStr() {
    try {
      return new Intl.DateTimeFormat(EN ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    } catch (e) { return ''; }
  }

  function mount(c) {
    var author = c.getAttribute('data-author') || '';
    var title = c.getAttribute('data-title') || (document.title || '').replace(/\s*—\s*LCIR.*$/, '').trim();
    var ref = c.getAttribute('data-ref') || '';
    var year = c.getAttribute('data-year') || '';
    var kind = c.getAttribute('data-kind') || 'cahier';
    var url = canonical();
    var d = todayStr();
    var labName = EN ? 'Cameroonian Laboratory for the Engineering of Reasoning' : 'Laboratoire Camerounais d’Ingénierie du Raisonnement';

    var parts = [];
    if (author) parts.push(author);
    parts.push(EN ? ('“' + title + '”') : ('« ' + title + ' »'));
    if (ref) parts.push(ref);
    parts.push('LCIR — ' + labName);
    if (year) parts.push(year);
    var accessed = d ? (EN ? (' (accessed on ' + d + ')') : (' (consulté le ' + d + ')')) : '';
    var citation = parts.join(', ') + '. ' + url + accessed + '.';

    var heading = EN
      ? (kind === 'article' ? 'CITE THIS ARTICLE' : 'CITE THIS PAPER')
      : (kind === 'article' ? 'CITER CET ARTICLE' : 'CITER CE CAHIER');
    var btnLabel = EN ? 'Copy reference' : 'Copier la référence';
    var okLabel = EN ? 'Reference copied!' : 'Référence copiée !';

    c.innerHTML = '';
    c.appendChild(el('<div class="cite-label">' + heading + '</div>'));
    var box = el('<div class="cite-text"></div>');
    box.textContent = citation;
    c.appendChild(box);

    var btn = el('<button class="cite-btn" type="button">' + COPY + btnLabel + '</button>');
    btn.addEventListener('click', function () {
      var done = function () {
        var original = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = CHECK + okLabel;
        setTimeout(function () { btn.classList.remove('copied'); btn.innerHTML = original; }, 1900);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citation).then(done).catch(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = citation; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
    c.appendChild(btn);
  }

  function init() {
    document.querySelectorAll('[data-cite]').forEach(mount);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
