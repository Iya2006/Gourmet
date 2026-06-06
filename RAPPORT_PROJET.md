# Gourmet - Application de Recettes Premium 🍽️

Ce document présente l'architecture, les fonctionnalités et la conformité au cahier des charges du projet **Gourmet**. Conçu pour être déployé (Expo / Vercel pour le web), ce projet intègre les meilleures pratiques de développement React Native moderne.

---

## 📋 Conformité au Cahier des Charges

L'application a été conçue pour respecter strictement les attentes d'une architecture universitaire et d'un produit professionnel moderne :

1. **Séparation de la logique (Clean Code)** :
   - Les vues (`/screens`, `/components`) sont strictement séparées de la logique métier (`/services`) et de l'état global (`/store`).
   - L'utilisation de composants réutilisables (ex: `PaginatedCarousel`, `SettingRow`, `GridCard`) limite la duplication de code et les re-renders inutiles.
2. **Gestion d'État Indépendante (Zustand)** :
   - Remplaçant l'historique *Redux Toolkit* pour plus de légèreté, Zustand gère l'état de l'application (Auth, Thème, Recettes) de manière totalement indépendante de la plateforme.
3. **Optimisation Énergétique et Mémoire (Listes Virtuelles)** :
   - L'application utilise `FlatList` massivement.
   - Tous les paramètres de haute performance y sont injectés : `removeClippedSubviews`, `initialNumToRender`, `maxToRenderPerBatch`, et `windowSize`, réduisant drastiquement l'empreinte mémoire et le travail du processeur lors du scroll.
4. **Recherche Intelligente (Ingrédients & Titres)** :
   - Le moteur de recherche ne se limite pas aux titres. Il analyse en temps réel les **ingrédients** (dès 3 caractères) pour faire remonter les résultats pertinents (Ex: taper "Tomate").
5. **Synchronisation "Offline-First"** :
   - Propulsé par *Firebase Firestore*, le système maintient un cache local permettant de charger les profils et les recettes même en cas de perte de connexion réseau.
6. **Extension IA Culinaire (Mock)** :
   - La section `Recommandé pour vous (IA)` de l'écran d'accueil simule une IA d'analyse de goûts, mettant en avant les plats correspondant aux spécificités de l'utilisateur (ex: Africain, Moyen).
7. **UX Premium & Animations** :
   - Implémentation d'un *Splash Screen* animé et d'un *Loading Overlay* translucide lors de la connexion, empêchant les clics multiples et améliorant la sensation de fluidité de l'application.

---

## 🔐 Identifiants de Test

Pour évaluer les différentes interfaces (Dashboards), voici les comptes à utiliser :

| Rôle | Email | Mot de passe | Accès spécifiques |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@example.com` | `admin123` | Dashboard Admin complet, gestion des rôles utilisateurs, statistiques globales. |
| **Chef** | `chef@example.com` | `chef123` | Dashboard Chef, édition de profil, création de recettes riches avec temps séparés et nutrition. |
| **Utilisateur (Client)** | *À créer via l'app* | *Libre* | Lecture, favoris, recherche par ingrédients, listes de courses. |

---

## 🚀 Guide de Déploiement (Vercel / Web)

Ce projet utilise Expo, ce qui signifie qu'il peut être facilement exporté pour le Web et déployé sur Vercel.

1. **Générer le build Web** :
   ```bash
   npx expo export:web
   ```
   *Cela va créer un dossier `web-build` contenant le code compilé.*

2. **Déployer sur Vercel** :
   - Sur Vercel, importe le dépôt GitHub.
   - Dans les paramètres de build :
     - **Framework Preset** : `Create React App` (ou laisser Vercel détecter automatiquement Expo).
     - **Build Command** : `npx expo export:web`
     - **Output Directory** : `web-build`

---

*Projet développé par une architecture IA orientée clean code et haute performance.*
