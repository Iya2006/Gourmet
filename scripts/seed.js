import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

const africanDishes = [
  "Poulet DG", "Yassa au Poulet", "Thieboudienne", "Maafe", "Ndole", 
  "Attieke Poisson", "Alloco", "Foutou Banane", "Saka Saka", "FouFou",
  "Koki", "Ero", "Achu", "Okok", "Bongo'o", 
  "Suya", "Jollof Rice", "Egusi Soup", "Pounded Yam", "Akara", 
  "Kedjenou", "Garba", "Placali", "Gouagouassou", "Choukouya",
  "Lafidi", "Tô", "Sauce Graine", "Sauce Arachide", "Sauce Gombo",
  "Poulet Mayo", "Liboke", "Pondu", "Chikwangue", "Makayabu",
  "Doro Wat", "Injera", "Tibs", "Shiro", "Kitfo",
  "Kachumbari", "Nyama Choma", "Ugali", "Sukuma Wiki", "Mandazi",
  "Bobotie", "Biltong", "Boerewors", "Chakalaka", "Potjiekos"
];

const foodImages = [
  "https://images.unsplash.com/photo-1604329760661-e71cad83d8ca?w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80"
];

const categories = ["Africaine", "Guinéenne", "Ivoirienne", "Sénégalaise", "Camerounaise"];
const difficulties = ["Facile", "Moyen", "Difficile"];

async function createUsers() {
  console.log("Starting seed...");
  let dishIndex = 0;
  
  // Create 10 Chefs
  for (let i = 1; i <= 10; i++) {
    const email = `chef${i}@africa.com`;
    const password = "password123";
    const name = `Chef Africain ${i}`;
    let user;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      user = cred.user;
      console.log(`Created chef: ${email}`);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
        console.log(`Logged in existing chef: ${email}`);
      } else {
        console.error(e);
        continue;
      }
    }

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      role: 'chef',
      avatar: `https://i.pravatar.cc/150?u=${user.uid}`,
      bio: `Je suis le Chef Africain ${i}, spécialisé dans la cuisine africaine riche et authentique. J'ai voyagé à travers le continent pour découvrir les secrets des recettes traditionnelles.`,
      favorites: [],
      ratings: {},
      myReviews: {},
      createdAt: new Date().toISOString()
    });

    // Create 5 recipes for this chef
    for (let r = 0; r < 5; r++) {
      const dishName = africanDishes[dishIndex % africanDishes.length];
      const img = foodImages[dishIndex % foodImages.length];
      const category = categories[dishIndex % categories.length];
      const diff = difficulties[dishIndex % difficulties.length];
      
      const recipeData = {
        title: dishName,
        category: category,
        tags: [category, "Authentique", "Épices"],
        duration: 45 + (r * 15),
        prepTime: 15 + (r * 5),
        cookTime: 30 + (r * 10),
        difficulty: diff,
        image: img,
        description: `Un délicieux plat traditionnel de ${dishName}, préparé avec passion et des ingrédients authentiques.`,
        ingredients: [
          { id: "i1", name: "Poulet/Viande/Poisson", amount: 500, unit: "g" },
          { id: "i2", name: "Oignons", amount: 2, unit: "pièces" },
          { id: "i3", name: "Tomates", amount: 3, unit: "pièces" },
          { id: "i4", name: "Épices africaines", amount: 2, unit: "c.à.s" },
          { id: "i5", name: "Huile de palme ou végétale", amount: 3, unit: "c.à.s" }
        ],
        utensils: ["Marmite", "Spatule en bois", "Couteau"],
        steps: [
          { id: "s1", title: "Étape 1", instruction: "Préparez tous les ingrédients en les coupant finement.", image: null },
          { id: "s2", title: "Étape 2", instruction: "Faites revenir les oignons et la viande dans la marmite.", image: null },
          { id: "s3", title: "Étape 3", instruction: "Ajoutez les tomates et les épices. Laissez mijoter pendant le temps de cuisson.", image: null }
        ],
        nutrition: { calories: 450 + (r * 20), protein: 25, carbs: 40, fat: 15 },
        baseServings: 4,
        authorId: user.uid,
        authorName: name,
        authorAvatar: `https://i.pravatar.cc/150?u=${user.uid}`,
        views: 120 + r * 15,
        likes: 45 + r * 5,
        cooks: 10 + r * 2,
        reviews: [],
        rating: 4 + (r % 2 === 0 ? 0.5 : 0.8),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'recipes'), recipeData);
      dishIndex++;
    }
  }

  // Create 3 normal users
  for (let i = 1; i <= 3; i++) {
    const email = `user${i}@africa.com`;
    const password = "password123";
    let user;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      user = cred.user;
      console.log(`Created user: ${email}`);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
        console.log(`Logged in existing user: ${email}`);
      } else {
        console.error(e);
        continue;
      }
    }

    await setDoc(doc(db, 'users', user.uid), {
      name: `Utilisateur ${i}`,
      email: email,
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${user.uid}_user`,
      favorites: [],
      ratings: {},
      myReviews: {},
      createdAt: new Date().toISOString()
    });
  }
  
  console.log("Seed complete!");
  process.exit(0);
}

createUsers().catch(console.error);
