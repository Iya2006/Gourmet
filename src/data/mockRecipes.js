export const mockChefs = [
  { id: 'c1', name: 'Carolin Roitzheim', role: 'Éditrice culinaire', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'c2', name: 'Paul Breuer', role: 'Chef Pâtissier', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: 'c3', name: 'Steven Edwort', role: 'Chef exécutif', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'c4', name: 'Marco Hartz', role: 'Chef traiteur', avatar: 'https://randomuser.me/api/portraits/men/90.jpg' },
  { id: 'c5', name: 'Lisa Schölzel', role: 'Rédactrice gastronomique', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'c6', name: 'David G.', role: 'Chef à domicile', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 'c7', name: 'Emma T.', role: 'Blogueuse culinaire', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' }
];

export const mockQuickLinks = [
  { id: 'q1', title: 'Repas à emporter', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400' },
  { id: 'q2', title: 'Petit-déjeuner', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400' },
  { id: 'q3', title: 'Dîners rapides', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' },
  { id: 'q4', title: 'Végétarien', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  { id: 'q5', title: 'Sans gluten', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400' },
  { id: 'q6', title: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400' },
];

export const mockRecipes = [
  {
    id: "cdc-1",
    title: "Poulet Yassa",
    category: "Africain",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    rating: 4.8,
    reviewsCount: 150,
    difficulty: "Moyen",
    times: { prep: 15, bake: 30, rest: 0 },
    nutrition: { cal: 450, prot: 30, fat: 15, carb: 40 },
    baseServings: 4,
    tags: ["Africain", "Poulet"],
    likes: 1200,
    ingredients: [
      { id: 'i1', name: 'Poulet', amount: 1, unit: 'kg' },
      { id: 'i2', name: 'Oignons', amount: 4, unit: 'pièces' },
      { id: 'i3', name: 'Citron', amount: 3, unit: 'pièces' }
    ],
    utensils: ['Faitout', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Marinade',
        instruction: 'Mariner le poulet avec le jus de citron et les oignons pendant 2h.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
        ingredients: ['i1', 'i2', 'i3'],
        utensils: ['Faitout']
      },
      {
        id: 's2',
        title: 'Cuisson',
        instruction: 'Faire mijoter à feu doux jusqu\'à cuisson complète du poulet.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
        ingredients: [],
        utensils: ['Faitout']
      }
    ]
  },
  {
    id: "cdc-3",
    title: "Salade Healthy",
    category: "Healthy",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    rating: 4.9,
    reviewsCount: 300,
    difficulty: "Facile",
    times: { prep: 10, bake: 0, rest: 0 },
    nutrition: { cal: 200, prot: 5, fat: 10, carb: 25 },
    baseServings: 2,
    tags: ["Healthy", "Frais"],
    likes: 2500,
    ingredients: [
      { id: 'i1', name: 'Mâche', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Avocat', amount: 1, unit: 'pièce' },
      { id: 'i3', name: 'Tomates cerises', amount: 150, unit: 'g' }
    ],
    utensils: ['Bol'],
    steps: [
      {
        id: 's1',
        title: 'Préparation',
        instruction: 'Couper l\'avocat et les tomates, mélanger avec la mâche.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        ingredients: ['i1', 'i2', 'i3'],
        utensils: ['Bol']
      }
    ]
  },
  {
    id: "1",
    title: "Okroshka (Soupe froide russe)",
    author: mockChefs[4],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    rating: 4.8,
    reviewsCount: 342,
    difficulty: "Facile",
    times: { prep: 20, bake: 0, rest: 120 },
    nutrition: { cal: 250, prot: 12, fat: 8, carb: 20 },
    baseServings: 4,
    tags: ["Soupe", "Frais"],
    likes: 4010,
    ingredients: [
      { id: 'i1', name: 'Pommes de terre', amount: 400, unit: 'g' },
      { id: 'i2', name: 'Oeufs', amount: 4, unit: 'pièces' },
      { id: 'i3', name: 'Radis', amount: 200, unit: 'g' },
      { id: 'i4', name: 'Concombre', amount: 300, unit: 'g' },
      { id: 'i5', name: 'Kéfir', amount: 1, unit: 'L' },
      { id: 'i6', name: 'Aneth frais', amount: 1, unit: 'botte' }
    ],
    utensils: ['Grand bol', 'Couteau d\'office', 'Planche à découper', 'Casserole'],
    steps: [
      {
        id: 's1',
        title: 'Cuisson des pommes de terre et oeufs',
        instruction: 'Faire cuire les pommes de terre et les œufs dans une casserole d\'eau bouillante. Les œufs pendant 10 min, les pommes de terre environ 20 min selon la taille. Laisser refroidir puis écaler et peler.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
        ingredients: ['i1', 'i2'],
        utensils: ['Casserole']
      },
      {
        id: 's2',
        title: 'Découpe des légumes',
        instruction: 'Couper les radis, le concombre, les pommes de terre refroidies et les œufs durs en petits dés réguliers. Ciseler finement l\'aneth.',
        image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400',
        ingredients: ['i1', 'i2', 'i3', 'i4', 'i6'],
        utensils: ['Couteau d\'office', 'Planche à découper']
      },
      {
        id: 's3',
        title: 'Mélange final',
        instruction: 'Placer tous les ingrédients hachés dans un grand bol. Verser le kéfir froid par-dessus, bien mélanger, saler et poivrer. Laisser reposer 2h au réfrigérateur avant de servir.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        ingredients: ['i5'],
        utensils: ['Grand bol']
      }
    ]
  },
  {
    id: "2",
    title: "Chilaquiles Rojos",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1640877995168-cf16027a42ab?w=800",
    rating: 4.7,
    reviewsCount: 120,
    difficulty: "Moyen",
    times: { prep: 15, bake: 10, rest: 0 },
    nutrition: { cal: 450, prot: 15, fat: 22, carb: 40 },
    baseServings: 2,
    tags: ["25 min.", "Mexicain"],
    likes: 330,
    ingredients: [
      { id: 'i1', name: 'Tortillas de maïs', amount: 8, unit: 'pièces' },
      { id: 'i2', name: 'Tomates', amount: 400, unit: 'g' },
      { id: 'i3', name: 'Piment guajillo sec', amount: 2, unit: 'pièces' },
      { id: 'i4', name: 'Oignon blanc', amount: 0.5, unit: 'pièce' },
      { id: 'i5', name: 'Ail', amount: 2, unit: 'gousses' },
      { id: 'i6', name: 'Huile neutre', amount: 3, unit: 'c. à soupe' },
      { id: 'i7', name: 'Fromage fresco émietté', amount: 50, unit: 'g' }
    ],
    utensils: ['Poêle', 'Blender', 'Casserole'],
    steps: [
      {
        id: 's1',
        title: 'Préparer la sauce roja',
        instruction: 'Faire bouillir les tomates, les piments épépinés, l\'oignon et l\'ail pendant 10 minutes. Égoutter puis mixer le tout jusqu\'à obtenir une sauce lisse.',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        ingredients: ['i2', 'i3', 'i4', 'i5'],
        utensils: ['Casserole', 'Blender']
      },
      {
        id: 's2',
        title: 'Frire les tortillas',
        instruction: 'Couper les tortillas en triangles. Dans une poêle avec de l\'huile chaude, faire frire les triangles jusqu\'à ce qu\'ils soient croustillants. Les égoutter sur du papier absorbant.',
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
        ingredients: ['i1', 'i6'],
        utensils: ['Poêle']
      },
      {
        id: 's3',
        title: 'Assembler',
        instruction: 'Verser la sauce dans la poêle, porter à frémissement. Ajouter les tortillas frites et mélanger pour les enrober. Servir chaud, garni de fromage.',
        image: 'https://images.unsplash.com/photo-1640877995168-cf16027a42ab?w=400',
        ingredients: ['i7'],
        utensils: ['Poêle']
      }
    ]
  },
  {
    id: "3",
    title: "Fraises rôties au balsamique",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    rating: 4.9,
    reviewsCount: 85,
    difficulty: "Facile",
    times: { prep: 5, bake: 15, rest: 0 },
    nutrition: { cal: 120, prot: 1, fat: 0, carb: 25 },
    baseServings: 2,
    tags: ["10 min.", "Dessert"],
    likes: 120,
    ingredients: [
      { id: 'i1', name: 'Fraises fraîches', amount: 500, unit: 'g' },
      { id: 'i2', name: 'Vinaigre balsamique', amount: 2, unit: 'c. à soupe' },
      { id: 'i3', name: 'Sucre de canne', amount: 2, unit: 'c. à soupe' },
      { id: 'i4', name: 'Poivre noir moulu', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Plat à gratin', 'Bol'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les fraises',
        instruction: 'Préchauffer le four à 200°C. Laver, équeuter et couper les fraises en deux. Les placer dans un plat à gratin.',
        image: 'https://images.unsplash.com/photo-1518623380242-d992d3c158ef?w=400',
        ingredients: ['i1'],
        utensils: ['Plat à gratin']
      },
      {
        id: 's2',
        title: 'Assaisonner',
        instruction: 'Dans un petit bol, mélanger le vinaigre balsamique, le sucre et une très légère pincée de poivre. Verser sur les fraises et bien mélanger.',
        image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=400',
        ingredients: ['i2', 'i3', 'i4'],
        utensils: ['Bol']
      },
      {
        id: 's3',
        title: 'Rôtir',
        instruction: 'Cuire au four pendant 15 minutes, jusqu\'à ce que les fraises soient fondantes et le jus sirupeux. Servir tiède avec une boule de glace vanille.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
        ingredients: [],
        utensils: []
      }
    ]
  },
  {
    id: "4",
    title: "Pâtes au pesto maison",
    author: mockChefs[2],
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
    rating: 4.8,
    reviewsCount: 1500,
    difficulty: "Facile",
    times: { prep: 10, bake: 15, rest: 0 },
    nutrition: { cal: 550, prot: 16, fat: 28, carb: 60 },
    baseServings: 2,
    tags: ["25 min.", "Rapide"],
    likes: 34300,
    ingredients: [
      { id: 'i1', name: 'Pâtes (Linguine)', amount: 250, unit: 'g' },
      { id: 'i2', name: 'Basilic frais', amount: 1, unit: 'bouquet' },
      { id: 'i3', name: 'Pignons de pin', amount: 40, unit: 'g' },
      { id: 'i4', name: 'Parmesan râpé', amount: 50, unit: 'g' },
      { id: 'i5', name: 'Ail', amount: 1, unit: 'gousse' },
      { id: 'i6', name: 'Huile d\'olive', amount: 10, unit: 'cl' }
    ],
    utensils: ['Casserole', 'Mixer plongeant', 'Bol'],
    steps: [
      {
        id: 's1',
        title: 'Cuire les pâtes',
        instruction: 'Faire bouillir un grand volume d\'eau salée. Y plonger les linguine et cuire selon les instructions du paquet (environ 10 min pour al dente).',
        image: require('../../assets/images/pesto_step1.png'),
        ingredients: ['i1'],
        utensils: ['Casserole']
      },
      {
        id: 's2',
        title: 'Préparer le pesto',
        instruction: 'Pendant ce temps, mixer le basilic lavé avec les pignons, le parmesan et l\'ail. Ajouter l\'huile d\'olive progressivement jusqu\'à obtenir une pâte homogène.',
        image: require('../../assets/images/pesto_step2.png'),
        ingredients: ['i2', 'i3', 'i4', 'i5', 'i6'],
        utensils: ['Mixer plongeant']
      },
      {
        id: 's3',
        title: 'Mélanger',
        instruction: 'Égoutter les pâtes en conservant une petite louche d\'eau de cuisson. Mélanger les pâtes avec le pesto et un peu d\'eau de cuisson pour détendre la sauce. Servir immédiatement.',
        image: require('../../assets/images/pesto_step3.png'),
        ingredients: [],
        utensils: ['Bol']
      }
    ]
  },
  {
    id: "5",
    title: "Tacos au poulet effiloché",
    author: mockChefs[5],
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
    rating: 4.6,
    reviewsCount: 300,
    difficulty: "Moyen",
    times: { prep: 15, bake: 45, rest: 0 },
    nutrition: { cal: 380, prot: 30, fat: 12, carb: 35 },
    baseServings: 4,
    tags: ["20 min.", "Mexicain"],
    likes: 1500,
    ingredients: [
      { id: 'i1', name: 'Blancs de poulet', amount: 500, unit: 'g' },
      { id: 'i2', name: 'Épices à tacos', amount: 2, unit: 'c. à soupe' },
      { id: 'i3', name: 'Bouillon de volaille', amount: 20, unit: 'cl' },
      { id: 'i4', name: 'Mini tortillas souples', amount: 12, unit: 'pièces' },
      { id: 'i5', name: 'Coriandre fraîche', amount: 0.5, unit: 'botte' },
      { id: 'i6', name: 'Oignon rouge', amount: 1, unit: 'pièce' },
      { id: 'i7', name: 'Citron vert', amount: 2, unit: 'pièces' }
    ],
    utensils: ['Cocotte', 'Deux fourchettes', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Cuire le poulet',
        instruction: 'Dans une cocotte, placer les blancs de poulet, les épices et le bouillon. Porter à ébullition, puis réduire le feu, couvrir et laisser mijoter 30 à 40 minutes.',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
        ingredients: ['i1', 'i2', 'i3'],
        utensils: ['Cocotte']
      },
      {
        id: 's2',
        title: 'Effilocher',
        instruction: 'Retirer le poulet de la cocotte (conserver le jus). À l\'aide de deux fourchettes, effilocher la viande. Remettre dans la cocotte pour enrober la viande du jus réduit.',
        image: 'https://images.unsplash.com/photo-1613514785140-5e2060193309?w=400',
        ingredients: [],
        utensils: ['Deux fourchettes']
      },
      {
        id: 's3',
        title: 'Garniture',
        instruction: 'Émincer finement l\'oignon rouge et hacher la coriandre. Réchauffer les tortillas. Garnir chaque tortilla de poulet, oignon, coriandre, et un trait de jus de citron.',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        ingredients: ['i4', 'i5', 'i6', 'i7'],
        utensils: ['Couteau']
      }
    ]
  },
  {
    id: "6",
    title: "Curry de pois chiches",
    author: mockChefs[6],
    image: "https://images.unsplash.com/photo-1565557612117-91924510baf2?w=800",
    rating: 4.8,
    reviewsCount: 410,
    difficulty: "Facile",
    times: { prep: 10, bake: 20, rest: 0 },
    nutrition: { cal: 320, prot: 14, fat: 18, carb: 30 },
    baseServings: 4,
    tags: ["30 min.", "Vegan"],
    likes: 850,
    ingredients: [
      { id: 'i1', name: 'Pois chiches en boîte', amount: 800, unit: 'g' },
      { id: 'i2', name: 'Lait de coco', amount: 40, unit: 'cl' },
      { id: 'i3', name: 'Pâte de curry jaune', amount: 2, unit: 'c. à soupe' },
      { id: 'i4', name: 'Oignon', amount: 1, unit: 'pièce' },
      { id: 'i5', name: 'Épinards frais', amount: 150, unit: 'g' },
      { id: 'i6', name: 'Huile de coco', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Sauteuse', 'Spatule en bois'],
    steps: [
      {
        id: 's1',
        title: 'Faire revenir la base',
        instruction: 'Émincer l\'oignon. Dans une sauteuse, faire fondre l\'huile de coco et y faire suer l\'oignon. Ajouter la pâte de curry et faire revenir 1 minute jusqu\'à ce que ce soit odorant.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        ingredients: ['i3', 'i4', 'i6'],
        utensils: ['Sauteuse']
      },
      {
        id: 's2',
        title: 'Mijoter',
        instruction: 'Ajouter les pois chiches rincés et égouttés, puis le lait de coco. Bien mélanger et laisser mijoter à feu doux pendant 15 minutes.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4b43b4853?w=400',
        ingredients: ['i1', 'i2'],
        utensils: ['Sauteuse']
      },
      {
        id: 's3',
        title: 'Ajouter les épinards',
        instruction: 'En fin de cuisson, incorporer les épinards frais. Remuer jusqu\'à ce qu\'ils tombent (1-2 minutes). Servir chaud avec du riz basmati.',
        image: 'https://images.unsplash.com/photo-1565557612117-91924510baf2?w=400',
        ingredients: ['i5'],
        utensils: ['Spatule en bois']
      }
    ]
  },
  {
    id: "7",
    title: "Burger végétarien maison",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800",
    rating: 4.5,
    reviewsCount: 600,
    difficulty: "Moyen",
    times: { prep: 15, bake: 15, rest: 0 },
    nutrition: { cal: 520, prot: 18, fat: 20, carb: 65 },
    baseServings: 2,
    tags: ["25 min.", "Burger"],
    likes: 2200,
    ingredients: [
      { id: 'i1', name: 'Pains burger', amount: 2, unit: 'pièces' },
      { id: 'i2', name: 'Steaks végétaux (ex: soja/blé)', amount: 2, unit: 'pièces' },
      { id: 'i3', name: 'Tomate', amount: 1, unit: 'pièce' },
      { id: 'i4', name: 'Feuilles de salade', amount: 4, unit: 'pièces' },
      { id: 'i5', name: 'Fromage à burger (ou cheddar vegan)', amount: 2, unit: 'tranches' },
      { id: 'i6', name: 'Mayonnaise', amount: 2, unit: 'c. à soupe' },
      { id: 'i7', name: 'Ketchup', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Poêle', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les garnitures',
        instruction: 'Couper la tomate en rondelles. Laver la salade. Mélanger la mayonnaise et le ketchup pour faire une sauce cocktail maison.',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400',
        ingredients: ['i3', 'i4', 'i6', 'i7'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Cuire les steaks',
        instruction: 'Faire chauffer une poêle avec un peu de matière grasse. Cuire les steaks végétaux 4 à 5 minutes par face. Ajouter la tranche de fromage sur le steak lors de la dernière minute pour la faire fondre.',
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
        ingredients: ['i2', 'i5'],
        utensils: ['Poêle']
      },
      {
        id: 's3',
        title: 'Montage',
        instruction: 'Toaster légèrement les pains. Étaler la sauce sur les deux faces. Placer la salade, le steak au fromage, puis les rondelles de tomate. Refermer le burger et servir.',
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
        ingredients: ['i1'],
        utensils: []
      }
    ]
  },
  {
    id: "8",
    title: "Pad Thaï authentique",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    rating: 4.9,
    reviewsCount: 1200,
    difficulty: "Moyen",
    times: { prep: 20, bake: 15, rest: 0 },
    nutrition: { cal: 480, prot: 25, fat: 15, carb: 60 },
    baseServings: 2,
    tags: ["35 min.", "Asiatique"],
    likes: 5400,
    ingredients: [
      { id: 'i1', name: 'Nouilles de riz plates', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Crevettes décortiquées', amount: 150, unit: 'g' },
      { id: 'i3', name: 'Tofu ferme', amount: 100, unit: 'g' },
      { id: 'i4', name: 'Oeufs', amount: 2, unit: 'pièces' },
      { id: 'i5', name: 'Pousses de soja', amount: 100, unit: 'g' },
      { id: 'i6', name: 'Sauce Pad Thaï (Tamarin, nuoc mam, sucre)', amount: 4, unit: 'c. à soupe' },
      { id: 'i7', name: 'Cacahuètes pilées', amount: 30, unit: 'g' }
    ],
    utensils: ['Wok', 'Casserole', 'Spatule'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les nouilles',
        instruction: 'Tremper les nouilles de riz dans de l\'eau tiède pendant environ 15-20 minutes jusqu\'à ce qu\'elles soient souples mais encore fermes. Égoutter.',
        image: 'https://images.unsplash.com/photo-1626804475297-41609ea0c3eb?w=400',
        ingredients: ['i1'],
        utensils: ['Casserole']
      },
      {
        id: 's2',
        title: 'Sauter au wok',
        instruction: 'Chauffer le wok avec un peu d\'huile. Faire sauter le tofu en dés et les crevettes. Pousser sur le côté et casser les œufs, brouiller rapidement.',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        ingredients: ['i2', 'i3', 'i4'],
        utensils: ['Wok', 'Spatule']
      },
      {
        id: 's3',
        title: 'Assembler',
        instruction: 'Ajouter les nouilles et la sauce. Mélanger vivement. Ajouter les pousses de soja. Servir saupoudré de cacahuètes et d\'un filet de citron vert.',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        ingredients: ['i5', 'i6', 'i7'],
        utensils: ['Wok']
      }
    ]
  },
  {
    id: "9",
    title: "Pizza Margherita au feu de bois",
    author: mockChefs[3],
    image: "https://images.unsplash.com/photo-1574071318508-1cbbab50d00c?w=800",
    rating: 4.8,
    reviewsCount: 3000,
    difficulty: "Moyen",
    times: { prep: 30, bake: 15, rest: 120 },
    nutrition: { cal: 600, prot: 25, fat: 20, carb: 80 },
    baseServings: 2,
    tags: ["1h", "Italien"],
    likes: 9800,
    ingredients: [
      { id: 'i1', name: 'Pâte à pizza', amount: 1, unit: 'boule (400g)' },
      { id: 'i2', name: 'Sauce tomate', amount: 15, unit: 'cl' },
      { id: 'i3', name: 'Mozzarella di bufala', amount: 125, unit: 'g' },
      { id: 'i4', name: 'Basilic frais', amount: 1, unit: 'poignée' },
      { id: 'i5', name: 'Huile d\'olive', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Pierre à pizza', 'Four', 'Roulette'],
    steps: [
      {
        id: 's1',
        title: 'Étaler la pâte',
        instruction: 'Préchauffer le four à sa température maximale (idéalement avec une pierre à pizza). Étaler la boule de pâte finement avec les mains sur un plan fariné.',
        image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400',
        ingredients: ['i1'],
        utensils: ['Four']
      },
      {
        id: 's2',
        title: 'Garnir',
        instruction: 'Répartir la sauce tomate sur la pâte en laissant un bord libre. Déchirer la mozzarella et la disposer dessus. Ajouter un filet d\'huile d\'olive.',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
        ingredients: ['i2', 'i3', 'i5'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuire',
        instruction: 'Enfourner la pizza. La cuisson prend entre 5 et 10 minutes selon la puissance du four. À la sortie, ajouter les feuilles de basilic frais et déguster.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cbbab50d00c?w=400',
        ingredients: ['i4'],
        utensils: ['Roulette']
      }
    ]
  },
  {
    id: "10",
    title: "Salade de pain estivale",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    rating: 4.4,
    reviewsCount: 150,
    difficulty: "Facile",
    times: { prep: 15, bake: 0, rest: 0 },
    nutrition: { cal: 350, prot: 8, fat: 12, carb: 40 },
    baseServings: 2,
    tags: ["15 min.", "Salade"],
    likes: 1540,
    ingredients: [
      { id: 'i1', name: 'Pain rassis de la veille', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Tomates cerises', amount: 250, unit: 'g' },
      { id: 'i3', name: 'Concombre', amount: 0.5, unit: 'pièce' },
      { id: 'i4', name: 'Oignon rouge', amount: 0.5, unit: 'pièce' },
      { id: 'i5', name: 'Vinaigre de vin rouge', amount: 2, unit: 'c. à soupe' },
      { id: 'i6', name: 'Huile d\'olive', amount: 4, unit: 'c. à soupe' }
    ],
    utensils: ['Saladier', 'Couteau à pain'],
    steps: [
      {
        id: 's1',
        title: 'Préparer le pain',
        instruction: 'Couper le pain rassis en gros cubes. Les faire éventuellement dorer à la poêle avec un filet d\'huile pour les rendre bien croustillants.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        ingredients: ['i1', 'i6'],
        utensils: ['Couteau à pain']
      },
      {
        id: 's2',
        title: 'Légumes',
        instruction: 'Couper les tomates en deux, trancher finement le concombre et l\'oignon rouge. Mettre le tout dans un grand saladier.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        ingredients: ['i2', 'i3', 'i4'],
        utensils: ['Saladier']
      },
      {
        id: 's3',
        title: 'Assaisonnement',
        instruction: 'Ajouter les croûtons de pain. Arroser avec l\'huile d\'olive et le vinaigre de vin rouge. Saler, poivrer et mélanger. Laisser le pain s\'imbiber 5 min avant de servir.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ingredients: ['i5'],
        utensils: []
      }
    ]
  },
  {
    id: "11",
    title: "Salade César croustillante",
    author: mockChefs[4],
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
    rating: 4.6,
    reviewsCount: 890,
    difficulty: "Moyen",
    times: { prep: 15, bake: 15, rest: 0 },
    nutrition: { cal: 500, prot: 25, fat: 35, carb: 20 },
    baseServings: 2,
    tags: ["15 min.", "Salade"],
    likes: 2100,
    ingredients: [
      { id: 'i1', name: 'Salade Romaine', amount: 1, unit: 'pièce' },
      { id: 'i2', name: 'Filets de poulet', amount: 200, unit: 'g' },
      { id: 'i3', name: 'Croûtons', amount: 50, unit: 'g' },
      { id: 'i4', name: 'Parmesan en copeaux', amount: 40, unit: 'g' },
      { id: 'i5', name: 'Sauce César', amount: 4, unit: 'c. à soupe' }
    ],
    utensils: ['Poêle', 'Saladier'],
    steps: [
      {
        id: 's1',
        title: 'Cuisson du poulet',
        instruction: 'Faire dorer les filets de poulet à la poêle, saler et poivrer. Les couper en lanières une fois cuits.',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
        ingredients: ['i2'],
        utensils: ['Poêle']
      },
      {
        id: 's2',
        title: 'Laver la salade',
        instruction: 'Laver, essorer et couper grossièrement la salade romaine. Disposer dans un saladier.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ingredients: ['i1'],
        utensils: ['Saladier']
      },
      {
        id: 's3',
        title: 'Mélange final',
        instruction: 'Ajouter le poulet tiède, les croûtons et les copeaux de parmesan sur la salade. Napper généreusement de sauce César. Mélanger au dernier moment.',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
        ingredients: ['i3', 'i4', 'i5'],
        utensils: []
      }
    ]
  },
  {
    id: "12",
    title: "Salade Quinoa et Avocat",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    rating: 4.8,
    reviewsCount: 450,
    difficulty: "Facile",
    times: { prep: 10, bake: 15, rest: 0 },
    nutrition: { cal: 380, prot: 12, fat: 18, carb: 45 },
    baseServings: 2,
    tags: ["20 min.", "Salade"],
    likes: 1250,
    ingredients: [
      { id: 'i1', name: 'Quinoa', amount: 120, unit: 'g' },
      { id: 'i2', name: 'Avocat', amount: 1, unit: 'pièce' },
      { id: 'i3', name: 'Tomates cerises', amount: 150, unit: 'g' },
      { id: 'i4', name: 'Maïs en grain', amount: 100, unit: 'g' },
      { id: 'i5', name: 'Coriandre', amount: 1, unit: 'poignée' },
      { id: 'i6', name: 'Jus de citron vert', amount: 2, unit: 'c. à soupe' }
    ],
    utensils: ['Casserole', 'Passoire', 'Bol'],
    steps: [
      {
        id: 's1',
        title: 'Cuire le quinoa',
        instruction: 'Rincer le quinoa. Le faire cuire dans 2 fois son volume d\'eau bouillante pendant 12-15 minutes. Égoutter et laisser refroidir.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400',
        ingredients: ['i1'],
        utensils: ['Casserole', 'Passoire']
      },
      {
        id: 's2',
        title: 'Couper les ingrédients',
        instruction: 'Couper l\'avocat en dés, couper les tomates cerises en deux. Hacher la coriandre fraîche.',
        image: 'https://images.unsplash.com/photo-1519996409144-56c88c9aa612?w=400',
        ingredients: ['i2', 'i3', 'i5'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Mélanger et assaisonner',
        instruction: 'Mélanger le quinoa refroidi avec l\'avocat, le maïs et les tomates. Arroser de jus de citron vert, saler, poivrer et parsemer de coriandre.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        ingredients: ['i4', 'i6'],
        utensils: ['Bol']
      }
    ]
  },
  {
    id: "13",
    title: "Salade Niçoise classique",
    author: mockChefs[5],
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800",
    rating: 4.7,
    reviewsCount: 320,
    difficulty: "Moyen",
    times: { prep: 20, bake: 15, rest: 0 },
    nutrition: { cal: 420, prot: 20, fat: 22, carb: 25 },
    baseServings: 2,
    tags: ["25 min.", "Salade"],
    likes: 890,
    ingredients: [
      { id: 'i1', name: 'Thon au naturel', amount: 150, unit: 'g' },
      { id: 'i2', name: 'Tomates', amount: 3, unit: 'pièces' },
      { id: 'i3', name: 'Oeufs durs', amount: 2, unit: 'pièces' },
      { id: 'i4', name: 'Haricots verts', amount: 100, unit: 'g' },
      { id: 'i5', name: 'Olives noires de Nice', amount: 50, unit: 'g' },
      { id: 'i6', name: 'Anchois', amount: 4, unit: 'filets' },
      { id: 'i7', name: 'Vinaigrette à l\'huile d\'olive', amount: 4, unit: 'c. à soupe' }
    ],
    utensils: ['Casserole', 'Grand plat plat'],
    steps: [
      {
        id: 's1',
        title: 'Cuisson des légumes et œufs',
        instruction: 'Faire cuire les œufs (10 min) et blanchir les haricots verts (8 min). Les passer sous l\'eau froide, puis écaler les œufs.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
        ingredients: ['i3', 'i4'],
        utensils: ['Casserole']
      },
      {
        id: 's2',
        title: 'Préparer la base',
        instruction: 'Couper les tomates en quartiers et les disposer dans un grand plat. Émietter le thon au centre.',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
        ingredients: ['i1', 'i2'],
        utensils: ['Grand plat plat']
      },
      {
        id: 's3',
        title: 'Disposer les ingrédients',
        instruction: 'Ajouter les haricots verts, les œufs coupés en quartiers, les olives et les anchois. Arroser généreusement de vinaigrette avant de servir.',
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400',
        ingredients: ['i5', 'i6', 'i7'],
        utensils: []
      }
    ]
  },
  {
    id: "14",
    title: "Bowl d'été à la pastèque",
    author: mockChefs[6],
    image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=800",
    rating: 4.8,
    reviewsCount: 120,
    difficulty: "Facile",
    times: { prep: 10, bake: 0, rest: 0 },
    nutrition: { cal: 220, prot: 6, fat: 12, carb: 22 },
    baseServings: 2,
    tags: ["10 min.", "Frais"],
    likes: 450,
    ingredients: [
      { id: 'i1', name: 'Pastèque', amount: 400, unit: 'g' },
      { id: 'i2', name: 'Feta', amount: 100, unit: 'g' },
      { id: 'i3', name: 'Menthe fraîche', amount: 1, unit: 'poignée' },
      { id: 'i4', name: 'Pistaches concassées', amount: 30, unit: 'g' },
      { id: 'i5', name: 'Jus de citron', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Saladier', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Préparer la pastèque',
        instruction: 'Couper la chair de la pastèque en gros dés réguliers, en retirant les pépins si possible.',
        image: 'https://images.unsplash.com/photo-1589533610925-1c8c5a8947ee?w=400',
        ingredients: ['i1'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Ajouter la feta',
        instruction: 'Émietter grossièrement la feta au-dessus des cubes de pastèque. Ajouter les feuilles de menthe déchirées.',
        image: 'https://images.unsplash.com/photo-1559564114-601e1eeec52e?w=400',
        ingredients: ['i2', 'i3'],
        utensils: []
      },
      {
        id: 's3',
        title: 'La touche finale',
        instruction: 'Parsemer de pistaches concassées pour le croquant et arroser d\'un filet de citron. Déguster bien frais.',
        image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400',
        ingredients: ['i4', 'i5'],
        utensils: ['Saladier']
      }
    ]
  },
  {
    id: "15",
    title: "Salade Grecque Feta Olives",
    author: mockChefs[3],
    image: "https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?w=800",
    rating: 4.6,
    reviewsCount: 780,
    difficulty: "Facile",
    times: { prep: 15, bake: 0, rest: 0 },
    nutrition: { cal: 320, prot: 8, fat: 25, carb: 15 },
    baseServings: 2,
    tags: ["15 min.", "Salade"],
    likes: 3400,
    ingredients: [
      { id: 'i1', name: 'Tomates rondes', amount: 4, unit: 'pièces' },
      { id: 'i2', name: 'Concombre', amount: 1, unit: 'pièce' },
      { id: 'i3', name: 'Oignon rouge', amount: 1, unit: 'pièce' },
      { id: 'i4', name: 'Feta', amount: 150, unit: 'g' },
      { id: 'i5', name: 'Olives Kalamata', amount: 80, unit: 'g' },
      { id: 'i6', name: 'Huile d\'olive vierge extra', amount: 4, unit: 'c. à soupe' },
      { id: 'i7', name: 'Origan séché', amount: 1, unit: 'c. à café' }
    ],
    utensils: ['Grand bol', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Tailler les légumes',
        instruction: 'Couper les tomates en morceaux rustiques, le concombre en demi-rondelles et l\'oignon rouge en fines lamelles.',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
        ingredients: ['i1', 'i2', 'i3'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Mélanger',
        instruction: 'Dans un grand bol, mélanger doucement les légumes avec les olives. Ajouter l\'huile d\'olive, saler légèrement.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        ingredients: ['i5', 'i6'],
        utensils: ['Grand bol']
      },
      {
        id: 's3',
        title: 'Dresser avec la feta',
        instruction: 'Déposer la feta entière ou en gros cubes sur le dessus. Saupoudrer d\'origan séché. Servir immédiatement.',
        image: 'https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?w=400',
        ingredients: ['i4', 'i7'],
        utensils: []
      }
    ]
  },
  {
    id: "16",
    title: "Salade Caprese tomates mozza",
    author: mockChefs[2],
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800",
    rating: 4.9,
    reviewsCount: 1400,
    difficulty: "Très facile",
    times: { prep: 10, bake: 0, rest: 0 },
    nutrition: { cal: 280, prot: 14, fat: 20, carb: 8 },
    baseServings: 2,
    tags: ["10 min.", "Frais"],
    likes: 6700,
    ingredients: [
      { id: 'i1', name: 'Tomates cœur de bœuf', amount: 2, unit: 'pièces' },
      { id: 'i2', name: 'Mozzarella di bufala', amount: 250, unit: 'g' },
      { id: 'i3', name: 'Basilic frais', amount: 1, unit: 'bouquet' },
      { id: 'i4', name: 'Huile d\'olive', amount: 3, unit: 'c. à soupe' },
      { id: 'i5', name: 'Crème de vinaigre balsamique', amount: 1, unit: 'filet' }
    ],
    utensils: ['Assiette plate', 'Couteau tranchant'],
    steps: [
      {
        id: 's1',
        title: 'Couper la mozzarella et les tomates',
        instruction: 'Trancher les tomates et la mozzarella en rondelles régulières de 5 mm d\'épaisseur environ.',
        image: 'https://images.unsplash.com/photo-1528699636255-738b939f863b?w=400',
        ingredients: ['i1', 'i2'],
        utensils: ['Couteau tranchant']
      },
      {
        id: 's2',
        title: 'Dressage',
        instruction: 'Disposer en rosace ou en ligne sur une assiette plate, en alternant une tranche de tomate, une tranche de mozzarella, et une feuille de basilic.',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
        ingredients: ['i3'],
        utensils: ['Assiette plate']
      },
      {
        id: 's3',
        title: 'Assaisonner',
        instruction: 'Verser un généreux filet d\'huile d\'olive et un peu de crème de vinaigre balsamique. Parsemer de fleur de sel et de poivre moulu.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ingredients: ['i4', 'i5'],
        utensils: []
      }
    ]
  },
  {
    id: "17",
    title: "Salade exotique mangue crevettes",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    rating: 4.7,
    reviewsCount: 300,
    difficulty: "Facile",
    times: { prep: 20, bake: 0, rest: 0 },
    nutrition: { cal: 310, prot: 20, fat: 15, carb: 25 },
    baseServings: 2,
    tags: ["20 min.", "Salade"],
    likes: 1100,
    ingredients: [
      { id: 'i1', name: 'Crevettes cuites', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Mangue bien mûre', amount: 1, unit: 'pièce' },
      { id: 'i3', name: 'Avocat', amount: 1, unit: 'pièce' },
      { id: 'i4', name: 'Coriandre', amount: 0.5, unit: 'botte' },
      { id: 'i5', name: 'Citron vert (jus)', amount: 1, unit: 'pièce' },
      { id: 'i6', name: 'Piment doux (optionnel)', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Bol', 'Planche à découper'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les fruits',
        instruction: 'Éplucher la mangue et l\'avocat, puis les couper en petits dés. Arroser immédiatement l\'avocat de jus de citron vert pour éviter qu\'il noircisse.',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400',
        ingredients: ['i2', 'i3', 'i5'],
        utensils: ['Planche à découper']
      },
      {
        id: 's2',
        title: 'Préparer les crevettes',
        instruction: 'Décortiquer les crevettes si ce n\'est pas déjà fait. Les couper en deux si elles sont très grosses.',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400',
        ingredients: ['i1'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Mélanger',
        instruction: 'Mélanger délicatement tous les ingrédients dans un bol. Ajouter la coriandre ciselée, un peu de piment et rectifier l\'assaisonnement.',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
        ingredients: ['i4', 'i6'],
        utensils: ['Bol']
      }
    ]
  },
  {
    id: "18",
    title: "Tarte aux asperges printanière",
    author: mockChefs[3],
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800",
    rating: 4.6,
    reviewsCount: 250,
    difficulty: "Moyen",
    times: { prep: 20, bake: 30, rest: 0 },
    nutrition: { cal: 420, prot: 12, fat: 28, carb: 35 },
    baseServings: 4,
    tags: ["50 min.", "Saison"],
    likes: 890,
    ingredients: [
      { id: 'i1', name: 'Pâte feuilletée', amount: 1, unit: 'rouleau' },
      { id: 'i2', name: 'Asperges vertes', amount: 400, unit: 'g' },
      { id: 'i3', name: 'Crème fraîche épaisse', amount: 15, unit: 'cl' },
      { id: 'i4', name: 'Moutarde à l\'ancienne', amount: 2, unit: 'c. à soupe' },
      { id: 'i5', name: 'Fromage râpé (Gruyère)', amount: 100, unit: 'g' }
    ],
    utensils: ['Plaque de four', 'Économe'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les asperges',
        instruction: 'Laver et couper le bout dur des asperges. Les blanchir 3 minutes dans l\'eau bouillante salée, puis les plonger dans l\'eau glacée pour fixer la couleur.',
        image: 'https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=400',
        ingredients: ['i2'],
        utensils: ['Économe']
      },
      {
        id: 's2',
        title: 'Préparer le fond de tarte',
        instruction: 'Dérouler la pâte sur une plaque. Mélanger la crème et la moutarde, puis étaler ce mélange sur le fond de pâte en laissant un bord de 2 cm.',
        image: 'https://images.unsplash.com/photo-1560963689-56891eb29db5?w=400',
        ingredients: ['i1', 'i3', 'i4'],
        utensils: ['Plaque de four']
      },
      {
        id: 's3',
        title: 'Garnir et cuire',
        instruction: 'Aligner les asperges sur la crème. Saupoudrer de fromage râpé. Cuire au four à 200°C pendant environ 25-30 minutes, jusqu\'à ce que la pâte soit dorée.',
        image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400',
        ingredients: ['i5'],
        utensils: []
      }
    ]
  },
  {
    id: "19",
    title: "Risotto aux asperges vertes",
    author: mockChefs[4],
    image: "https://images.unsplash.com/photo-1633337474563-1d0fa4f6ea8a?w=800",
    rating: 4.8,
    reviewsCount: 540,
    difficulty: "Moyen",
    times: { prep: 15, bake: 25, rest: 0 },
    nutrition: { cal: 480, prot: 14, fat: 16, carb: 68 },
    baseServings: 2,
    tags: ["40 min.", "Saison"],
    likes: 3100,
    ingredients: [
      { id: 'i1', name: 'Riz Arborio', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Asperges vertes', amount: 300, unit: 'g' },
      { id: 'i3', name: 'Bouillon de légumes', amount: 75, unit: 'cl' },
      { id: 'i4', name: 'Vin blanc sec', amount: 10, unit: 'cl' },
      { id: 'i5', name: 'Oignon', amount: 1, unit: 'pièce' },
      { id: 'i6', name: 'Parmesan râpé', amount: 40, unit: 'g' },
      { id: 'i7', name: 'Beurre', amount: 20, unit: 'g' }
    ],
    utensils: ['Casserole large', 'Louche', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les asperges',
        instruction: 'Couper les têtes d\'asperges et les réserver. Couper les tiges en petits tronçons. Chauffer le bouillon.',
        image: 'https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=400',
        ingredients: ['i2', 'i3'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Nacrer le riz',
        instruction: 'Faire revenir l\'oignon haché dans du beurre. Ajouter le riz et remuer 2 minutes jusqu\'à ce qu\'il soit translucide. Déglacer au vin blanc.',
        image: 'https://images.unsplash.com/photo-1633337474563-1d0fa4f6ea8a?w=400',
        ingredients: ['i1', 'i4', 'i5', 'i7'],
        utensils: ['Casserole large']
      },
      {
        id: 's3',
        title: 'Cuisson du risotto',
        instruction: 'Ajouter le bouillon louche par louche, en attendant que le liquide soit absorbé. À mi-cuisson, ajouter les tronçons d\'asperges. En fin de cuisson, ajouter les têtes et le parmesan.',
        image: 'https://images.unsplash.com/photo-1633337474563-1d0fa4f6ea8a?w=400',
        ingredients: ['i6'],
        utensils: ['Louche']
      }
    ]
  },
  {
    id: "20",
    title: "Velouté d'asperges blanches",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1548943487-a2e4b43b4853?w=800",
    rating: 4.7,
    reviewsCount: 180,
    difficulty: "Facile",
    times: { prep: 10, bake: 20, rest: 0 },
    nutrition: { cal: 210, prot: 5, fat: 12, carb: 18 },
    baseServings: 2,
    tags: ["30 min.", "Soupe"],
    likes: 750,
    ingredients: [
      { id: 'i1', name: 'Asperges blanches', amount: 500, unit: 'g' },
      { id: 'i2', name: 'Pomme de terre', amount: 1, unit: 'pièce' },
      { id: 'i3', name: 'Bouillon de volaille', amount: 50, unit: 'cl' },
      { id: 'i4', name: 'Crème liquide', amount: 10, unit: 'cl' },
      { id: 'i5', name: 'Sel, poivre, muscade', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Économe', 'Cocotte', 'Mixer plongeant'],
    steps: [
      {
        id: 's1',
        title: 'Éplucher',
        instruction: 'Éplucher soigneusement les asperges blanches de haut en bas et couper le pied dur. Éplucher la pomme de terre et la couper en cubes.',
        image: 'https://images.unsplash.com/photo-1596489370806-1bc00941a3bc?w=400',
        ingredients: ['i1', 'i2'],
        utensils: ['Économe']
      },
      {
        id: 's2',
        title: 'Cuire',
        instruction: 'Mettre les légumes dans une cocotte, couvrir de bouillon. Porter à ébullition et cuire environ 20 minutes.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4b43b4853?w=400',
        ingredients: ['i3'],
        utensils: ['Cocotte']
      },
      {
        id: 's3',
        title: 'Mixer',
        instruction: 'Mixer finement le tout. Ajouter la crème, une pointe de muscade, sel et poivre. Servir chaud.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4b43b4853?w=400',
        ingredients: ['i4', 'i5'],
        utensils: ['Mixer plongeant']
      }
    ]
  },
  {
    id: "21",
    title: "Asperges rôties au parmesan",
    author: mockChefs[5],
    image: "https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=800",
    rating: 4.9,
    reviewsCount: 880,
    difficulty: "Très facile",
    times: { prep: 5, bake: 10, rest: 0 },
    nutrition: { cal: 150, prot: 8, fat: 10, carb: 5 },
    baseServings: 2,
    tags: ["15 min.", "Saison"],
    likes: 4500,
    ingredients: [
      { id: 'i1', name: 'Asperges vertes', amount: 1, unit: 'botte' },
      { id: 'i2', name: 'Huile d\'olive', amount: 2, unit: 'c. à soupe' },
      { id: 'i3', name: 'Parmesan râpé', amount: 30, unit: 'g' },
      { id: 'i4', name: 'Ail en poudre', amount: 1, unit: 'c. à café' },
      { id: 'i5', name: 'Fleur de sel', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Plaque de cuisson', 'Papier sulfurisé'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les asperges',
        instruction: 'Casser le bout rigide des asperges (il se casse naturellement au bon endroit). Les déposer sur une plaque recouverte de papier cuisson.',
        image: 'https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=400',
        ingredients: ['i1'],
        utensils: ['Plaque de cuisson']
      },
      {
        id: 's2',
        title: 'Assaisonner',
        instruction: 'Arroser d\'huile d\'olive, saupoudrer d\'ail en poudre, de fleur de sel et répartir le parmesan de façon homogène.',
        image: 'https://images.unsplash.com/photo-1516053896594-5b4819d4b684?w=400',
        ingredients: ['i2', 'i3', 'i4', 'i5'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Rôtir',
        instruction: 'Enfourner à 200°C pour 10 à 12 minutes, jusqu\'à ce que le fromage soit doré et les asperges tendres.',
        image: 'https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=400',
        ingredients: [],
        utensils: []
      }
    ]
  },
  {
    id: "22",
    title: "Pâtes au saumon et asperges",
    author: mockChefs[6],
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
    rating: 4.8,
    reviewsCount: 600,
    difficulty: "Moyen",
    times: { prep: 10, bake: 15, rest: 0 },
    nutrition: { cal: 550, prot: 26, fat: 22, carb: 58 },
    baseServings: 2,
    tags: ["25 min.", "Rapide"],
    likes: 2300,
    ingredients: [
      { id: 'i1', name: 'Pâtes penne', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Saumon frais', amount: 200, unit: 'g' },
      { id: 'i3', name: 'Asperges vertes', amount: 150, unit: 'g' },
      { id: 'i4', name: 'Crème fraîche', amount: 15, unit: 'cl' },
      { id: 'i5', name: 'Aneth', amount: 1, unit: 'brin' }
    ],
    utensils: ['Casserole', 'Poêle profonde'],
    steps: [
      {
        id: 's1',
        title: 'Cuire pâtes et asperges',
        instruction: 'Cuire les pâtes dans l\'eau bouillante. Les 3 dernières minutes, ajouter les asperges coupées en tronçons dans la même casserole.',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
        ingredients: ['i1', 'i3'],
        utensils: ['Casserole']
      },
      {
        id: 's2',
        title: 'Cuire le saumon',
        instruction: 'Dans une poêle, faire dorer les dés de saumon pendant 2-3 minutes. Ajouter la crème et laisser frémir doucement.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        ingredients: ['i2', 'i4'],
        utensils: ['Poêle profonde']
      },
      {
        id: 's3',
        title: 'Mélanger',
        instruction: 'Égoutter les pâtes et asperges, puis les mélanger à la sauce au saumon. Parsemer d\'aneth frais, poivrer et servir.',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
        ingredients: ['i5'],
        utensils: []
      }
    ]
  },
  {
    id: "23",
    title: "Oeuf poché sur lit d'asperges",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
    rating: 4.6,
    reviewsCount: 340,
    difficulty: "Moyen",
    times: { prep: 10, bake: 10, rest: 0 },
    nutrition: { cal: 220, prot: 14, fat: 16, carb: 6 },
    baseServings: 2,
    tags: ["20 min.", "Brunch"],
    likes: 1800,
    ingredients: [
      { id: 'i1', name: 'Asperges vertes', amount: 300, unit: 'g' },
      { id: 'i2', name: 'Oeufs extra frais', amount: 2, unit: 'pièces' },
      { id: 'i3', name: 'Vinaigre blanc', amount: 1, unit: 'c. à soupe' },
      { id: 'i4', name: 'Huile d\'olive', amount: 1, unit: 'c. à soupe' },
      { id: 'i5', name: 'Poivre noir', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Casserole d\'eau frémissante', 'Poêle'],
    steps: [
      {
        id: 's1',
        title: 'Cuire les asperges',
        instruction: 'Faire revenir les asperges à la poêle avec l\'huile d\'olive à feu moyen pendant 8-10 min pour les garder croquantes. Réserver au chaud.',
        image: 'https://images.unsplash.com/photo-1554486847-a8b417bd868b?w=400',
        ingredients: ['i1', 'i4'],
        utensils: ['Poêle']
      },
      {
        id: 's2',
        title: 'Pocher les oeufs',
        instruction: 'Faire frémir l\'eau avec le vinaigre. Créer un tourbillon, y casser délicatement l\'œuf et cuire 3 minutes. Sortir à l\'écumoire.',
        image: 'https://images.unsplash.com/photo-1516824711718-9c1e687920ca?w=400',
        ingredients: ['i2', 'i3'],
        utensils: ['Casserole d\'eau frémissante']
      },
      {
        id: 's3',
        title: 'Dressage',
        instruction: 'Disposer les asperges en fagot sur l\'assiette, déposer l\'œuf poché dessus, poivrer généreusement et servir.',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
        ingredients: ['i5'],
        utensils: []
      }
    ]
  },
  {
    id: "24",
    title: "Asperges grillées sauce hollandaise",
    author: mockChefs[2],
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800",
    rating: 4.8,
    reviewsCount: 420,
    difficulty: "Difficile",
    times: { prep: 15, bake: 5, rest: 0 },
    nutrition: { cal: 350, prot: 6, fat: 34, carb: 8 },
    baseServings: 2,
    tags: ["20 min.", "Saison"],
    likes: 900,
    ingredients: [
      { id: 'i1', name: 'Asperges', amount: 1, unit: 'botte' },
      { id: 'i2', name: 'Jaunes d\'oeufs', amount: 2, unit: 'pièces' },
      { id: 'i3', name: 'Beurre fondu', amount: 100, unit: 'g' },
      { id: 'i4', name: 'Jus de citron', amount: 1, unit: 'c. à soupe' },
      { id: 'i5', name: 'Huile (pour griller)', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Poêle grill', 'Bain-marie', 'Fouet'],
    steps: [
      {
        id: 's1',
        title: 'Griller les asperges',
        instruction: 'Huiler légèrement les asperges et les cuire sur une poêle grill bien chaude pendant 5-6 min, en les retournant.',
        image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400',
        ingredients: ['i1', 'i5'],
        utensils: ['Poêle grill']
      },
      {
        id: 's2',
        title: 'Sauce hollandaise - Base',
        instruction: 'Dans un cul-de-poule au bain-marie, fouetter les jaunes d\'œufs avec une cuillère d\'eau et le jus de citron jusqu\'à ce que ça devienne mousseux.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
        ingredients: ['i2', 'i4'],
        utensils: ['Bain-marie', 'Fouet']
      },
      {
        id: 's3',
        title: 'Sauce hollandaise - Émulsion',
        instruction: 'Incorporer petit à petit le beurre fondu chaud en fouettant continuellement pour créer l\'émulsion. Servir immédiatement sur les asperges.',
        image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400',
        ingredients: ['i3'],
        utensils: ['Fouet']
      }
    ]
  },
  {
    id: "25",
    title: "Tartelette chèvre et asperges",
    author: mockChefs[3],
    image: "https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=800",
    rating: 4.5,
    reviewsCount: 310,
    difficulty: "Moyen",
    times: { prep: 15, bake: 30, rest: 0 },
    nutrition: { cal: 380, prot: 10, fat: 22, carb: 30 },
    baseServings: 2,
    tags: ["45 min.", "Saison"],
    likes: 1450,
    ingredients: [
      { id: 'i1', name: 'Pâte brisée', amount: 1, unit: 'rouleau' },
      { id: 'i2', name: 'Bûche de chèvre', amount: 100, unit: 'g' },
      { id: 'i3', name: 'Petites asperges vertes', amount: 12, unit: 'pièces' },
      { id: 'i4', name: 'Miel', amount: 1, unit: 'c. à soupe' },
      { id: 'i5', name: 'Thym frais', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Moules à tartelette', 'Four'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les fonds',
        instruction: 'Foncer la pâte dans des moules à tartelette, piquer le fond et précuire à blanc 10 min à 180°C.',
        image: 'https://images.unsplash.com/photo-1560963689-56891eb29db5?w=400',
        ingredients: ['i1'],
        utensils: ['Moules à tartelette']
      },
      {
        id: 's2',
        title: 'Garnir',
        instruction: 'Répartir le fromage de chèvre en tranches au fond des tartelettes. Disposer les petites asperges (pointes) par-dessus.',
        image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=400',
        ingredients: ['i2', 'i3'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuire et dorer',
        instruction: 'Ajouter un filet de miel et du thym. Remettre au four 20 min jusqu\'à ce que le chèvre soit bien doré.',
        image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=400',
        ingredients: ['i4', 'i5'],
        utensils: ['Four']
      }
    ]
  },
  {
    id: "26",
    title: "Frites de patates douces au Air Fryer",
    author: mockChefs[2],
    image: "https://images.unsplash.com/photo-1596693598501-fbe5d87042cb?w=800",
    rating: 4.8,
    reviewsCount: 1200,
    difficulty: "Facile",
    times: { prep: 10, bake: 15, rest: 0 },
    nutrition: { cal: 210, prot: 2, fat: 7, carb: 35 },
    baseServings: 2,
    tags: ["25 min.", "Air Fryer"],
    likes: 4200,
    ingredients: [
      { id: 'i1', name: 'Patate douce', amount: 1, unit: 'grosse' },
      { id: 'i2', name: 'Huile végétale', amount: 1, unit: 'c. à soupe' },
      { id: 'i3', name: 'Fécule de maïs', amount: 1, unit: 'c. à soupe' },
      { id: 'i4', name: 'Paprika fumé', amount: 1, unit: 'c. à café' },
      { id: 'i5', name: 'Sel', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Air Fryer', 'Bol', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Tailler les frites',
        instruction: 'Éplucher la patate douce et la couper en bâtonnets réguliers (pas trop épais pour plus de croustillant).',
        image: 'https://images.unsplash.com/photo-1596693598501-fbe5d87042cb?w=400',
        ingredients: ['i1'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Enrober',
        instruction: 'Dans un bol, mélanger les frites avec la fécule de maïs (c\'est le secret du croustillant), l\'huile, le paprika et le sel.',
        image: 'https://images.unsplash.com/photo-1615486171447-97d8ebf9b360?w=400',
        ingredients: ['i2', 'i3', 'i4', 'i5'],
        utensils: ['Bol']
      },
      {
        id: 's3',
        title: 'Cuisson Air Fryer',
        instruction: 'Placer dans le panier du Air Fryer sans trop les superposer. Cuire à 200°C pendant 12-15 min, en secouant à mi-cuisson.',
        image: 'https://images.unsplash.com/photo-1596693598501-fbe5d87042cb?w=400',
        ingredients: [],
        utensils: ['Air Fryer']
      }
    ]
  },
  {
    id: "27",
    title: "Poulet croustillant Air Fryer",
    author: mockChefs[3],
    image: "https://images.unsplash.com/photo-1626082895617-2c6cdd09c13b?w=800",
    rating: 4.7,
    reviewsCount: 950,
    difficulty: "Moyen",
    times: { prep: 15, bake: 15, rest: 0 },
    nutrition: { cal: 320, prot: 30, fat: 12, carb: 18 },
    baseServings: 2,
    tags: ["30 min.", "Air Fryer"],
    likes: 4500,
    ingredients: [
      { id: 'i1', name: 'Filets de poulet', amount: 300, unit: 'g' },
      { id: 'i2', name: 'Chapelure Panko', amount: 60, unit: 'g' },
      { id: 'i3', name: 'Farine', amount: 30, unit: 'g' },
      { id: 'i4', name: 'Oeuf', amount: 1, unit: 'pièce' },
      { id: 'i5', name: 'Spray d\'huile', amount: 1, unit: 'pschitt' }
    ],
    utensils: ['Air Fryer', '3 Assiettes creuses'],
    steps: [
      {
        id: 's1',
        title: 'Préparer la panure',
        instruction: 'Préparer 3 assiettes : farine, œuf battu, et panko assaisonné (sel, poivre). Couper le poulet en grosses aiguillettes.',
        image: 'https://images.unsplash.com/photo-1626082895617-2c6cdd09c13b?w=400',
        ingredients: ['i1', 'i2', 'i3', 'i4'],
        utensils: ['3 Assiettes creuses']
      },
      {
        id: 's2',
        title: 'Paner',
        instruction: 'Passer chaque morceau de poulet dans la farine, puis l\'œuf, puis la chapelure Panko en appuyant bien pour qu\'elle adhère.',
        image: 'https://images.unsplash.com/photo-1615486171447-97d8ebf9b360?w=400',
        ingredients: [],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuisson',
        instruction: 'Vaporiser un peu d\'huile sur le poulet. Placer au Air Fryer à 190°C pour 12 à 15 minutes, jusqu\'à ce que ce soit bien doré.',
        image: 'https://images.unsplash.com/photo-1626082895617-2c6cdd09c13b?w=400',
        ingredients: ['i5'],
        utensils: ['Air Fryer']
      }
    ]
  },
  {
    id: "28",
    title: "Saumon teriyaki Air Fryer",
    author: mockChefs[2],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    rating: 4.9,
    reviewsCount: 780,
    difficulty: "Facile",
    times: { prep: 5, bake: 12, rest: 15 },
    nutrition: { cal: 380, prot: 32, fat: 22, carb: 8 },
    baseServings: 2,
    tags: ["17 min.", "Air Fryer"],
    likes: 2300,
    ingredients: [
      { id: 'i1', name: 'Pavés de saumon', amount: 2, unit: 'pièces' },
      { id: 'i2', name: 'Sauce soja', amount: 3, unit: 'c. à soupe' },
      { id: 'i3', name: 'Sirop d\'érable ou miel', amount: 1, unit: 'c. à soupe' },
      { id: 'i4', name: 'Gingembre frais râpé', amount: 1, unit: 'c. à café' },
      { id: 'i5', name: 'Graines de sésame', amount: 1, unit: 'c. à soupe' }
    ],
    utensils: ['Air Fryer', 'Bol', 'Papier cuisson'],
    steps: [
      {
        id: 's1',
        title: 'Marinade',
        instruction: 'Dans un petit bol, mélanger la sauce soja, le sirop d\'érable et le gingembre. Faire mariner le saumon dedans pendant 15 minutes.',
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=400',
        ingredients: ['i2', 'i3', 'i4'],
        utensils: ['Bol']
      },
      {
        id: 's2',
        title: 'Préparer le Air Fryer',
        instruction: 'Mettre un morceau de papier cuisson percé dans le fond du panier pour éviter que ça ne colle. Y déposer les pavés égouttés.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        ingredients: ['i1'],
        utensils: ['Air Fryer', 'Papier cuisson']
      },
      {
        id: 's3',
        title: 'Cuisson',
        instruction: 'Cuire à 180°C pendant 8 à 10 minutes selon l\'épaisseur. Napper du reste de marinade chauffée et parsemer de sésame avant de servir.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        ingredients: ['i5'],
        utensils: []
      }
    ]
  },
  {
    id: "29",
    title: "Ailes de poulet épicées",
    author: mockChefs[5],
    image: "https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=800",
    rating: 4.8,
    reviewsCount: 1500,
    difficulty: "Moyen",
    times: { prep: 5, bake: 20, rest: 0 },
    nutrition: { cal: 450, prot: 25, fat: 35, carb: 5 },
    baseServings: 2,
    tags: ["25 min.", "Air Fryer"],
    likes: 6700,
    ingredients: [
      { id: 'i1', name: 'Ailes de poulet', amount: 500, unit: 'g' },
      { id: 'i2', name: 'Levure chimique', amount: 1, unit: 'c. à soupe' },
      { id: 'i3', name: 'Paprika et poudre d\'ail', amount: 2, unit: 'c. à café' },
      { id: 'i4', name: 'Sauce piquante (type Frank\'s)', amount: 4, unit: 'c. à soupe' },
      { id: 'i5', name: 'Beurre fondu', amount: 20, unit: 'g' }
    ],
    utensils: ['Air Fryer', 'Grand bol'],
    steps: [
      {
        id: 's1',
        title: 'Sécher et assaisonner',
        instruction: 'Bien éponger les ailes avec du papier absorbant. Les mélanger avec la levure (astuce pour la peau croustillante) et les épices sèches.',
        image: 'https://images.unsplash.com/photo-1615486171447-97d8ebf9b360?w=400',
        ingredients: ['i1', 'i2', 'i3'],
        utensils: []
      },
      {
        id: 's2',
        title: 'Cuisson',
        instruction: 'Cuire au Air Fryer à 200°C pendant 20 minutes, en les retournant à mi-cuisson. Elles doivent être bien croustillantes et dorées.',
        image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=400',
        ingredients: [],
        utensils: ['Air Fryer']
      },
      {
        id: 's3',
        title: 'La sauce',
        instruction: 'Mélanger la sauce piquante et le beurre fondu. Enrober les ailes chaudes de cette sauce et déguster immédiatement.',
        image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=400',
        ingredients: ['i4', 'i5'],
        utensils: ['Grand bol']
      }
    ]
  },
  {
    id: "30",
    title: "Choux de Bruxelles croustillants",
    author: mockChefs[6],
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800",
    rating: 4.5,
    reviewsCount: 300,
    difficulty: "Facile",
    times: { prep: 5, bake: 15, rest: 0 },
    nutrition: { cal: 180, prot: 6, fat: 12, carb: 14 },
    baseServings: 2,
    tags: ["20 min.", "Air Fryer"],
    likes: 1200,
    ingredients: [
      { id: 'i1', name: 'Choux de Bruxelles', amount: 300, unit: 'g' },
      { id: 'i2', name: 'Huile d\'olive', amount: 1, unit: 'c. à soupe' },
      { id: 'i3', name: 'Lardons', amount: 50, unit: 'g' },
      { id: 'i4', name: 'Miel', amount: 1, unit: 'c. à café' },
      { id: 'i5', name: 'Sel et poivre', amount: 1, unit: 'pincée' }
    ],
    utensils: ['Air Fryer', 'Couteau'],
    steps: [
      {
        id: 's1',
        title: 'Préparer les choux',
        instruction: 'Laver les choux, couper la base et retirer les premières feuilles abîmées. Les couper en deux.',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
        ingredients: ['i1'],
        utensils: ['Couteau']
      },
      {
        id: 's2',
        title: 'Assaisonner',
        instruction: 'Mélanger les choux de Bruxelles avec l\'huile d\'olive, le sel et le poivre. Ajouter les lardons crus.',
        image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=400',
        ingredients: ['i2', 'i3', 'i5'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuisson',
        instruction: 'Cuire au Air Fryer à 190°C pendant 12 à 15 minutes. Les choux doivent être grillés. Ajouter un filet de miel à la sortie.',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
        ingredients: ['i4'],
        utensils: ['Air Fryer']
      }
    ]
  },
  {
    id: "31",
    title: "Crevettes panko Air Fryer",
    author: mockChefs[1],
    image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800",
    rating: 4.8,
    reviewsCount: 650,
    difficulty: "Moyen",
    times: { prep: 10, bake: 8, rest: 0 },
    nutrition: { cal: 280, prot: 24, fat: 10, carb: 22 },
    baseServings: 2,
    tags: ["15 min.", "Air Fryer"],
    likes: 3400,
    ingredients: [
      { id: 'i1', name: 'Grosses crevettes crues décortiquées', amount: 15, unit: 'pièces' },
      { id: 'i2', name: 'Chapelure Panko', amount: 50, unit: 'g' },
      { id: 'i3', name: 'Farine', amount: 20, unit: 'g' },
      { id: 'i4', name: 'Oeuf', amount: 1, unit: 'pièce' },
      { id: 'i5', name: 'Huile en spray', amount: 1, unit: 'pschitt' }
    ],
    utensils: ['Air Fryer', '3 Bols'],
    steps: [
      {
        id: 's1',
        title: 'Préparer la panure',
        instruction: 'Préparer trois bols : un avec la farine, un avec l\'œuf battu, un avec le panko.',
        image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400',
        ingredients: ['i2', 'i3', 'i4'],
        utensils: ['3 Bols']
      },
      {
        id: 's2',
        title: 'Paner les crevettes',
        instruction: 'Tremper chaque crevette dans la farine, puis l\'œuf, puis le panko en appuyant bien.',
        image: 'https://images.unsplash.com/photo-1615486171447-97d8ebf9b360?w=400',
        ingredients: ['i1'],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuisson rapide',
        instruction: 'Vaporiser d\'huile, placer dans le Air Fryer à 200°C et cuire 6 à 8 minutes, jusqu\'à ce que les crevettes soient roses et dorées.',
        image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400',
        ingredients: ['i5'],
        utensils: ['Air Fryer']
      }
    ]
  },
  {
    id: "32",
    title: "Falafels dorés sans huile",
    author: mockChefs[4],
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=800",
    rating: 4.6,
    reviewsCount: 520,
    difficulty: "Moyen",
    times: { prep: 15, bake: 15, rest: 0 },
    nutrition: { cal: 340, prot: 15, fat: 8, carb: 45 },
    baseServings: 2,
    tags: ["20 min.", "Air Fryer"],
    likes: 2900,
    ingredients: [
      { id: 'i1', name: 'Pois chiches trempés (pas en boîte)', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Oignon', amount: 0.5, unit: 'pièce' },
      { id: 'i3', name: 'Coriandre et persil frais', amount: 1, unit: 'poignée' },
      { id: 'i4', name: 'Cumin et coriandre en poudre', amount: 1, unit: 'c. à café' },
      { id: 'i5', name: 'Ail', amount: 1, unit: 'gousse' }
    ],
    utensils: ['Robot mixeur', 'Air Fryer'],
    steps: [
      {
        id: 's1',
        title: 'Mixer les ingrédients',
        instruction: 'Dans un robot, mixer les pois chiches (préalablement trempés 24h et égouttés) avec l\'oignon, l\'ail, les herbes et les épices. Ne pas réduire en purée lisse, garder de la texture.',
        image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400',
        ingredients: ['i1', 'i2', 'i3', 'i4', 'i5'],
        utensils: ['Robot mixeur']
      },
      {
        id: 's2',
        title: 'Former les boules',
        instruction: 'Prendre un peu de pâte et former des boulettes avec les mains, en pressant bien pour que ça tienne.',
        image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400',
        ingredients: [],
        utensils: []
      },
      {
        id: 's3',
        title: 'Cuisson',
        instruction: 'Cuire au Air Fryer à 190°C pendant 12 à 15 minutes. Servir dans un pain pita avec de la sauce yaourt.',
        image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400',
        ingredients: [],
        utensils: ['Air Fryer']
      }
    ]
  },
  {
    id: "33",
    title: "Donuts maison au Air Fryer",
    author: mockChefs[0],
    image: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800",
    rating: 4.8,
    reviewsCount: 2200,
    difficulty: "Moyen",
    times: { prep: 20, bake: 5, rest: 60 },
    nutrition: { cal: 260, prot: 5, fat: 8, carb: 42 },
    baseServings: 4,
    tags: ["1h25", "Air Fryer"],
    likes: 8900,
    ingredients: [
      { id: 'i1', name: 'Farine', amount: 250, unit: 'g' },
      { id: 'i2', name: 'Lait tiède', amount: 10, unit: 'cl' },
      { id: 'i3', name: 'Levure de boulanger', amount: 10, unit: 'g' },
      { id: 'i4', name: 'Beurre mou', amount: 30, unit: 'g' },
      { id: 'i5', name: 'Sucre', amount: 30, unit: 'g' },
      { id: 'i6', name: 'Oeuf', amount: 1, unit: 'pièce' }
    ],
    utensils: ['Bol de pétrissage', 'Emporte-pièce', 'Air Fryer'],
    steps: [
      {
        id: 's1',
        title: 'La pâte',
        instruction: 'Mélanger le lait tiède et la levure. Ajouter la farine, le sucre, l\'œuf et pétrir. Incorporer le beurre mou et pétrir 5 min. Laisser lever 1h.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        ingredients: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'],
        utensils: ['Bol de pétrissage']
      },
      {
        id: 's2',
        title: 'Façonner',
        instruction: 'Étaler la pâte sur 1,5 cm d\'épaisseur. Découper des cercles avec un emporte-pièce (et faire un trou au centre). Laisser reposer 20 min.',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
        ingredients: [],
        utensils: ['Emporte-pièce']
      },
      {
        id: 's3',
        title: 'Cuisson',
        instruction: 'Cuire au Air Fryer à 180°C pendant 4 à 5 minutes (ils doivent juste dorer). Badigeonner de beurre fondu et rouler dans le sucre à la sortie.',
        image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
        ingredients: [],
        utensils: ['Air Fryer']
      }
    ]
  }
];

export const categoryLatest = mockRecipes.slice(1, 9);
export const categoryTonight = mockRecipes.slice(1, 9).reverse();
export const categorySummerSalads = mockRecipes.slice(9, 17);
export const categoryAsparagus = mockRecipes.slice(17, 25);
export const categoryAirFryer = mockRecipes.slice(25, 33);

export const categoryPopular = [...mockRecipes].sort((a, b) => b.likes - a.likes).slice(0, 8);
