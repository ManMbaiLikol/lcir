// Catalogue des publications du LCIR.
// La liste est désormais stockée dans publications.json, éditable via
// l'interface d'administration Decap CMS (/admin/) — sans toucher au code.
// Ce module la charge et l'expose aux pages (accueil, Publications, navigation).
//
// Pour mettre une nouvelle publication en avant sur l'accueil : placez-la en HAUT
// de la liste avec "published": true — elle devient la "dernière parution".
// L'ordre des catégories sur la page Publications est toujours Livres → Cahiers → Articles.
//
// Champ `theme` : classe la publication dans un dossier thématique sur la page
// Publications (mode « Classer par : Thème »). Valeurs possibles :
//   'raisonnement' → Raisonnement & prospective
//   'monnaie'  → Souveraineté monétaire
//   'corridor' → Corridor & industrie
//   'mines'    → Mines & ressources
//   'finance'  → Finance & diaspora
// Champs `title_en` / `excerpt_en` : versions anglaises utilisées par les pages /en/.

// Chargé relativement à ce module (fonctionne aussi depuis /en/).
const dataUrl = new URL('./publications.json', import.meta.url);
export const publications = await fetch(dataUrl)
  .then(r => r.json())
  .then(d => (d && d.publications) || []);

export const categoryMeta = {
  livre: { label: 'Livres', singular: 'Livre' },
  cahier: { label: 'Cahiers stratégiques', singular: 'Cahier stratégique' },
  article: { label: 'Articles', singular: 'Article' }
};

export const categoryOrder = ['livre', 'cahier', 'article'];
