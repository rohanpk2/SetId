import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows } from '../theme';

const SUBTOTAL = 13.05;
const SERVICE_FEE_RATE = 0.03;
const TAX_RATE = 0.10;
const SERVICE_FEE = parseFloat((SUBTOTAL * SERVICE_FEE_RATE).toFixed(2));
const TAX = parseFloat((SUBTOTAL * TAX_RATE).toFixed(2));

const TIP_OPTIONS = [
  { label: '15%', value: 0.15 },
  { label: '18%', value: 0.18 },
  { label: '20%', value: 0.20 },
  { label: '25%', value: 0.25 },
  { label: 'CUSTOM', value: 'custom' },
];

const PARTICIPANT_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqtrTR39cQ7b0XQ8mxVOmLymuC64xlypncTrrCNt5cx9sO31SvTG5s0aDfcakGG2TfBtTKhrD4CYSW-nHRXVIEuJP8-OlfOL06dj6PAtdSIr2jovuMKYoLS_kt4fVAi_mTwjku14OatOAg7uXDOyAeTYNDAqgP69gmRU2LG-zc8Ozbwl6tl4RZ6t4uXkjAMWaPxllyxkwPhpA80XppWhN2eGyUVcE3aBDgIv6esKKZlvbpPHwPraEc2d9OtV7hxdyVbc8aNnzk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBBXU8CfIgtW6cIOu-UFuLExkHc8V6-kCfusNxMv6zsWCBmOrQl8Z-wPOm4beJObyx4-aw5OECl9T2zYLkudxhxL2qWFuY5Km_pZaRzM-clfY-5znfP_kEPjLqJ1KzYxVuzTsml6m2S9JmaFsR63YiQ8M8jVbC5HGXJ-9NGdLxknleU__T7fFfM_7OK9wC2lB7oWkQg_asrfsImi5W9zTDpvoYekeMRFhar1WgyPssXeNXmRukCWPmc66fq405U1Q5RPSJ7GQaE',
];

const LINE_ITEMS = [
  { name: 'Iced Vanilla Latte', desc: 'Regular milk, extra shot', price: 5.80 },
  { name: 'Avocado Smash Toast (Shared)', desc: 'Split with 1 person', price: 7.25 },
];

function TopBar({ insets, onBack }) {
  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onBack} style={styles.topBarBtn} activeOpacity={0.7}>
        <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>Review Payment</Text>
      <TouchableOpacity style={styles.topBarBtn} activeOpacity={0.7}>
        <MaterialIcons name="more-vert" size={24} color={colors.onSurfaceVariant} />
      </TouchableOpacity>
    </View>
  );
}

function MerchantHero() {
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroIcon}>
        <MaterialIcons name="local-cafe" size={36} color={colors.secondary} />
      </View>
      <Text style={styles.heroName}>Brew District Caf\u00e9</Text>
      <Text style={styles.heroDesc}>
        Your share of the bill for breakfast with Morning Hakim.
      </Text>
    </View>
  );
}

