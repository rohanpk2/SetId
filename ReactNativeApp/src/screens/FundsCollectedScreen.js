import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows } from '../theme';

const PROFILE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpEGA88z5uer18i94FNkQJTv3AWis6jdpiDPLFqbqPPahQqWHiTtkRs230gE97pXs6aQhaa2D2OdA0R7nOmeYtp_ffeos_Dbj6HATgnbuwXEArBVZN5HQf4BNi4pEQNC2bZYOqntr5kkmCopwPBlTtnviIHG-X3NBEDoVXJce5_ZDvurlOV9cjLY1lvt24CCUgrSaJLAGvHfZ2HQ0VYQDcS6DiosipkspuiVC3p91bSaXhbfucdqxphnbWiDNp-RNGYrZmou0n';

function TopAppBar({ insets, onBack }) {
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBarInner}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
          <Text style={styles.appTitle}>WealthSplit</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: PROFILE_URL }} style={styles.avatarImg} />
          </View>
        </View>
      </View>
    </View>
  );
}

function SuccessHeader() {
  return (
    <View style={styles.successHeader}>
      <View style={styles.successIcon}>
        <MaterialIcons name="check-circle" size={32} color={colors.secondaryDim} />
      </View>
      <Text style={styles.successTitle}>Funds Collected</Text>
      <Text style={styles.successDesc}>
        Your settlement for Brew District Caf\u00e9 is ready.
      </Text>
    </View>
  );
}

function VirtualCard() {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={[colors.secondary, colors.secondaryDim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.virtualCard}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardLabel}>TOTAL SETTLEMENT</Text>
            <Text style={styles.cardAmount}>$54.50</Text>
          </View>
          <MaterialIcons name="contactless" size={36} color="rgba(227, 255, 246, 0.85)" />
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.cardNumber}>4532  8810  9924  0051</Text>
          <View style={styles.cardDetails}>
            <View style={styles.cardDetailGroup}>
              <View style={styles.cardDetailCol}>
                <Text style={styles.cardDetailLabel}>EXPIRY</Text>
                <Text style={styles.cardDetailValue}>08/26</Text>
              </View>
              <View style={styles.cardDetailCol}>
                <Text style={styles.cardDetailLabel}>CVC</Text>
                <Text style={styles.cardDetailValue}>***</Text>
              </View>
            </View>
            <View style={styles.cardDetailColRight}>
              <Text style={styles.cardDetailLabel}>MERCHANT</Text>
              <Text style={styles.cardDetailValue}>Brew District Caf\u00e9</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function InfoCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <MaterialIcons name="info" size={22} color={colors.secondary} />
        <Text style={styles.infoTitle}>One-time use only</Text>
      </View>
      <Text style={styles.infoDesc}>
        This virtual card will be deactivated immediately after the transaction is
        processed. Please ensure the amount matches your checkout total.
      </Text>
      <View style={styles.poweredRow}>
        <Text style={styles.poweredText}>POWERED BY STRIPE ISSUING</Text>
      </View>
    </View>
  );
}

function ActionButtons() {
  return (
    <View style={styles.actionGrid}>
      <TouchableOpacity activeOpacity={0.85} style={styles.payNowBtn}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryDim]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payNowGradient}
        >
          <MaterialIcons name="payment" size={22} color={colors.onSecondary} />
          <Text style={styles.payNowText}>Pay Now</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.actionRow}>
        <TouchableOpacity activeOpacity={0.8} style={styles.secondaryBtn}>
          <MaterialIcons name="content-copy" size={20} color={colors.onSurface} />
          <Text style={styles.secondaryBtnText}>Copy Details</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.secondaryBtn}>
          <MaterialIcons name="visibility" size={20} color={colors.onSurface} />
          <Text style={styles.secondaryBtnText}>Show CVC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HelpSection() {
  return (
    <View style={styles.helpSection}>
      <TouchableOpacity activeOpacity={0.7} style={styles.helpRow}>
        <View style={styles.helpLeft}>
          <MaterialIcons name="help-outline" size={22} color={colors.secondary} />
          <Text style={styles.helpText}>Having trouble paying?</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
      </TouchableOpacity>
    </View>
  );
}

function BottomNavBar({ insets }) {
  const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: false },
    { key: 'activity', label: 'Activity', icon: 'receipt-long', active: true },
    { key: 'profile', label: 'Profile', icon: 'person', active: false },
  ];

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {NAV.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navItem, item.active && styles.navItemActive]}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={item.icon}
            size={24}
            color={item.active ? colors.secondary : colors.outlineVariant}
          />
          <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function FundsCollectedScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <TopAppBar
        insets={insets}
        onBack={navigation?.canGoBack?.() ? navigation.goBack : null}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SuccessHeader />
        <VirtualCard />
        <InfoCard />
        <ActionButtons />
        <HelpSection />
      </ScrollView>

      <BottomNavBar insets={insets} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(248, 249, 250, 0.7)',
    ...Platform.select({
      ios: {},
      android: { backgroundColor: 'rgba(248, 249, 250, 0.92)' },
    }),
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  appTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.onSurface,
  },
  iconBtn: {
    padding: 4,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
  },
  avatarImg: {
    width: 32,
    height: 32,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Success Header
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  successDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },

  // Virtual Card
  cardWrapper: {
    marginBottom: 28,
  },
  virtualCard: {
    borderRadius: radii.xl,
    padding: 28,
    aspectRatio: 1.586,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
      },
      android: { elevation: 10 },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(227, 255, 246, 0.65)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  cardAmount: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onSecondary,
  },
  cardBottom: {},
  cardNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 3,
    color: colors.onSecondary,
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDetailGroup: {
    flexDirection: 'row',
    gap: 28,
  },
  cardDetailCol: {},
  cardDetailColRight: {
    alignItems: 'flex-end',
  },
  cardDetailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 2,
    color: 'rgba(227, 255, 246, 0.55)',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cardDetailValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSecondary,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: 24,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  infoDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: 16,
  },
  poweredRow: {
    paddingTop: 12,
  },
  poweredText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.outline,
    textTransform: 'uppercase',
  },

  // Action Buttons
  actionGrid: {
    gap: 14,
    marginBottom: 40,
  },
  payNowBtn: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.settleButton,
  },
  payNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: radii.xl,
  },
  payNowText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 14,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 16,
    borderRadius: radii.xl,
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },

  // Help Section
  helpSection: {
    marginBottom: 16,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    ...shadows.card,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  helpText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    fontWeight: '500',
    color: colors.onSurface,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    ...Platform.select({
      ios: {},
      android: { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
    }),
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    ...shadows.ambient,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 108, 92, 0.08)',
  },
  navLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
    color: colors.outlineVariant,
  },
  navLabelActive: {
    color: colors.secondary,
  },
});
