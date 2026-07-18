// Navigation « suivant » entre publications d'une même catégorie.
// La source de vérité reste publications-data.js : ajouter/retirer une
// publication met à jour ces liens automatiquement, sans toucher aux pages.
import { publications, categoryMeta } from './publications-data.js';

// Publication suivante dans la même catégorie (en boucle). null s'il n'y a
// pas d'autre publication lisible dans la catégorie.
export function nextPublication(id) {
  const cur = publications.find(p => p.id === id);
  if (!cur) return null;
  const list = publications.filter(p => p.category === cur.category && p.published && p.read);
  if (list.length < 2) return null;
  const i = list.findIndex(p => p.id === id);
  if (i === -1) return null;
  return list[(i + 1) % list.length];
}

// Retrouve une publication à partir d'un fragment de son lien de lecture
// (utile pour lire.html, qui ne connaît que le paramètre ?src=).
export function pubByRead(fragment) {
  if (!fragment) return null;
  return publications.find(p => p.read && p.read.indexOf(fragment) !== -1) || null;
}

let styleInjected = false;
function injectStyle() {
  if (styleInjected) return;
  styleInjected = true;
  const css =
    '.nextpub{display:flex;align-items:center;gap:20px;text-decoration:none;' +
    'border:1px solid rgba(0,0,0,.14);border-radius:8px;padding:18px 22px;' +
    'background:rgba(23,20,16,.02);transition:background .2s,border-color .2s,transform .2s}' +
    '.nextpub:hover{background:#171410;border-color:#171410;transform:translateY(-1px)}' +
    '.nextpub:hover .nextpub-kicker{color:#e7bb52}' +
    '.nextpub:hover .nextpub-title{color:#f8f2e3}' +
    '.nextpub:hover .nextpub-arrow{color:#f8f2e3}' +
    '.nextpub-thumb{width:60px;height:60px;flex:none;border-radius:5px;background-color:#171410;' +
    'background-size:contain;background-repeat:no-repeat;background-position:center}' +
    '.nextpub-body{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}' +
    '.nextpub-kicker{font-size:11px;font-weight:800;letter-spacing:.08em;color:#8a6614;transition:color .2s}' +
    '.nextpub-title{font-size:18px;font-weight:800;color:#171410;line-height:1.25;transition:color .2s}' +
    '.nextpub-arrow{font-size:20px;font-weight:800;color:#8a6614;flex:none;transition:color .2s}';
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Injecte une carte « <Catégorie> suivant » dans l'élément ciblé.
export function mountNextCard(id, selector) {
  const next = nextPublication(id);
  const host = document.querySelector(selector);
  if (!next || !host) return;
  injectStyle();
  const meta = categoryMeta[next.category] || {};
  const label = ((meta.singular || 'Publication') + ' suivant').toUpperCase();
  const thumb = next.cover
    ? '<span class="nextpub-thumb" style="background-image:url(\'' + encodeURI(next.cover) + '\')"></span>'
    : '';
  host.innerHTML =
    '<a class="nextpub" href="' + encodeURI(next.read) + '">' +
      thumb +
      '<span class="nextpub-body">' +
        '<span class="nextpub-kicker">' + escapeHtml(label) + '</span>' +
        '<span class="nextpub-title">' + escapeHtml(next.title) + '</span>' +
      '</span>' +
      '<span class="nextpub-arrow">&rarr;</span>' +
    '</a>';
}
