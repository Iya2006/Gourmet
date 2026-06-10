import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function ProfileScreen() {
  const { user, userProfile, preferences, updatePreferences, signOut } = useAuthStore();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useAppTheme();
  const { toggleTheme, loadTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [cuisineModalVisible, setCuisineModalVisible] = useState(false);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const diets = ['Végétarien', 'Vegan', 'Sans gluten', 'Keto', 'Halal', 'Sans produits laitiers'];
  const cuisines = ['Française', 'Italienne', 'Asiatique', 'Africaine', 'Mexicaine', 'Américaine', 'Indienne', 'Camerounaise', 'Sénégalaise'];
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' }
  ];

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
        await signOut();
      }
    } else {
      Alert.alert(
        "Déconnexion",
        "Voulez-vous vraiment vous déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Se déconnecter", 
            style: "destructive",
            onPress: async () => {
              await signOut();
            }
          }
        ]
      );
    }
  };

  const changeLanguage = async (code) => {
    await AsyncStorage.setItem('appLanguage', code);
    i18n.changeLanguage(code);
    setLanguageModalVisible(false);
  };

  const currentLanguageLabel = languages.find(l => l.code === i18n.language)?.label || 'Français';

  const SettingRow = ({ icon, title, value, hasSwitch, switchValue, onValueChange, onPress, color }) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={() => {
        if (onPress) onPress();
        else if (hasSwitch && onValueChange) onValueChange(!switchValue);
      }} 
      disabled={!onPress && !hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={color || colors.text} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: color || colors.text }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        {hasSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onValueChange} 
            trackColor={{ true: colors.primary, false: colors.border }} 
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SelectionModal = ({ visible, title, data, selectedValue, onSelect, onClose, isMulti }) => {
    const isSelected = (item) => {
      if (isMulti) {
        return Array.isArray(selectedValue) && selectedValue.includes(item.label || item);
      }
      return selectedValue === (item.label || item);
    };

    return (
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, isSelected(item) && { backgroundColor: colors.primary + '10' }]}
                  onPress={() => {
                    if (item.code) {
                      onSelect(item.code); // Language uses single select with code
                    } else {
                      onSelect(item.label || item);
                    }
                  }}
                >
                  <Text style={[
                    styles.modalItemText, 
                    { color: colors.text },
                    isSelected(item) && { color: colors.primary, fontWeight: 'bold' }
                  ]}>
                    {item.label || item}
                  </Text>
                  {isSelected(item) && (
                    <Ionicons name={isMulti ? "checkbox" : "checkmark"} size={20} color={colors.primary} />
                  )}
                  {!isSelected(item) && isMulti && (
                    <Ionicons name="square-outline" size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: colors.background }]} onPress={onClose}>
              <Text style={[styles.modalCloseText, { color: colors.text }]}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('profileTitle')}</Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userInfoCard, { backgroundColor: colors.card }]}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={32} color="#FFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userEmail, { color: colors.text }]}>{user?.email || "Utilisateur"}</Text>
          </View>
        </View>

        {/* Dashboard Access */}
        {(userProfile?.role === 'admin' || userProfile?.role === 'chef') && (
          <TouchableOpacity 
            style={[styles.dashboardBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate(userProfile.role === 'admin' ? 'AdminDashboard' : 'ChefDashboard')}
            activeOpacity={0.8}
          >
            <Ionicons name={userProfile.role === 'admin' ? 'shield-checkmark' : 'restaurant'} size={20} color="#FFF" />
            <Text style={styles.dashboardBtnText}>
              {userProfile.role === 'admin' ? t('adminDashboard') : t('chefDashboard')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Section: Informations personnelles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('personalInfo')}</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow icon="mail-outline" title={t('email')} value={user?.email || t('notSpecified')} color={colors.text} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingRow 
              icon="restaurant-outline" 
              title={t('diet')} 
              value={preferences?.diets?.length > 0 ? `${preferences.diets.length} sélectionné(s)` : 'Aucun'} 
              onPress={() => setDietModalVisible(true)} 
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingRow 
              icon="earth-outline" 
              title={t('cuisines')} 
              value={preferences?.cuisines?.length > 0 ? `${preferences.cuisines.length} sélectionnée(s)` : 'Toutes'} 
              onPress={() => setCuisineModalVisible(true)} 
            />
          </View>
        </View>

        {/* Section: Système */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('system')}</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow icon="language-outline" title={t('language')} value={currentLanguageLabel} onPress={() => setLanguageModalVisible(true)} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingRow icon="notifications-outline" title={t('notifications')} hasSwitch switchValue={true} onValueChange={() => {}} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingRow 
              icon="moon-outline" 
              title={t('darkMode')} 
              hasSwitch 
              switchValue={isDarkMode} 
              onValueChange={toggleTheme}
            />
          </View>
        </View>

        {/* Bouton Déconnexion */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' }]} 
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" style={{ marginRight: 0 }} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <SelectionModal 
        visible={dietModalVisible} 
        title={t('selectDiet')} 
        data={diets} 
        selectedValue={preferences?.diets || []}
        isMulti={true}
        onSelect={(val) => {
          const current = preferences?.diets || [];
          const newArray = current.includes(val) ? current.filter(item => item !== val) : [...current, val];
          updatePreferences({ diets: newArray });
        }} 
        onClose={() => setDietModalVisible(false)} 
      />
      <SelectionModal 
        visible={cuisineModalVisible} 
        title={t('selectCuisine')} 
        data={cuisines} 
        selectedValue={preferences?.cuisines || []}
        isMulti={true}
        onSelect={(val) => {
          const current = preferences?.cuisines || [];
          const newArray = current.includes(val) ? current.filter(item => item !== val) : [...current, val];
          updatePreferences({ cuisines: newArray });
        }} 
        onClose={() => setCuisineModalVisible(false)} 
      />
      <SelectionModal 
        visible={languageModalVisible} 
        title="Choisir une langue" 
        data={languages} 
        selectedValue={currentLanguageLabel} 
        onSelect={changeLanguage} 
        onClose={() => setLanguageModalVisible(false)} 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    height: 1,
    marginLeft: 54,
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  dashboardBtnText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444', // red text
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
