/**
 * notificationService.js
 *
 * Service complet de notifications push pour l'application Gourmet.
 * Utilise expo-notifications + Expo Push API (sans serveur backend requis).
 *
 * Fonctionnalités :
 * - Demande de permission à l'utilisateur
 * - Génération du token push Expo
 * - Sauvegarde du token dans Firestore
 * - Réception et affichage des notifications en foreground
 * - Sauvegarde de l'historique des notifications in-app dans Firestore
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { collection, getDocs, doc, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebaseConfig';

// ── Configuration globale de l'affichage des notifications en premier plan ──
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // Afficher une bannière même si l'app est ouverte
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Demande la permission de notifications et retourne le token push Expo.
 * Retourne null si l'appareil ne supporte pas les notifications (ex: simulateur).
 */
export async function registerForPushNotificationsAsync() {
  // Les notifications push ne fonctionnent PAS sur les simulateurs
  if (!Device.isDevice) {
    console.log('⚠️ Notifications push : appareil physique requis.');
    return null;
  }

  // Vérifier/demander la permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permission de notification refusée.');
    return null;
  }

  // Canal Android (obligatoire pour Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('gourmet-default', {
      name: 'Nouvelles Recettes',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
      sound: 'default',
    });
  }

  // Obtenir le token Expo Push
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) {
      console.warn("⚠️ Projet EAS non configuré. Les notifications Push nécessitent 'eas init' avec un vrai projectId UUID.");
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId, // DOIT être un UUID valide (généré via eas init)
    });
    return tokenData.data;
  } catch (e) {
    console.error('Erreur token push:', e);
    return null;
  }
}

/**
 * Sauvegarde le token push de l'utilisateur dans Firestore
 * et enregistre sa préférence de notification.
 */
export async function savePushTokenToFirestore(userId, token, notificationsEnabled = true) {
  if (!userId || !token) return;
  try {
    await updateDoc(doc(db, 'users', userId), {
      pushToken: token,
      notificationsEnabled,
      tokenUpdatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Erreur sauvegarde token:', e);
  }
}

/**
 * Met à jour uniquement la préférence notification (activé/désactivé)
 * sans changer le token.
 */
export async function updateNotificationPreference(userId, enabled) {
  if (!userId) return;
  try {
    await updateDoc(doc(db, 'users', userId), {
      notificationsEnabled: enabled,
    });
  } catch (e) {
    console.error('Erreur mise à jour préférence:', e);
  }
}

/**
 * Envoie une notification push à TOUS les utilisateurs abonnés
 * via l'Expo Push Notification Service (gratuit, pas de backend requis).
 *
 * @param {string} title - Titre de la notification
 * @param {string} body - Corps du message
 * @param {object} data - Données supplémentaires (ex: recipeId pour navigation)
 */
export async function sendPushNotificationToAllSubscribers(title, body, data = {}) {
  try {
    // 1. Récupérer tous les utilisateurs avec notifications activées
    const usersSnap = await getDocs(
      query(collection(db, 'users'), where('notificationsEnabled', '==', true))
    );

    const tokens = [];
    const userIds = [];
    usersSnap.docs.forEach((d) => {
      userIds.push(d.id);
      const token = d.data().pushToken;
      if (token && token.startsWith('ExponentPushToken[')) {
        tokens.push(token);
      }
    });

    // Sauvegarde in-app de la notification pour tous ces utilisateurs
    if (userIds.length > 0) {
      const batch = writeBatch(db);
      const timestamp = new Date().toISOString();
      userIds.forEach((uid) => {
        const notifRef = doc(collection(db, 'users', uid, 'notifications'));
        batch.set(notifRef, {
          title,
          body,
          data,
          read: false,
          createdAt: timestamp
        });
      });
      await batch.commit();
      console.log(`✅ Historique de notification sauvegardé pour ${userIds.length} utilisateurs.`);
    }

    if (tokens.length === 0) {
      console.log('Aucun abonné avec un token valide.');
      return;
    }

    // 2. Construire les messages par batch de 100 (limite Expo)
    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      badge: 1,
      channelId: 'gourmet-default',
    }));

    // 3. Envoyer via l'API Expo Push (par chunks de 100)
    const CHUNK_SIZE = 100;
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();
      console.log(`✅ Notifications envoyées (batch ${i / CHUNK_SIZE + 1}):`, result);
    }
  } catch (e) {
    console.error('Erreur envoi notifications:', e);
  }
}

/**
 * Planifie une notification locale immédiate (utile pour tests sans token).
 */
export async function sendLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: null, // null = immédiat
  });
}
