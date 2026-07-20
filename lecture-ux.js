// Confort de lecture des pages de lecture LCIR :
// barre de progression, temps de lecture estimé, sommaire ancré avec suivi.
(function () {
  var article = document.querySelector('article.wrap');
  var body = article && article.querySelector('.body');
  if (!body) return;

  // --- Temps de lecture estimé (≈200 mots/min) ---
  var words = (body.innerText || '').trim().split(/\s+/).filter(Boolean).length;
  var mins = Math.max(1, Math.round(words / 200));
  var byline = document.querySelector('.byline');
  if (byline) {
    var sep = document.createElement('span');
    sep.textContent = '·';
    var rt = document.createElement('span');
    rt.textContent = mins + ' min de lecture';
    byline.appendChild(sep);
    byline.appendChild(rt);
  }

  // --- Sommaire ancré (à partir des titres de section h2) ---
  var COMBINING = new RegExp('[\\u0300-\\u036f]', 'g');
  function slug(txt) {
    return txt.toLowerCase().normalize('NFD').replace(COMBINING, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
  }
  var headings = Array.prototype.slice.call(body.querySelectorAll('h2'));
  var links = [];
  if (headings.length >= 3) {
    var used = {};
    var details = document.createElement('details');
    details.className = 'toc';
    details.open = true;
    var summary = document.createElement('summary');
    summary.textContent = 'SOMMAIRE';
    details.appendChild(summary);
    var ol = document.createElement('ol');

    headings.forEach(function (h) {
      var id = slug(h.textContent);
      while (used[id]) { id = id + '-2'; }
      used[id] = true;
      h.id = id;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ol.appendChild(li);
      links.push({ a: a, h: h });
    });
    details.appendChild(ol);
    body.insertBefore(details, headings[0]);
  }

  // --- Notes de bas de page ancrées (actif seulement si le balisage est présent) ---
  // Patron : dans le texte  <sup class="fn-ref" id="fnref-1"><a href="#fn-1"></a></sup>
  //          en fin de body  <ol class="footnotes"><li id="fn-1">Texte de la note.</li></ol>
  // La numérotation et les liens de retour (↩) sont ajoutés automatiquement.
  var fnRefs = Array.prototype.slice.call(body.querySelectorAll('.fn-ref'));
  fnRefs.forEach(function (ref, i) {
    if (!ref.id) ref.id = 'fnref-' + (i + 1);
    var link = ref.matches('a') ? ref : ref.querySelector('a');
    if (link && !link.textContent.trim()) link.textContent = String(i + 1);
  });
  var fnList = body.querySelector('.footnotes');
  if (fnList) {
    Array.prototype.slice.call(fnList.querySelectorAll('li')).forEach(function (li) {
      if (!li.id || li.querySelector('.fn-back')) return;
      var num = li.id.replace(/^fn-?/, '');
      var back = document.createElement('a');
      back.className = 'fn-back';
      back.href = '#fnref-' + num;
      back.setAttribute('aria-label', 'Retour au texte');
      back.textContent = '↩';
      li.appendChild(document.createTextNode(' '));
      li.appendChild(back);
    });
  }

  // --- Barre de progression de lecture ---
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;
  function update() {
    ticking = false;
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    bar.style.width = (done * 100).toFixed(2) + '%';

    // Suivi de la section courante dans le sommaire.
    if (links.length) {
      var current = links[0];
      for (var i = 0; i < links.length; i++) {
        if (links[i].h.getBoundingClientRect().top <= 130) current = links[i];
        else break;
      }
      links.forEach(function (l) { l.a.classList.toggle('active', l === current); });
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
