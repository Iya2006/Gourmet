# 🍽️ Gourmet - Application de Recettes Mobile Premium

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-black?logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-orange?logo=firebase)](https://firebase.google.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-brown)](https://zustand-demo.pmnd.rs/)

Application mobile de recettes culinaires complète, développée avec Expo / React Native et Firebase. Projet universitaire respectant un cahier des charges complet incluant : gestion de rôles, système de chefs, recommandations IA, animations premium, et architecture scalable.

---

## 📱 Captures d'écran

> *L'application possède un design sombre premium, des animations fluides et un système complet de gestion de contenu.*

---

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) sur votre téléphone iOS ou Android
- Git

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_USERNAME/gourmet-recipe-app.git
cd gourmet-recipe-app

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npx expo start
```

Ensuite, scannez le QR code avec l'app **Expo Go** sur votre téléphone.

---

## 🔐 Comptes de Test

| Rôle | Email | Mot de passe | Accès |
|------|-------|-------------|-------|
| **Administrateur** | `admin@example.com` | `admin123` | Dashboard Admin, gestion des rôles, statistiques |
| **Chef Cuisinier** | `chef@example.com` | `chef123` | Dashboard Chef, création de recettes, édition de profil |
| **Utilisateur** | Créer via l'app | Libre | Recherche, favoris, liste de courses |

---

## 🏗️ Architecture du Projet

```
recipe-app-54/
├── src/
│   ├── screens/           # Écrans de l'application
│   │   ├── HomeScreen.js         # Accueil + IA Recommandations
│   │   ├── SearchScreen.js       # Recherche (titre + ingrédients)
│   │   ├── DetailsScreen.js      # Détail d'une recette
│   │   ├── ProfileScreen.js      # Profil utilisateur + paramètres
│   │   ├── SplashScreen.js       # Écran de démarrage animé
│   │   ├── LoginScreen.js        # Authentification
│   │   ├── AdminDashboard.js     # Dashboard administrateur
│   │   ├── ChefDashboard.js      # Dashboard chef cuisinier
│   │   ├── ChefProfileScreen.js  # Profil public d'un chef
│   │   ├── AddRecipeScreen.js    # Ajout de recette (chefs)
│   │   ├── FavoritesScreen.js    # Recettes favorites
│   │   ├── ShoppingListScreen.js # Liste de courses
│   │   └── CookingModeScreen.js  # Mode cuisine pas-à-pas
│   ├── components/        # Composants réutilisables
│   ├── navigation/        # Configuration de la navigation
│   │   └── AppNavigator.js
│   ├── store/             # État global (Zustand)
│   │   ├── authStore.js          # Authentification
│   │   ├── recipeStore.js        # Favoris & listes de courses
│   │   └── themeStore.js         # Thème clair/sombre
│   ├── services/          # Logique métier & Firebase
│   │   ├── firebaseConfig.js
│   │   └── recipeService.js
│   ├── context/           # Context API
│   │   └── RecipeContext.js      # Filtres & recherche globaux
│   ├── data/              # Données locales (mockup)
│   │   └── mockRecipes.js
│   ├── i18n/              # Internationalisation (FR/EN/ES/AR)
│   │   └── index.js
│   └── theme/             # Design System (couleurs, typo)
│       └── index.js
└── RAPPORT_PROJET.md      # Rapport de conformité au CDC
```

---

## ✅ Conformité au Cahier des Charges

### Architecture & Bonnes Pratiques
| Critère | Statut | Détails |
|---------|--------|---------|
| Séparation Logique/Vue | ✅ | `screens/` vs `services/`, `store/`, `context/` |
| Composants réutilisables | ✅ | `GridCard`, `ListCard`, `FilterChip`, `PaginatedCarousel`... |
| Limiter les re-renders | ✅ | `useMemo`, `useCallback`, Zustand sélecteurs |
| Architecture scalable | ✅ | Dossiers par responsabilité, services indépendants |

### Fonctionnalités Core
| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Authentification Firebase | ✅ | Email/Mot de passe, Auth persistante |
| Gestion de rôles (3 niveaux) | ✅ | `user`, `chef`, `admin` via Firestore |
| CRUD Recettes | ✅ | Ajout complet : étapes, images, nutrition, ustensiles |
| Recherche par titre | ✅ | Temps réel, normalisée (accents) |
| **Recherche par ingrédients** | ✅ | Dès 3 chars, scan de `recipe.ingredients[]` |
| Système de likes/favoris | ✅ | Persisté Zustand + Firebase |
| Liste de courses | ✅ | Ajout automatique des ingrédients |
| Mode Cuisine (pas-à-pas) | ✅ | Timer intégré, étapes illustrées |
| Filtres avancés | ✅ | Catégorie, Difficulté, Durée |
| Multilingue | ✅ | Français, Anglais, Espagnol, Arabe |
| Dark Mode | ✅ | Switch instantané, persisté |

### Optimisation & Performance
| Critère | Statut | Détails |
|---------|--------|---------|
| **FlatList Virtualisée** | ✅ | `removeClippedSubviews`, `initialNumToRender`, `windowSize` |
| Synchronisation Offline | ✅ | Cache Firestore natif + fallback données locales |
| Animations fluides | ✅ | `Animated` API React Native, transitions 60fps |
| Splash Screen animé | ✅ | `SplashScreen.js` avec spring animation |
| Loading Overlay (Connexion) | ✅ | Animation rotative sur le logo |

### Extension IA Culinaire
| Critère | Statut | Détails |
|---------|--------|---------|
| **Système de Recommandation** | ✅ | Section "✨ Recommandé pour vous (IA)" |
| Algorithme basé préférences | ✅ | Filtrage par catégorie (ex: Africaine) et profil |
| Architecture extensible | ✅ | Prêt pour intégration API ML externe |

### Tableau de Bord
| Dashboard | Statut | Fonctionnalités |
|-----------|--------|----------------|
| **Admin** | ✅ | Vue stats globales, gestion des rôles, top recettes |
| **Chef** | ✅ | Ses recettes, modifier bio/avatar, accès ajout recette |
| **Profil Chef (Public)** | ✅ | Visible par tous les utilisateurs, liste des plats |

---

## 🔧 Technologies Utilisées

| Technologie | Version | Usage |
|------------|---------|-------|
| React Native | 0.74 | Framework mobile |
| Expo | 51 | Outillage & déploiement |
| Firebase Auth | 10.x | Authentification |
| Firebase Firestore | 10.x | Base de données NoSQL |
| Zustand | 4.x | Gestion d'état global |
| React Navigation | 6.x | Navigation entre écrans |
| expo-image | latest | Chargement d'images optimisé |
| react-i18next | latest | Internationalisation |
| AsyncStorage | latest | Persistance locale |

---

## 🌐 Déploiement Web (Vercel)

Ce projet Expo est compatible Web et peut être déployé sur Vercel :

```bash
# Générer le build Web
npx expo export:web

# Le dossier web-build/ est créé → à déployer sur Vercel
```

**Configuration Vercel :**
- **Build Command :** `npx expo export:web`
- **Output Directory :** `web-build`
- **Framework Preset :** `Other`

---

## 📚 Pour les Collaborateurs

1. Les configurations Firebase sont dans `src/services/firebaseConfig.js`.
2. Le design system (couleurs, typographies) est centralisé dans `src/theme/index.js`.
3. Toutes les traductions sont dans `src/i18n/index.js`.
4. Le fichier `RAPPORT_PROJET.md` contient le bilan complet de conformité au cahier des charges.

---

*Développé dans le cadre d'un projet universitaire — Architecture React Native Premium*
