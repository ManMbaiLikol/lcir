// Balisage schema.org de la page Publications (CollectionPage + ItemList).
//
// Cette liste est GÉNÉRÉE à partir de publications.json (via publications-data.js),
// jamais recopiée : ajouter une publication au catalogue suffit à la faire
// apparaître dans les données structurées. Google exécute le JavaScript et
// indexe le JSON-LD injecté après le chargement.
import { publications, categoryMeta } from './publications-data.js';

const BASE = 'https://manmbailikol.github.io/lcir/';

const ORG = {
  '@type': 'Organization',
  name: "Laboratoire Camerounais d'Ingénierie du Raisonnement",
  alternateName: 'LCIR',
  url: BASE
};

// Seules les publications réellement parues sont listées : une publication
// « à paraître » n'a pas d'URL et n'aurait rien à faire dans l'index.
const parues = publications.filter(p => p.published);

const itemList = parues.map((p, i) => {
  const meta = categoryMeta[p.category] || {};
  const item = {
    '@type': p.category === 'cahier' ? 'ScholarlyArticle' : 'Article',
    name: p.title,
    headline: p.title,
    description: p.excerpt,
    author: { '@type': 'Person', name: p.author },
    publisher: ORG,
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    articleSection: meta.singular || 'Publication'
  };
  if (p.year) item.datePublished = String(p.year);
  if (p.read) { item.url = BASE + p.read; item.mainEntityOfPage = BASE + p.read; }
  if (p.cover) item.image = BASE + p.cover;
  if (p.pages) item.numberOfPages = p.pages;
  if (p.pdf) {
    item.encoding = { '@type': 'MediaObject', encodingFormat: 'application/pdf', contentUrl: BASE + p.pdf };
  }
  return { '@type': 'ListItem', position: i + 1, item };
});

const graph = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Publications — LCIR',
  description: "Ouvrages, cahiers stratégiques et articles du LCIR sur les transformations économiques, industrielles, financières, institutionnelles et géopolitiques du Cameroun.",
  url: BASE + 'publications.html',
  inLanguage: 'fr-FR',
  publisher: ORG,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: itemList.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: itemList
  }
};

const el = document.createElement('script');
el.type = 'application/ld+json';
el.textContent = JSON.stringify(graph);
document.head.appendChild(el);
