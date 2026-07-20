// Catalogue des publications du LCIR.
// Pour mettre une nouvelle publication en avant sur l'accueil : ajoutez-la en HAUT
// de ce tableau avec published:true — elle devient automatiquement la "dernière parution".
// L'ordre des catégories sur la page Publications est toujours Livres → Cahiers → Articles,
// quel que soit l'ordre ici : les livres sont toujours affichés en premier.
//
// Champ `theme` : classe la publication dans un dossier thématique sur la page
// Publications (mode « Classer par : Thème »). Valeurs possibles :
//   'monnaie'  → Souveraineté monétaire
//   'corridor' → Corridor & industrie
//   'mines'    → Mines & ressources
//   'finance'  → Finance & diaspora
// (Ces libellés sont définis dans publications.html — themeMeta / themeOrder.)

export const publications = [
  {
    id: 'corridor-atlantique',
    category: 'cahier',
    number: '002',
    title: 'Corridor Atlantique Camerounais (Limbé-Douala-Edéa-Kribi)',
    author: 'Man Mbaï Likol',
    year: '2026',
    pages: null,
    excerpt: "Analyse stratégique du corridor Limbé-Douala-Edéa-Kribi et de son rôle dans l'ancrage industriel et portuaire de la souveraineté économique camerounaise.",
    cover: 'assets/corridor-atlantique-cover.jpg',
    pdf: 'assets/corridor-atlantique.pdf',
    read: 'lecture-corridor-atlantique.html',
    theme: 'corridor',
    published: true
  },
  {
    id: 'apres-cfa',
    category: 'cahier',
    number: '001',
    title: "Le Cameroun construit-il l'après-CFA ?",
    author: 'Man Mbaï Likol',
    year: '2026',
    pages: 26,
    excerpt: "Analyse systémique de la construction progressive des capacités productives, financières, bancaires et monétaires nécessaires à la souveraineté.",
    cover: 'assets/apres-cfa-cover.jpg',
    pdf: 'assets/apres-cfa.pdf',
    read: 'lecture-apres-cfa.html',
    theme: 'monnaie',
    published: true
  },
  {
    id: 'livre-001',
    category: 'livre',
    number: null,
    title: 'À paraître',
    author: 'LCIR',
    year: '',
    pages: null,
    excerpt: 'Premier ouvrage de fond du laboratoire, prochainement.',
    cover: null,
    pdf: null,
    theme: 'monnaie',
    published: false
  },
  {
    id: 'secteur-minier',
    category: 'article',
    number: null,
    title: 'Secteur minier : le Cameroun veut reprendre le contrôle de son sous-sol',
    author: 'Man Mbaï Likol',
    year: '2026',
    pages: null,
    excerpt: "Grands projets miniers, filière de l'or et ambitions industrielles : comment le Cameroun tente de transformer ses ressources du sous-sol en véritable levier de souveraineté économique.",
    cover: 'assets/secteur-minier-cover.jpg',
    pdf: null,
    read: 'lecture-secteur-minier.html',
    theme: 'mines',
    published: true
  },
  {
    id: 'afd-diaspora',
    category: 'article',
    number: null,
    title: "Pourquoi l'AFD est-elle associée au projet de mobilisation de 2 000 milliards FCFA auprès de la diaspora ?",
    author: 'Man Mbaï Likol',
    year: '2026',
    pages: null,
    excerpt: "Une lecture à l'aune de la souveraineté financière : ce que révèle l'implication de l'AFD dans le projet de mobilisation de 2 000 milliards FCFA porté par la Caisse des Dépôts et Consignations auprès de la diaspora camerounaise.",
    cover: 'assets/afd-diaspora-cover.jpg',
    pdf: null,
    read: 'lecture-afd-diaspora.html',
    theme: 'finance',
    published: true
  }
];

export const categoryMeta = {
  livre: { label: 'Livres', singular: 'Livre' },
  cahier: { label: 'Cahiers stratégiques', singular: 'Cahier stratégique' },
  article: { label: 'Articles', singular: 'Article' }
};

export const categoryOrder = ['livre', 'cahier', 'article'];
