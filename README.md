# 🍽️ Gourmet - Application de Recettes Mobile Premium

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-black?logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-orange?logo=firebase)](https://firebase.google.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-brown)](https://zustand-demo.pmnd.rs/)

Application mobile de recettes culinaires complète, développée avec **Expo / React Native** et **Firebase**. Projet respectant un cahier des charges complet incluant : gestion de rôles, système de chefs, recommandations, animations premium, et architecture scalable.

---

## 🚀 Démarrage rapide (Installation)

### Prérequis
- [Node.js](https://nodejs.org/) **v18+**
- [Expo Go](https://expo.dev/go) sur votre téléphone iOS ou Android
- Git

### Installation en 3 étapes

```bash
# 1. Cloner le dépôt officiel
git clone https://github.com/Iya2006/Gourmet.git
cd Gourmet

# 2. Installer toutes les dépendances
npm install

# 3. Lancer le serveur de développement
npx expo start
```

Ensuite, **scannez le QR code** avec l'application **Expo Go** sur votre téléphone. C'est tout ! ✅

---

## 🔐 Comptes de Test

| Rôle | Email | Mot de passe | Accès |
|------|-------|-------------|-------|
| **Administrateur** | `admin@example.com` | `admin123` | Dashboard Admin, gestion des rôles, statistiques globales |
| **Chef Cuisinier** | `chef1@africa.com` | `password123` | Dashboard Chef, création / suppression de recettes, édition de profil |
| **Chef Cuisinier 2** | `chef2@africa.com` | `password123` | Idem — spécialité Afrique Centrale |
| **Utilisateur** | Créer via l'app | Libre | Recherche, favoris, liste de courses, avis |

> **Note :** Pour créer un compte chef, l'email doit contenir le mot `chef` (ex: `monnom.chef@gmail.com`).  
> Pour un admin, l'email doit contenir `admin`.

---

## ✨ Fonctionnalités Principales

### 👤 Système de Rôles
- **3 niveaux** : Utilisateur / Chef / Admin
- Rôle assigné automatiquement selon l'email à la création de compte
- Tableau de bord dédié pour Chef et Admin

### 🍳 Gestion des Recettes (Chef)
- **Créer** une recette avec étapes, ingrédients, images, valeurs nutritionnelles
- **Supprimer** ses propres recettes depuis le tableau de bord
- **Modifier** son profil (bio, avatar) → se synchronise automatiquement sur toutes ses recettes
- Le tableau de bord se **rafraîchit automatiquement** après l'ajout d'une recette

### 🎛️ Filtres Intelligents (Multi-sélection)
- **Régimes alimentaires** (multi-sélection) : Végétarien, Vegan, Sans gluten, Keto, Halal, Sans produits laitiers
- **Cuisines du monde** (multi-sélection) : Française, Africaine, Camerounaise, Sénégalaise, Italienne, Indienne...
- Les filtres s'appliquent en **temps réel** sur l'écran d'accueil
- Préférences **sauvegardées** dans votre compte

### 🌍 Recettes Africaines Premium (en français)
Base de données enrichie avec des recettes authentiques :
- 🇸🇳 **Poulet Yassa** (Sénégal) — Sans gluten, Halal
- 🇨🇲 **Ndolé aux Crevettes** (Cameroun) — Keto, Halal
- 🌱 **Mafé Vegan** aux Patates Douces — Vegan, Végétarien, Sans gluten

### ⭐ Avis & Évaluations
- Ajouter un avis avec note (1-5 étoiles), commentaire, et photo
- Les avis **s'affichent immédiatement** sans rechargement
- Synchronisés avec Firebase (persistants)

### 🎬 Lecteur Vidéo Intégré
- Lecture des vidéos de recettes directement dans l'application
- Pas de redirection vers YouTube

### 🌑 Mode Sombre / Clair
- Basculer via le profil
- Design adaptatif sur tous les écrans

### 🛒 Autres Fonctionnalités
- Recherche par titre, tags, ou ingrédients
- Liste de courses automatique
- Mode Cuisine pas-à-pas avec minuteur
- Favoris persistés
- Carnets de recettes (Cookbooks)
- Multilingue : Français, Anglais, Espagnol, Arabe

---

## 🏗️ Architecture du Projet

```
Gourmet/
├── src/
│   ├── screens/           # Écrans de l'application
│   │   ├── HomeScreen.js         # Accueil + recommandations
│   │   ├── SearchScreen.js       # Recherche avancée
│   │   ├── DetailsScreen.js      # Détail recette + avis + vidéo
│   │   ├── ReviewsScreen.js      # Gestion des avis
│   │   ├── ProfileScreen.js      # Profil + filtres + paramètres
│   │   ├── LoginScreen.js        # Authentification
│   │   ├── AdminDashboard.js     # Dashboard administrateur
│   │   ├── ChefDashboard.js      # Dashboard chef (auto-refresh)
│   │   ├── ChefProfileScreen.js  # Profil public d'un chef
│   │   ├── AddRecipeScreen.js    # Ajout de recette (chefs)
│   │   ├── FavoritesScreen.js    # Recettes favorites
│   │   ├── ShoppingListScreen.js # Liste de courses
│   │   └── CookingModeScreen.js  # Mode cuisine pas-à-pas
│   ├── store/             # État global (Zustand)
│   │   ├── authStore.js          # Auth + préférences utilisateur
│   │   ├── recipeStore.js        # Favoris, avis & listes de courses
│   │   └── themeStore.js         # Thème clair/sombre
│   ├── context/           # Context API
│   │   └── RecipeContext.js      # Filtres globaux (régimes, cuisines)
│   ├── services/          # Logique métier & Firebase
│   │   ├── firebaseConfig.js
│   │   └── recipeService.js
│   ├── i18n/              # Internationalisation (FR/EN/ES/AR)
│   └── theme/             # Design System (couleurs, typographie)
└── scripts/
    ├── collect_recipes.js  # Import TheMealDB → Firestore
    └── seed_premium.js     # Recettes africaines premium en français
```

---

## 🔧 Technologies Utilisées

| Technologie | Usage |
|------------|-------|
| React Native + Expo | Framework mobile |
| Firebase Auth | Authentification |
| Firebase Firestore | Base de données NoSQL cloud |
| Zustand | Gestion d'état global |
| React Navigation | Navigation entre écrans |
| react-native-youtube-iframe | Lecteur vidéo intégré |
| react-i18next | Internationalisation |
| expo-image | Chargement d'images optimisé |
| AsyncStorage | Persistance locale (offline) |

---

## 📚 Pour les Collaborateurs / Chefs

1. **Clonez** le dépôt avec la commande ci-dessus.
2. **Lancez** `npm install` puis `npx expo start`.
3. **Connectez-vous** avec un compte chef (`chef1@africa.com` / `password123`).
4. Accédez à votre **Tableau de bord Chef** depuis le profil.
5. Vous pouvez **ajouter**, **modifier** et **supprimer** vos recettes.

> Les configurations Firebase sont dans `src/services/firebaseConfig.js`.  
> Le design system est dans `src/theme/index.js`.  
> Les traductions dans `src/i18n/index.js`.

---

*Dépôt officiel : [https://github.com/Iya2006/Gourmet](https://github.com/Iya2006/Gourmet)*
