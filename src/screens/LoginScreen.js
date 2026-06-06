import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore();
  const { colors, isDarkMode } = useAppTheme();
  const styles = getStyles(colors, isDarkMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Animation pour le loader
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isLoading, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('errorEmpty'));
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e) {
      Alert.alert(t('error'), e.message);
      clearError();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="restaurant" size={40} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.tagline}>
            {isLogin ? t('loginTitle') : t('registerTitle')}
          </Text>
        </View>
        
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('password')}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && { opacity: 0.7 }]} 
            onPress={handleAuth} 
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {isLogin ? t('loginButton') : t('registerButton')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Switch */}
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => {
            setIsLogin(!isLogin);
            clearError();
          }}
          disabled={isLoading}
        >
          <Text style={styles.switchText}>
            {isLogin ? t('switchRegister') : t('switchLogin')}
          </Text>
        </TouchableOpacity>

        {/* Admin Access (Hidden or just for dev for now) */}
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => {
            navigation.replace('AdminDashboard');
          }}
          disabled={isLoading}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.adminText}>
            Accès Administrateur
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: colors.card }]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <View style={[styles.loadingIconCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="restaurant" size={30} color="#FFF" />
              </View>
            </Animated.View>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              {t('loading') || 'Chargement...'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: isDarkMode ? 'rgba(255, 107, 0, 0.1)' : '#FFF5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#D4AF37', // Kept gold
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: isDarkMode ? 0.3 : 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  switchButton: {
    marginTop: 28,
    alignItems: 'center',
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  adminButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  adminText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  loadingIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
