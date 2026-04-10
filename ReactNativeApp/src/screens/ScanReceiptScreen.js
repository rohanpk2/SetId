import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows } from '../theme';

const { width: SW, height: SH } = Dimensions.get('window');

const CAMERA_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-Fchp0fSBh81KZQGjJCzaIHp0utBLBRiMxbw5SLjl-dr_Xh1S6pt4SxoXn5118Rv6_CjxV_f2Du6fnIp0N4swqYfjtwdLRZiSw2Du8ezNBA0HOS8ZinHCTkW2TAJspI1xo-gnhYDwUQ_UmBoeq6EWq9_YHe7H7UKtOwYGEV6psxOLUtMwkndMQOF56gHFwI3GsRAQqZO5hXn1cbeLQe-USQg2N6Jv8lBcnB2d6ydxeGPqLKZXItreQWqNCw8_FSCE4q06STp';

const PROFILE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDt9lV7G2AP7PIZoPHFTLr4qxab7qAKH6lDBf-j11jNur225WgcKfrytb1MDCliJ2tXNiRZ6zDYUzZW7d1zyV8x4BxqQ41LhdtzYHlgxxVyVKU31gCSC70fx0JEZJBcCwqvSr-rkD91VnMZAxMN9qcefqDR1I5Sbx7A-FX5IIK9Rco1EVm1R0zDbPSO1COSR_Ho2v9SyZMCHTlL53fjSlF3FYNaBtrDK7_II1HQoncRlClpIrAAdxi_jTNEk5JafXJw2H3_5XfT';

const RETICLE_W = SW - 96;
const RETICLE_H = RETICLE_W * 1.15;
const CORNER = 28;

function ScanLine() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: RETICLE_H - 4,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [translateY]);

  return (
    <Animated.View
      style={[styles.scanLine, { transform: [{ translateY }] }]}
    >
      <LinearGradient
        colors={['transparent', colors.secondaryContainer, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.scanLineGradient}
      />
    </Animated.View>
  );
}

function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.pulsingDot, { opacity }]} />
  );
}

function CornerBracket({ position }) {
  const posStyles = {
    topLeft: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 10 },
    topRight: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 10 },
    bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 10 },
    bottomRight: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 10 },
  };

  return (
    <View
      style={[
        styles.cornerBracket,
        posStyles[position],
      ]}
    />
  );
}

function TopBar({ insets, onClose }) {
  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <View style={styles.topBarInner}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.topBarBtn}>
            <MaterialIcons name="close" size={24} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>WealthSplit</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity activeOpacity={0.7} style={styles.topBarBtn}>
            <MaterialIcons name="flash-on" size={22} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
          <View style={styles.topBarAvatar}>
            <Image source={{ uri: PROFILE_URL }} style={styles.topBarAvatarImg} />
          </View>
        </View>
      </View>
    </View>
  );
}

function Reticle() {
  return (
    <View style={styles.reticleContainer}>
      <View style={styles.reticle}>
        <CornerBracket position="topLeft" />
        <CornerBracket position="topRight" />
        <CornerBracket position="bottomLeft" />
        <CornerBracket position="bottomRight" />
        <ScanLine />

        <View style={styles.floatingBadgeMerchant}>
          <MaterialIcons name="store" size={12} color={colors.onSecondaryContainer} />
          <Text style={styles.floatingBadgeText}>MERCHANT FOUND</Text>
        </View>
      </View>
    </View>
  );
}

function StatusCard() {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <View>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={styles.statusTitle}>Scanning Receipt\u2026</Text>
        </View>
        <View style={styles.aiBadge}>
          <PulsingDot />
          <Text style={styles.aiBadgeText}>AI Processing</Text>
        </View>
      </View>

      <View style={styles.merchantRow}>
        <View style={styles.merchantIcon}>
          <MaterialIcons name="local-cafe" size={24} color={colors.secondary} />
        </View>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantName}>Brew District Caf\u00e9</Text>
          <Text style={styles.merchantAmount}>$24.50</Text>
        </View>
        <View style={styles.confidenceCol}>
          <Text style={styles.confidenceLabel}>CONFIDENCE</Text>
          <Text style={styles.confidenceValue}>98.2%</Text>
        </View>
      </View>
    </View>
  );
}

function ShutterControls() {
  return (
    <View style={styles.shutterRow}>
      <TouchableOpacity activeOpacity={0.7} style={styles.sideBtn}>
        <MaterialIcons name="image" size={28} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={styles.shutterOuter}>
        <View style={styles.shutterInner}>
          <View style={styles.shutterCore} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} style={styles.sideBtn}>
        <MaterialIcons name="history" size={28} color="rgba(255,255,255,0.6)" />
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

export default function ScanReceiptScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image source={{ uri: CAMERA_BG }} style={styles.cameraBg} />
      <View style={styles.cameraOverlay} />

      <TopBar
        insets={insets}
        onClose={navigation?.canGoBack?.() ? navigation.goBack : null}
      />

      <Reticle />

      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 80 }]}>
        <StatusCard />
        <ShutterControls />
      </View>

      <BottomNavBar insets={insets} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Camera BG
  cameraBg: {
    ...StyleSheet.absoluteFillObject,
    width: SW,
    height: SH,
    opacity: 0.75,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topBarBtn: {
    padding: 6,
  },
  topBarTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: -0.3,
  },
  topBarAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
  },
  topBarAvatarImg: {
    width: 32,
    height: 32,
  },

  // Reticle
  reticleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  reticle: {
    width: RETICLE_W,
    height: RETICLE_H,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  cornerBracket: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.secondaryContainer,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    zIndex: 5,
  },
  scanLineGradient: {
    flex: 1,
  },

  // Floating Badges
  floatingBadgeMerchant: {
    position: 'absolute',
    top: '28%',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(104, 250, 221, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  floatingBadgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.onSecondaryContainer,
    textTransform: 'uppercase',
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 24,
    gap: 20,
  },

  // Status Card
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: radii.xl,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
      },
      android: { elevation: 8 },
    }),
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statusTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 18,
    fontWeight: '800',
    color: colors.onSurface,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  aiBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },

  // Merchant Row
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: 14,
  },
  merchantIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  merchantAmount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.onSurface,
  },
  confidenceCol: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  confidenceValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },

  // Shutter Controls
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  sideBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
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