function ReceiptLineItem({ item }) {
  return (
    <View style={styles.lineItem}>
      <View style={styles.lineItemLeft}>
        <Text style={styles.lineItemName}>{item.name}</Text>
        <Text style={styles.lineItemDesc}>{item.desc}</Text>
      </View>
      <Text style={styles.lineItemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );
}

function TonalDivider() {
  return <View style={styles.tonalDivider} />;
}

function DashedDivider() {
  return <View style={styles.dashedDivider} />;
}

function TipSelector({ selectedTip, onSelect }) {
  return (
    <View style={styles.tipSection}>
      <Text style={styles.tipLabel}>ADD A TIP</Text>
      <View style={styles.tipRow}>
        {TIP_OPTIONS.map((option) => {
          const isActive =
            option.value === 'custom'
              ? selectedTip.type === 'custom'
              : selectedTip.type === 'percent' && selectedTip.value === option.value;
          return (
            <TouchableOpacity
              key={option.label}
              onPress={() => onSelect(option)}
              activeOpacity={0.8}
              style={[styles.tipChip, isActive && styles.tipChipActive]}
            >
              <Text
                style={[
                  styles.tipChipText,
                  isActive && styles.tipChipTextActive,
                  option.value === 'custom' && styles.tipChipCustomText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={styles.breakdownValue}>{value}</Text>
    </View>
  );
}

function ProgressiveReceipt({ selectedTip, onSelectTip, tipAmount, total }) {
  const tipLabel =
    selectedTip.type === 'custom'
      ? 'Custom'
      : `${Math.round(selectedTip.value * 100)}%`;

  return (
    <View style={[styles.receiptCard, shadows.card]}>
      {LINE_ITEMS.map((item, i) => (
        <ReceiptLineItem key={i} item={item} />
      ))}

      <TonalDivider />

      <TipSelector selectedTip={selectedTip} onSelect={onSelectTip} />

      <TonalDivider />

      <View style={styles.breakdownSection}>
        <BreakdownRow label="Subtotal" value={`$${SUBTOTAL.toFixed(2)}`} />
        <BreakdownRow label="Service Fee (3%)" value={`$${SERVICE_FEE.toFixed(2)}`} />
        <BreakdownRow label="Tax (10%)" value={`$${TAX.toFixed(2)}`} />
        <BreakdownRow label={`Tip (${tipLabel})`} value={`$${tipAmount.toFixed(2)}`} />
      </View>

      <DashedDivider />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total to Pay</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

function PaymentButtons() {
  return (
    <View style={styles.paymentButtons}>
      <TouchableOpacity activeOpacity={0.85} style={styles.applePayButton}>
        <Text style={styles.applePayIcon}>{'\uF8FF'}</Text>
        <Text style={styles.applePayText}>Pay with Apple Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.85} style={styles.cardPayButton}>
        <Text style={styles.cardPayText}>Pay with Credit/Debit Card</Text>
      </TouchableOpacity>
    </View>
  );
}

function EditorialDetails() {
  return (
    <View style={styles.detailsGrid}>
      <View style={styles.detailCard}>
        <MaterialIcons
          name="group"
          size={22}
          color={colors.secondary}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>PARTICIPANTS</Text>
        <View style={styles.participantAvatars}>
          {PARTICIPANT_AVATARS.map((url, i) => (
            <Image
              key={i}
              source={{ uri: url }}
              style={[styles.participantAvatar, i > 0 && { marginLeft: -8 }]}
            />
          ))}
          <View style={[styles.participantOverflow, { marginLeft: -8 }]}>
            <Text style={styles.participantOverflowText}>+2</Text>
          </View>
        </View>
      </View>
      <View style={styles.detailCard}>
        <MaterialIcons
          name="security"
          size={22}
          color={colors.secondary}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>SECURITY</Text>
        <Text style={styles.detailValue}>End-to-end encrypted payment</Text>
      </View>
    </View>
  );
}

function BottomNavBar({ insets }) {
  const NAV = [
    { key: 'activity', label: 'Activity', icon: 'receipt-long', active: false },
    { key: 'split', label: 'Split', icon: 'group-add', active: true },
    { key: 'scan', label: 'Scan', icon: 'qr-code-scanner', active: false },
    { key: 'wallet', label: 'Wallet', icon: 'account-balance-wallet', active: false },
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

export default function ReviewPaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedTip, setSelectedTip] = useState({ type: 'percent', value: 0.20 });

  const tipAmount = parseFloat(
    selectedTip.type === 'custom'
      ? selectedTip.amount.toFixed(2)
      : (SUBTOTAL * selectedTip.value).toFixed(2),
  );
  const total = SUBTOTAL + SERVICE_FEE + TAX + tipAmount;

  const handleSelectTip = useCallback((option) => {
    if (option.value === 'custom') {
      Alert.prompt(
        'Custom Tip',
        'Enter tip amount ($):',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: (val) => {
              const parsed = parseFloat(val) || 0;
              setSelectedTip({ type: 'custom', value: 'custom', amount: parsed });
            },
          },
        ],
        'plain-text',
        '3.00',
        'decimal-pad',
      );
    } else {
      setSelectedTip({ type: 'percent', value: option.value });
    }
  }, []);

  return (
    <View style={styles.root}>
      <TopBar
        insets={insets}
        onBack={navigation?.canGoBack?.() ? navigation.goBack : null}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MerchantHero />
        <ProgressiveReceipt
          selectedTip={selectedTip}
          onSelectTip={handleSelectTip}
          tipAmount={tipAmount}
          total={total}
        />
        <PaymentButtons />
        <EditorialDetails />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: 'rgba(248, 249, 250, 0.7)',
    ...Platform.select({
      ios: {},
      android: { backgroundColor: 'rgba(248, 249, 250, 0.92)' },
    }),
  },
  topBarBtn: {
    padding: 8,
    borderRadius: radii.full,
  },
  topBarTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.onSurface,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },

  // Receipt Card
  receiptCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: 28,
    marginBottom: 28,
  },

  // Line Items
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  lineItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  lineItemName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 3,
  },
  lineItemDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  lineItemPrice: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },

  // Dividers
  tonalDivider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
    marginVertical: 20,
  },
  dashedDivider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
    marginTop: 20,
    marginBottom: 16,
  },

  // Tip Section
  tipSection: {
    gap: 14,
  },
  tipLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(171, 179, 183, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipChipActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(0, 108, 92, 0.08)',
  },
  tipChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  tipChipTextActive: {
    color: colors.secondary,
  },
  tipChipCustomText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Breakdown
  breakdownSection: {
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  breakdownValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurface,
  },

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  totalAmount: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.secondary,
  },

  // Payment Buttons
  paymentButtons: {
    gap: 14,
    marginBottom: 40,
  },
  applePayButton: {
    backgroundColor: colors.onSurface,
    height: 60,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  applePayIcon: {
    fontSize: 22,
    color: colors.surfaceContainerLowest,
  },
  applePayText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.surfaceContainerLowest,
  },
  cardPayButton: {
    backgroundColor: colors.surfaceContainerHigh,
    height: 60,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPayText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },

  // Editorial Details
  detailsGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 32,
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: 20,
  },
  detailIcon: {
    marginBottom: 10,
  },
  detailLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 17,
  },

  // Participant Avatars
  participantAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLow,
  },
  participantOverflow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLow,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantOverflowText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...shadows.ambient,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 108, 92, 0.06)',
  },
  navLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
    color: colors.outlineVariant,
  },
  navLabelActive: {
    color: colors.secondary,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
});
