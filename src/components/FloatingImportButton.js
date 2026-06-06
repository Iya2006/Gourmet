import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function FloatingImportButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Import a recipe</Text>
                
                <TouchableOpacity style={styles.importOption} onPress={() => {
                  alert('Import from website coming soon!');
                  setModalVisible(false);
                }}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="globe-outline" size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.optionText}>From a website</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.importOption} onPress={() => {
                  alert('Import from Instagram coming soon!');
                  setModalVisible(false);
                }}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="logo-instagram" size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.optionText}>From Instagram</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 999, // Make sure it floats above everything
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  importOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
  }
});
