import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import LandingCtaButton from '../components/LandingCtaButton';
import { colors, spacing } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const navLock = useRef(false);

  const goToSignup = useCallback(() => {
    if (navLock.current) return;
    navLock.current = true;
    navigation.navigate('PhoneAuth');
    setTimeout(() => {
      navLock.current = false;
    }, 600);
  }, [navigation]);

  const goToLogin = useCallback(() => {
    if (navLock.current) return;
    navLock.current = true;
    navigation.navigate('Login');
    setTimeout(() => {
      navLock.current = false;
    }, 600);
  }, [navigation]);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <StatusBar style="dark" />

      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Splitter</Text>
        <Text style={styles.tagline}>CURATED FINANCE</Text>
      </View>

      <View style={styles.ctaColumn}>
        <LandingCtaButton label="Get Started" variant="primary" onPress={goToSignup} />
        <Text style={styles.footer}>© 2024 CURATOR FINANCE  EDITORIAL PRECISION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 36,
    fontWeight: '800',
    color: '#2B3437',
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  ctaColumn: {
    paddingHorizontal: spacing['2xl'],
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: '#D1D5DB',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
});
