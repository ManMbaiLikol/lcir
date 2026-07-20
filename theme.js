// Bouton de bascule thème clair/sombre.
// Le thème initial est appliqué par le script inline du <head> (anti-scintillement).
// Délégation d'événement + resynchronisation : robuste sur les pages statiques
// (lecture) comme sur les pages rendues par le framework DC (accueil, publications…).
(function () {
  var root = document.documentElement;

  var SUN = '<svg viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm18 0a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM5.6 5.6a1 1 0 0 1 1.4 0l.7.7a1 1 0 1 1-1.4 1.4l-.7-.7a1 1 0 0 1 0-1.4zm11 11a1 1 0 0 1 1.4 0l.7.7a1 1 0 0 1-1.4 1.4l-.7-.7a1 1 0 0 1 0-1.4zm1.4-11a1 1 0 0 1 0 1.4l-.7.7a1 1 0 1 1-1.4-1.4l.7-.7a1 1 0 0 1 1.4 0zm-11 11a1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.4-1.4l.7-.7a1 1 0 0 1 1.4 0z"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function current() {
    var e = root.getAttribute('data-theme');
    if (e === 'dark' || e === 'light') return e;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  function sync() {
    var t = current();
    var btns = document.querySelectorAll('.theme-toggle, #theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = t === 'dark' ? SUN : MOON;
      var label = t === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
      btns[i].setAttribute('aria-label', label);
      btns[i].setAttribute('title', label);
    }
  }
  function apply(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('lcir-theme', t); } catch (e) {}
    sync();
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.theme-toggle, #theme-toggle');
    if (b) { e.preventDefault(); apply(current() === 'dark' ? 'light' : 'dark'); }
  });
  if (window.matchMedia) {
    try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync); } catch (e) {}
  }
  sync();
  document.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('load', sync);
})();
