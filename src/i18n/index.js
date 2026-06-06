import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  fr: {
    translation: {
      appName: "Gourmet",
      searchPlaceholder: "Rechercher une recette...",
      homeTitle: "Nos Recettes",
      favoritesTitle: "Vos Favoris",
      detailsTitle: "Détails",
      ingredients: "Ingrédients",
      instructions: "Préparation",
      noRecipe: "Aucune recette trouvée.",
      loading: "Chargement en cours...",
      difficulty: "Difficulté",
      duration: "Durée",
      showFilters: "Afficher les filtres avancés",
      hideFilters: "Masquer les filtres avancés",
      loginTitle: "Connexion",
      registerTitle: "Créer un compte",
      email: "Email",
      password: "Mot de passe",
      loginButton: "Se connecter",
      registerButton: "S'inscrire",
      switchRegister: "Pas encore de compte ? S'inscrire",
      switchLogin: "Déjà un compte ? Se connecter",
      profileTitle: "Profil",
      personalInfo: "Informations personnelles",
      preferences: "Préférences",
      language: "Langue",
      diet: "Régime alimentaire",
      cuisineType: "Type de cuisine",
      system: "Système",
      darkMode: "Mode Sombre",
      logout: "Se déconnecter",
      email: "Email",
      notSpecified: "Non renseigné",
      cuisines: "Cuisines",
      notifications: "Notifications",
      selectDiet: "Choisir un régime",
      selectCuisine: "Choisir une cuisine",
      adminDashboard: "Tableau de bord Admin",
      chefDashboard: "Tableau de bord Chef",
      error: "Erreur",
      errorEmpty: "Veuillez entrer un email et un mot de passe.",
      categories: {
        All: "Tout",
        Beef: "Bœuf",
        Chicken: "Poulet",
        Dessert: "Dessert",
        Vegetarian: "Végétarien",
        Seafood: "Fruits de mer"
      },
      difficulties: {
        All: "Tout",
        VeryEasy: "Très Facile",
        Easy: "Facile",
        Medium: "Moyen",
        Hard: "Difficile"
      }
    }
  },
  en: {
    translation: {
      appName: "Gourmet",
      searchPlaceholder: "Search for a recipe...",
      homeTitle: "Our Recipes",
      favoritesTitle: "Your Favorites",
      detailsTitle: "Details",
      ingredients: "Ingredients",
      instructions: "Instructions",
      noRecipe: "No recipe found.",
      loading: "Loading...",
      difficulty: "Difficulty",
      duration: "Duration",
      showFilters: "Show advanced filters",
      hideFilters: "Hide advanced filters",
      loginTitle: "Login",
      registerTitle: "Create account",
      email: "Email",
      password: "Password",
      loginButton: "Sign In",
      registerButton: "Sign Up",
      switchRegister: "Don't have an account? Sign Up",
      switchLogin: "Already have an account? Sign In",
      profileTitle: "Profile",
      personalInfo: "Personal Information",
      preferences: "Preferences",
      language: "Language",
      diet: "Dietary",
      cuisineType: "Cuisine Type",
      system: "System",
      darkMode: "Dark Mode",
      logout: "Sign Out",
      email: "Email",
      notSpecified: "Not specified",
      cuisines: "Cuisines",
      notifications: "Notifications",
      selectDiet: "Select Diet",
      selectCuisine: "Select Cuisine",
      adminDashboard: "Admin Dashboard",
      chefDashboard: "Chef Dashboard",
      error: "Error",
      errorEmpty: "Please enter an email and password.",
      categories: {
        All: "All",
        Beef: "Beef",
        Chicken: "Chicken",
        Dessert: "Dessert",
        Vegetarian: "Vegetarian",
        Seafood: "Seafood"
      },
      difficulties: {
        All: "All",
        VeryEasy: "Very Easy",
        Easy: "Easy",
        Medium: "Medium",
        Hard: "Hard"
      }
    }
  },
  es: {
    translation: {
      appName: "Gourmet",
      searchPlaceholder: "Buscar una receta...",
      homeTitle: "Nuestras Recetas",
      favoritesTitle: "Tus Favoritos",
      detailsTitle: "Detalles",
      ingredients: "Ingredientes",
      instructions: "Preparación",
      noRecipe: "No se encontró ninguna receta.",
      loading: "Cargando...",
      difficulty: "Dificultad",
      duration: "Duración",
      showFilters: "Mostrar filtros avanzados",
      hideFilters: "Ocultar filtros avanzados",
      loginTitle: "Iniciar sesión",
      registerTitle: "Crear cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      loginButton: "Ingresar",
      registerButton: "Registrarse",
      switchRegister: "¿Aún no tienes cuenta? Regístrate",
      switchLogin: "¿Ya tienes cuenta? Inicia sesión",
      profileTitle: "Perfil",
      personalInfo: "Información Personal",
      preferences: "Preferencias",
      language: "Idioma",
      diet: "Dieta",
      cuisineType: "Tipo de cocina",
      system: "Sistema",
      darkMode: "Modo Oscuro",
      logout: "Cerrar sesión",
      email: "Correo",
      notSpecified: "No especificado",
      cuisines: "Cocinas",
      notifications: "Notificaciones",
      selectDiet: "Elegir dieta",
      selectCuisine: "Elegir cocina",
      adminDashboard: "Panel de Admin",
      chefDashboard: "Panel de Chef",
      error: "Error",
      errorEmpty: "Por favor, ingrese un correo y contraseña.",
      categories: {
        All: "Todo",
        Beef: "Carne de res",
        Chicken: "Pollo",
        Dessert: "Postre",
        Vegetarian: "Vegetariano",
        Seafood: "Mariscos"
      },
      difficulties: {
        All: "Todo",
        VeryEasy: "Muy Fácil",
        Easy: "Fácil",
        Medium: "Medio",
        Hard: "Difícil"
      }
    }
  },
  ar: {
    translation: {
      appName: "جورميه",
      searchPlaceholder: "ابحث عن وصفة...",
      homeTitle: "وصفاتنا",
      favoritesTitle: "مفضلاتك",
      detailsTitle: "تفاصيل",
      ingredients: "المكونات",
      instructions: "التحضير",
      noRecipe: "لم يتم العثور على أي وصفة.",
      loading: "جاري التحميل...",
      difficulty: "الصعوبة",
      duration: "المدة",
      showFilters: "إظهار المرشحات المتقدمة",
      hideFilters: "إخفاء المرشحات المتقدمة",
      loginTitle: "تسجيل الدخول",
      registerTitle: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginButton: "دخول",
      registerButton: "تسجيل",
      switchRegister: "ليس لديك حساب؟ سجل الآن",
      switchLogin: "هل لديك حساب؟ تسجيل الدخول",
      profileTitle: "الملف الشخصي",
      personalInfo: "المعلومات الشخصية",
      preferences: "تفضيلات",
      language: "اللغة",
      diet: "حمية",
      cuisineType: "نوع المطبخ",
      system: "النظام",
      darkMode: "الوضع المظلم",
      logout: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      notSpecified: "غير محدد",
      cuisines: "المطابخ",
      notifications: "إشعارات",
      selectDiet: "اختر حمية",
      selectCuisine: "اختر المطبخ",
      adminDashboard: "لوحة تحكم المسؤول",
      chefDashboard: "لوحة تحكم الشيف",
      error: "خطأ",
      errorEmpty: "الرجاء إدخال البريد الإلكتروني وكلمة المرور.",
      categories: {
        All: "الكل",
        Beef: "لحم بقري",
        Chicken: "دجاج",
        Dessert: "حلوى",
        Vegetarian: "نباتي",
        Seafood: "مأكولات بحرية"
      },
      difficulties: {
        All: "الكل",
        VeryEasy: "سهل جداً",
        Easy: "سهل",
        Medium: "متوسط",
        Hard: "صعب"
      }
    }
  }
};

const initI18n = async () => {
  let savedLanguage = 'fr'; // default
  try {
    const lang = await AsyncStorage.getItem('appLanguage');
    if (lang) {
      savedLanguage = lang;
    }
  } catch (e) {
    console.error('Failed to load language', e);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

initI18n();

export default i18n;
