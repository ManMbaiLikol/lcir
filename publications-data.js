// Accès au catalogue des publications du LCIR.
//
// SOURCE UNIQUE DE VÉRITÉ : publications.json
// ------------------------------------------
// Ce module ne contient AUCUNE donnée de publication : il se contente de
// charger publications.json, qui est le seul fichier à modifier — à la main
// ou via l'interface d'administration (/admin/, voir admin/config.yml).
// Ne jamais recopier une publication ici ni dans une page HTML : c'est ce qui
// avait fait diverger le catalogue en quatre exemplaires.
//
// Pour ajouter une publication : éditer publications.json uniquement.
//   - la mettre en HAUT de la liste pour qu'elle soit mise en avant sur l'accueil ;
//   - `published: false` la marque « à paraître ».
//
// Champ `theme` : dossier thématique, parmi les clés de `categoryMeta`/`themeMeta`
// ('raisonnement', 'monnaie', 'corridor', 'mines', 'finance').

let publications = [];

try {
  // URL résolue par rapport à ce module : fonctionne quelle que soit la page appelante.
  const res = await fetch(new URL('publications.json', import.meta.url));
  if (res.ok) {
    const data = await res.json();
    if (data && Array.isArray(data.publications)) publications = data.publications;
  }
} catch (e) {
  // Le site reste utilisable : les listes s'affichent simplement vides.
  console.warn('[LCIR] Catalogue indisponible (publications.json) :', e);
}

export { publications };

// Libellés d'affichage : présentation, pas données. Leur place est bien ici.
export const categoryMeta = {
  livre: { label: 'Livres', singular: 'Livre' },
  cahier: { label: 'Cahiers stratégiques', singular: 'Cahier stratégique' },
  article: { label: 'Articles', singular: 'Article' }
};

export const categoryOrder = ['livre', 'cahier', 'article'];
