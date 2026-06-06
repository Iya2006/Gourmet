# Projet Gourmet - Rapport de Conception et Développement

## 1. Introduction
Ce rapport détaille la conception, l'architecture technique, et l'intégration des fonctionnalités de l'application **Gourmet**, une application mobile et web de recettes de cuisine de haute volée. L'objectif était de fournir une expérience utilisateur "premium" et fluide (à la fois sur ordinateur de bureau et téléphone mobile), intégrant des concepts modernes de design d'interface et une architecture applicative robuste.

## 2. Architecture Technique et Technologies Utilisées
L'application a été bâtie en favorisant une approche universelle ("Write once, run anywhere").
* **React Native & Expo :** Utilisé comme framework principal pour cibler à la fois iOS, Android et le Web à partir d'un même code source.
* **React Navigation :** Pour la gestion du routage complexe (Bottom Tabs, Stacks, Modals, et écrans spécifiques pour les Chefs/Admins).
* **Zustand :** Utilisé pour la gestion d'état global (State Management) rapide et performante (gestion du panier de courses, favoris, mode sombre, création de cookbooks, et avis).
* **Firebase :** 
  * *Authentication :* Implémenté pour gérer la création de comptes, la connexion sécurisée et les rôles utilisateurs (Standard, Chef, Admin) avec persistance multi-plateformes.
  * *Firestore :* Synchronisation cloud pour permettre à l'utilisateur de retrouver ses données sur plusieurs appareils de façon transparente (sauvegarde locale + cloud).
* **API Natives (Web/Mobile) :** Exploitation du presse-papiers (`Clipboard`) et de l'API `navigator.share` pour le partage des recettes en garantissant la compatibilité selon la plateforme de l'utilisateur.

## 3. Choix de Design (UI/UX)
Le mandat principal était d'offrir une interface **premium**, moderne et hautement séduisante. Pour y parvenir, plusieurs concepts ont été implémentés :
* **Esthétique Moderne (Glassmorphism & Couleurs) :** Utilisation d'un système de couleurs géré dynamiquement (`useAppTheme`) avec un mode sombre (Dark Mode) natif.
* **Micro-interactions et Animations :** 
  * Animations au défilement (effet Parallax sur les images de présentation de la page d'accueil).
  * Notifications non intrusives (Toasts animés) avec `Animated.timing` pour informer l'utilisateur sans le bloquer (ex: ajout aux favoris en mode cuisson).
* **Responsive Design :** Adaptation des interfaces pour une ergonomie optimale sur PC et Mobile, en réglant finement les dimensions des barres de navigation et des carrousels.

## 4. Fonctionnalités Implémentées

### 4.1. Consultation de Recettes et Page d'Accueil
* Développement d'une `HomeScreen` riche comprenant un carrousel paginé dynamique.
* Recommandations basées sur l'intelligence artificielle simulée pour le ciblage des préférences utilisateurs.

### 4.2. Mode Cuisson (Cooking Mode)
* Accompagnement de l'utilisateur étape par étape pour cuisiner sans toucher sans cesse son écran.
* Partage de la réussite finale (Share API) et ajout facile aux favoris (synchronisé avec Zustand).

### 4.3. Dashboards (Profils, Chef, et Admin)
* Tableau de bord utilisateur premium avec de nombreuses options (Régime alimentaire, Langue, Mode sombre).
* Bouton de déconnexion sécurisé gérant gracieusement les différences entre les boîtes de dialogue web et mobiles.
* Espaces `ChefDashboard` et `AdminDashboard` pour la gestion professionnelle du contenu de l'application.

### 4.4. Section Avis et Commentaires
* Page d'avis complète avec possibilité de soumettre une photo.
* **Persistance Locale et Cloud :** Sauvegarde des commentaires utilisateurs sur l'appareil à l'aide de `AsyncStorage` via le module Zustand `useRecipeStore`, pour que les commentaires soumis ne disparaissent pas au rafraîchissement de l'application.
* **Correction Technique Majeure :** Résolution d'un bug majeur de React Native lié à la recréation du composant d'entête (`ListHeaderComponent`), qui provoquait la disparition du clavier à la moindre saisie.

### 4.5. Cookbooks et Listes de Courses
* Interface façon "Collage photos" pour présenter les livres de recettes (Cookbooks).
* Modale de création interactive propulsée par un `KeyboardAvoidingView` pour éviter la superposition frustrante du clavier tactile par-dessus le formulaire.

## 5. Défis Rencontrés et Solutions Apportées
1. **Compatibilité Cross-Platform (Web vs Mobile) :** Des bibliothèques (comme les alertes natives, ou le stockage persistant Firebase Auth) nécessitaient un traitement conditionnel via `Platform.OS`.
2. **Crash et Disparitions d'éléments visuels :** Sur la version Web, certains effets d'animation au scroll (`Parallax translateY`) cachaient entièrement les images lorsqu'elles étaient loin du haut de page. Nous avons ciblé l'effet uniquement sur le premier affichage (`isTopHero`).
3. **Ergonomie du Clavier Mobile :** La gestion du clavier natif a été au centre de l'attention (saisie de commentaires, modale de bas de page) pour garantir qu'aucune information n'est jamais masquée par le clavier de l'utilisateur.

## 6. Conclusion
L'application Gourmet offre désormais une base extrêmement solide avec des fondations prêtes pour de la mise à l'échelle. L'accent a été fermement maintenu sur un rendu esthétique impeccable ("wow effect"), la fluidité d'utilisation sans blocages inopportuns, et l'architecture "offline-first" garantie par AsyncStorage couplé à Firestore. Les choix de conception prouvent une maîtrise des contraintes de l'écosystème React Native sur Mobile comme sur Web.
