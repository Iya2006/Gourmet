import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, es, ar } from 'date-fns/locale';

const locales = {
  fr: fr,
  en: enUS,
  es: es,
  ar: ar
};

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuthStore();
  const { colors, isDarkMode } = useAppTheme();
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLocale = locales[i18n.language.substring(0, 2)] || fr;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error("Erreur écoute notifications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationPress = async (item) => {
    // Marquer comme lu
    if (!item.read) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'notifications', item.id), {
          read: true
        });
      } catch (e) {
        console.error("Erreur update notification:", e);
      }
    }

    // Navigation si data.recipeId existe (ex: title de la recette ou ID)
    if (item.data && item.data.recipeId) {
      navigation.navigate('Details', { recipeTitle: item.data.recipeId }); 
      // Note: Assurez-vous que DetailsScreen peut chercher par recipeTitle si l'ID n'est pas passé
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous supprimer cette notification ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', user.uid, 'notifications', id));
            } catch (e) {
              console.error("Erreur suppression:", e);
            }
          }
        }
      ]
    );
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(db);
      unread.forEach(n => {
        const ref = doc(db, 'users', user.uid, 'notifications', n.id);
        batch.update(ref, { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.error("Erreur markAllAsRead:", e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notifCard, 
        { backgroundColor: item.read ? colors.card : (isDarkMode ? '#2A2A2A' : '#FFF0E6') },
        !item.read && { borderLeftColor: colors.primary, borderLeftWidth: 4 }
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notifIconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: item.read ? colors.border : colors.primary }]}>
          <Ionicons name="restaurant" size={20} color={item.read ? colors.textSecondary : '#FFF'} />
        </View>
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, { color: colors.text, fontWeight: item.read ? '600' : 'bold' }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={[styles.notifDate, { color: colors.textSecondary }]}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: currentLocale })}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        
        {notifications.some(n => !n.read) ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.headerRightBtn}>
            <Ionicons name="checkmark-done" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notifIconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notifBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notifDate: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  }
});
