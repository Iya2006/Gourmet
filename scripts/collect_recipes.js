import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyBE3zPlW6aEwcbKsAPOWla_hCzTq394PeQ",
  authDomain: "recipeapp-19a28.firebaseapp.com",
  projectId: "recipeapp-19a28",
  storageBucket: "recipeapp-19a28.firebasestorage.app",
  messagingSenderId: "804395318097",
  appId: "1:804395318097:web:26e666891bc7f71f843170"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const theMealDBBase = 'https://www.themealdb.com/api/json/v1/1';

const targetAreas = [
  'Kenyan', 'Moroccan', 'Egyptian', 'Tunisian', // African priority
  'Jamaican', 'Indian', 'Mexican', 'French', 'Italian', 'Japanese' // World
];

const chefProfiles = [
  { name: 'Chef Aminata', role: 'chef', bio: 'Spécialiste de la cuisine ouest-africaine authentique.', avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&q=80', specialties: ['Sénégalaise', 'Ivoirienne'] },
  { name: 'Chef Ousmane', role: 'chef', bio: 'Expert en grillades et plats mijotés traditionnels.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', specialties: ['Malienne', 'Guinéenne'] },
  { name: 'Chef Fatou', role: 'chef', bio: 'Revisite les classiques africains avec une touche moderne.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80', specialties: ['Panafricaine', 'Fusion'] },
  { name: 'Chef Koffi', role: 'chef', bio: 'Passionné par les épices et les saveurs intenses.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', specialties: ['Ivoirienne', 'Ghanéenne'] },
  { name: 'Chef Chantal', role: 'chef', bio: 'Maîtresse des sauces et des accompagnements locaux.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80', specialties: ['Camerounaise'] },
  { name: 'Chef Amadou', role: 'chef', bio: 'Cuisine du monde et fusions afro-caribéennes.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', specialties: ['Afro-Caribéenne'] },
  { name: 'Chef Mariam', role: 'chef', bio: 'Authenticité et tradition culinaire du Maghreb.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', specialties: ['Marocaine', 'Tunisienne'] },
  { name: 'Chef Kwame', role: 'chef', bio: 'Cuisine street-food africaine et plats rapides.', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80', specialties: ['Ghanéenne', 'Street Food'] },
  { name: 'Chef Binta', role: 'chef', bio: 'Des recettes saines à base de produits locaux africains.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', specialties: ['Healthy', 'Végétarien'] },
  { name: 'Chef Diallo', role: 'chef', bio: 'Gastronomie fine et élégance de la cuisine continentale.', avatar: 'https://images.unsplash.com/photo-1504257432389-523431e15ce5?w=400&q=80', specialties: ['Gastronomique'] }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDataCollection() {
  console.log('Initialize Firebase Client...');

  // 1. Delete all existing recipes
  console.log('Cleaning old recipes...');
  const recipesSnap = await getDocs(collection(db, "recipes"));
  for (const docSnap of recipesSnap.docs) {
    await deleteDoc(doc(db, "recipes", docSnap.id));
  }
  console.log(`Deleted ${recipesSnap.size} old recipes.`);

  // 2. Fetch or create Chefs
  console.log('Ensuring 10 Chefs are present...');
  const chefsList = [];
  
  for (let i = 0; i < chefProfiles.length; i++) {
    const email = `chef${i + 1}@africa.com`;
    let user;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, 'password123');
      user = cred.user;
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        const cred = await signInWithEmailAndPassword(auth, email, 'password123');
        user = cred.user;
      } else {
        console.error("Auth error:", e);
        continue;
      }
    }
    
    const chefDoc = {
      uid: user.uid,
      email: email,
      name: chefProfiles[i].name,
      role: 'chef',
      bio: chefProfiles[i].bio,
      avatar: chefProfiles[i].avatar,
      specialties: chefProfiles[i].specialties,
      favorites: [],
      ratings: {},
      myReviews: {},
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), chefDoc);
    chefsList.push(chefDoc);
  }
  
  console.log(`Loaded ${chefsList.length} chefs.`);

  // 3. Fetch Recipes from TheMealDB
  console.log('Starting data collection from TheMealDB...');
  const collectedRecipes = [];

  for (const area of targetAreas) {
    try {
      console.log(`Fetching recipes for area: ${area}...`);
      const listRes = await axios.get(`${theMealDBBase}/filter.php?a=${area}`);
      const meals = listRes.data.meals;

      if (!meals) continue;

      // Limit to 5 recipes per area to keep the DB size reasonable but diverse (~50 recipes)
      const mealsToFetch = meals.slice(0, 5);

      for (const meal of mealsToFetch) {
        // Fetch full details
        const detailRes = await axios.get(`${theMealDBBase}/lookup.php?i=${meal.idMeal}`);
        const mealData = detailRes.data.meals[0];

        if (mealData) {
          collectedRecipes.push(mealData);
        }
        await sleep(200); // Respect API rate limits
      }
    } catch (err) {
      console.error(`Failed to fetch area ${area}:`, err.message);
    }
  }

  console.log(`Collected ${collectedRecipes.length} raw recipes. Formatting...`);

  // 4. Format and Insert
  for (let idx = 0; idx < collectedRecipes.length; idx++) {
    const raw = collectedRecipes[idx];
    const chef = chefsList[idx % chefsList.length];

    // Extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingName = raw[`strIngredient${i}`];
      const ingMeasure = raw[`strMeasure${i}`];
      if (ingName && ingName.trim() !== '') {
        ingredients.push({
          id: `ing_${i}`,
          name: ingName.trim(),
          amount: 1, // API usually mixes amount and unit in strMeasure
          unit: ingMeasure ? ingMeasure.trim() : ''
        });
      }
    }

    // Split instructions into steps
    const rawInstructions = raw.strInstructions || '';
    const instructionSentences = rawInstructions
      .split(/(?:\\r\\n|\\r|\\n)/)
      .map(s => s.trim())
      .filter(s => s.length > 5);

    const steps = instructionSentences.map((inst, i) => ({
      id: `s_${i}`,
      title: `Étape ${i + 1}`,
      instruction: inst,
      image: null // NE JAMAIS INVENTER D'IMAGE, selon les règles.
    }));

    // Map TheMealDB categories
    let categoryId = 'c_other';
    const cat = raw.strCategory?.toLowerCase();
    if (cat === 'chicken' || cat === 'beef' || cat === 'pork' || cat === 'lamb') categoryId = 'c_main';
    else if (cat === 'seafood') categoryId = 'c_seafood';
    else if (cat === 'vegetarian' || cat === 'vegan') categoryId = 'c_veg';
    else if (cat === 'dessert') categoryId = 'c_dessert';
    else if (cat === 'starter' || cat === 'side') categoryId = 'c_starter';

    const recipeDoc = {
      title: raw.strMeal,
      description: `Un plat traditionnel ${raw.strArea} de la catégorie ${raw.strCategory}. Origine vérifiée via TheMealDB.`,
      image: raw.strMealThumb, // IMAGE ORIGINALE
      categoryId: categoryId,
      difficulty: 'Moyen',
      prepTime: 20,
      cookTime: 30,
      baseServings: 4,
      authorId: chef.uid,
      authorName: chef.name,
      authorAvatar: chef.avatar,
      authorBio: chef.bio,
      source: 'themealdb',
      sourceUrl: `https://www.themealdb.com/meal/${raw.idMeal}`,
      youtubeUrl: raw.strYoutube || null,
      ingredients: ingredients,
      steps: steps,
      
      // Statistiques VIERGES selon les règles
      views: 0,
      likes: 0,
      cooks: 0,
      reviewsCount: 0,
      rating: 0,
      reviews: [],
      
      // Pas d'information nutritionnelle inventée
      nutrition: null,
      
      tags: raw.strTags ? raw.strTags.split(',').map(t => t.trim()) : [],
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'recipes', `recipe_${raw.idMeal}`), recipeDoc);
  }

  console.log(`Successfully saved ${collectedRecipes.length} REAL recipes to Firestore!`);
  console.log('Data collection complete.');
  process.exit(0);
}

runDataCollection().catch(console.error);
