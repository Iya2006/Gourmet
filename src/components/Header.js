import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' }
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    await AsyncStorage.setItem('appLanguage', lng);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('appName')}</Text>
      
      <TouchableOpacity 
        style={styles.langButton} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="globe-outline" size={20} color="#D4AF37" />
        <Text style={styles.currentLangText}>{currentLang.code.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choisir la langue</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      i18n.language === item.code && styles.langOptionSelected
                    ]}
                    onPress={() => changeLanguage(item.code)}
                  >
                    <Text style={styles.langFlag}>{item.flag}</Text>
                    <Text style={[
                      styles.langLabel,
                      i18n.language === item.code && styles.langLabelSelected
                    ]}>
                      {item.label}
                    </Text>
                    {i18n.language === item.code && (
                      <Ionicons name="checkmark" size={20} color="#D4AF37" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D4AF37', 
    letterSpacing: 1,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currentLangText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  langOptionSelected: {
    backgroundColor: '#FFF8F0',
  },
  langFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  langLabel: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  langLabelSelected: {
    color: '#D4AF37',
    fontWeight: '700',
  }
});
