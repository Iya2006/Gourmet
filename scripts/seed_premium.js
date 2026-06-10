import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// Configuration Firebase (identique à collect_recipes.js)
const firebaseConfig = {
  apiKey: "AIzaSyBE3zPlW6aEwcbKsAPOWla_hCzTq394PeQ",
  authDomain: "recipeapp-19a28.firebaseapp.com",
  projectId: "recipeapp-19a28",
  storageBucket: "recipeapp-19a28.firebasestorage.app",
  messagingSenderId: "804395318097",
  appId: "1:804395318097:web:26e666891bc7f71f843170"
};

// Initialisation conditionnelle (si pas déjà fait)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data
const chefs = [
  {
    id: 'chef_ousmane',
    email: 'ousmane@chef.com',
    name: 'Ousmane Ndiaye',
    role: 'chef',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Spécialiste de la cuisine Sénégalaise authentique et revisitée.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chef_charlotte',
    email: 'charlotte@chef.com',
    name: 'Charlotte B.',
    role: 'chef',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Experte en nutrition et plats healthy / vegan / keto d\'Afrique Centrale.',
    createdAt: new Date().toISOString()
  }
];

const recipes = [
  {
    id: 'rec_yassa_poulet',
    title: 'Poulet Yassa Authentique',
    category: 'Africaine',
    difficulty: 'Moyen',
    duration: 120, // en minutes
    times: { prep: 30, bake: 90, rest: 0 },
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    authorId: 'chef_ousmane',
    authorName: 'Ousmane Ndiaye',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    authorBio: 'Spécialiste de la cuisine Sénégalaise authentique et revisitée.',
    rating: 4.8,
    reviewsCount: 15,
    likes: 120,
    cooks: 45,
    views: 300,
    tags: ['Sénégalaise', 'Africaine', 'Poulet', 'Sans gluten', 'Halal'],
    nutrition: { calories: 650, protein: 45, fat: 30, carbs: 40 },
    ingredients: [
      { id: 'ing1', name: 'Poulet', amount: 1, unit: 'entier' },
      { id: 'ing2', name: 'Oignons', amount: 5, unit: 'gros' },
      { id: 'ing3', name: 'Citrons', amount: 4, unit: 'pièces' },
      { id: 'ing4', name: 'Moutarde', amount: 3, unit: 'c.à.s' }
    ],
    steps: [
      { id: 'st1', instruction: 'Coupez le poulet en morceaux et marinez-le avec le jus de citron, la moutarde, l\'ail, le sel et le poivre pendant au moins 2 heures.' },
      { id: 'st2', instruction: 'Faites dorer les morceaux de poulet dans une cocotte.' },
      { id: 'st3', instruction: 'Dans la même cocotte, faites revenir les oignons émincés jusqu\'à ce qu\'ils soient tendres.' },
      { id: 'st4', instruction: 'Remettez le poulet, ajoutez un peu d\'eau et laissez mijoter 45 minutes.' }
    ]
  },
  {
    id: 'rec_ndole_crevettes',
    title: 'Ndolé Camerounais aux Crevettes',
    category: 'Africaine',
    difficulty: 'Difficile',
    duration: 150,
    times: { prep: 60, bake: 90, rest: 0 },
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?auto=format&fit=crop&w=800&q=80',
    authorId: 'chef_charlotte',
    authorName: 'Charlotte B.',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    authorBio: 'Experte en nutrition et plats healthy / vegan / keto d\'Afrique Centrale.',
    rating: 4.9,
    reviewsCount: 32,
    likes: 210,
    cooks: 85,
    views: 500,
    tags: ['Camerounaise', 'Africaine', 'Fruits de mer', 'Keto', 'Halal'],
    nutrition: { calories: 550, protein: 40, fat: 35, carbs: 15 },
    ingredients: [
      { id: 'ing1', name: 'Feuilles de Ndolé (ou épinards)', amount: 500, unit: 'g' },
      { id: 'ing2', name: 'Arachides crues émondées', amount: 300, unit: 'g' },
      { id: 'ing3', name: 'Crevettes fumées', amount: 200, unit: 'g' },
      { id: 'ing4', name: 'Viande de boeuf', amount: 300, unit: 'g' }
    ],
    steps: [
      { id: 'st1', instruction: 'Faites bouillir les arachides pendant 15 min, puis mixez-les pour obtenir une pâte lisse.' },
      { id: 'st2', instruction: 'Lavez les feuilles de Ndolé pour enlever l\'amertume.' },
      { id: 'st3', instruction: 'Faites cuire la viande avec des oignons et des épices.' },
      { id: 'st4', instruction: 'Ajoutez la pâte d\'arachide à la viande, puis les feuilles de Ndolé et les crevettes.' },
      { id: 'st5', instruction: 'Laissez mijoter à feu doux pendant 30 minutes.' }
    ]
  },
  {
    id: 'rec_mafe_vegan',
    title: 'Mafé Vegan aux Patates Douces',
    category: 'Healthy',
    difficulty: 'Facile',
    duration: 45,
    times: { prep: 15, bake: 30, rest: 0 },
    image: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=80',
    authorId: 'chef_charlotte',
    authorName: 'Charlotte B.',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    authorBio: 'Experte en nutrition et plats healthy / vegan / keto d\'Afrique Centrale.',
    rating: 4.7,
    reviewsCount: 8,
    likes: 85,
    cooks: 20,
    views: 150,
    tags: ['Sénégalaise', 'Africaine', 'Vegan', 'Végétarien', 'Sans gluten', 'Sans produits laitiers'],
    nutrition: { calories: 450, protein: 15, fat: 25, carbs: 55 },
    ingredients: [
      { id: 'ing1', name: 'Pâte d\'arachide non sucrée', amount: 4, unit: 'c.à.s' },
      { id: 'ing2', name: 'Patates douces', amount: 2, unit: 'moyennes' },
      { id: 'ing3', name: 'Carottes', amount: 3, unit: 'pièces' },
      { id: 'ing4', name: 'Concentré de tomate', amount: 2, unit: 'c.à.s' }
    ],
    steps: [
      { id: 'st1', instruction: 'Faites revenir l\'oignon émincé dans un peu d\'huile.' },
      { id: 'st2', instruction: 'Ajoutez le concentré de tomate et délayez la pâte d\'arachide avec un peu d\'eau tiède, puis versez dans la marmite.' },
      { id: 'st3', instruction: 'Ajoutez les patates douces et les carottes coupées en gros dés.' },
      { id: 'st4', instruction: 'Laissez cuire à feu moyen jusqu\'à ce que les légumes soient tendres et que l\'huile remonte à la surface (environ 30 min).' }
    ]
  }
];

async function seedData() {
  console.log("Démarrage du seeding...");
  try {
    const batch = writeBatch(db);

    chefs.forEach(chef => {
      const ref = doc(collection(db, 'users'), chef.id);
      batch.set(ref, chef);
    });

    recipes.forEach(recipe => {
      const ref = doc(collection(db, 'recipes'), recipe.id);
      batch.set(ref, recipe);
    });

    await batch.commit();
    console.log("Seeding terminé avec succès !");
  } catch (e) {
    console.error("Erreur lors du seeding :", e);
  }
}

seedData();
