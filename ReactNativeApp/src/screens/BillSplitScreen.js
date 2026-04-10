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
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAaQwDh5skfl8-M0y7jVdnxKmDyUi45gBHbGzjNxJ7qMMxKkq5Oz762otWKoVbUgpsUNBM_wF2sUN2CXoaohNH3MsZaUipP823mblKY-JPRI0fP4cDStXTGVVVPWl6MlDbEbdEhR3oUNjbXgFqfnxh9u7vgWSg2J24ZYE6jajF4QmE8In-9YtfoIhATqLjkFzBLdRAafLK-SjxtBb57YfFNs1M8B0SKlzCkMa0Nd4DaL-sj77UmSCX9XFFnfLv9BUUaeKHtCjGm';

const MEMBER_AVATARS = {
  me: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkGKjBvfLWGDSq86bKoBiFboyBRlsXEe34JWxun8O0pZdvr6_3aXSM2bkB3bNcNeCHPr38efY9MoVczg02cb_W6uXSr35gBtYgKnpC3uRxLkYAb_52ly3tsJMw9R227QlPLsJIIGj4uFLDSBs0YxWsbzNvLgdOKDXJBNGpGQ7URLodc9VPPFUNnLLHj598XpeCpxeg5YvURxHYr7sAOGK_UE5ZR7G0lBmhF_a5XFSvflKL-T0BddDVDuimrtMOCRQ7dK1Tl4KW',
  sarah:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrIoLdqgXRLeHybbvIM7_gujAeZvkhdhczthjfOgqfb2jTaDgTXIh1CXb5v-4fNGKj8e5l-FTjpB81LEJg09_3YgGePMcm4LvP49zdliOPpVxniOez7sGb2ek3QcmxcXEac96AYa0adLBK3ZmQlV5iZhHwXEGEVyDvNx7crMpekSSkrqjkux2YmkZygJ60GFdIimKSN2S5MVH9NYKexhq8cj1baiD1h9v7M57zSrDwACPOcUpcBI6Tthnbk2iMHDhkzfW6FhpG',
  mike: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbjh6NnSNERqNP6VeCBCq_kHJdYaW9YtGERST48d9zpUpvq4f_LGIawO7nHgFv1JkdTHS3Uadm2LCshWfvEwiz0V0yPeLRNHc1B_-K5b4wiwuxRXgxFYnlSyFOdwUh-P0NQvpOFzF71Xz3qIneAPm-iivxqz0zf5fFMBe9CO24QO-4vD2SLZ83gsuA0cwEWzZ7LiuVr2E7K8lduB38Ylkllj-S2sTOI1wIr5jYewRJK0lee3n38uSabaQDMm7ZiGHnuEZLZK-d',
};

const ITEM_AVATARS = {
  latte:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAW7R_5vJNsvm0uB52nbWw94G4_7OKC2W0vIEesJoXe5XzdHpgQOqoPT1_pht1Ug9Em62ZlKXS7OgdicooBGqoU2P7Hv2P8Do3ssM3IuYjP6cnPI8W3oHOidN7B8R55Bj3BQpZJiWqev9kG_2VKH_p5oHv70kDcJY_7tQwJQkD87_zpaIFldu0JozLuLcSArW9KGehVrYeVNBOoogpQ2s5qbeCBh451d9atxGVwYLFU5_sEcSKfTRa-Mq3hRxfekDdNtng34yh9',
  croissant:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ3ydJSzM09o7xLP-yDfDzSXVN0bcEjA-dTUvHXYPzMCuai1n6bNkr6DgyRTBFxbYmKKu8ThAqgBCLap8sdlRmI_Ammep4-0Z99e9YTuDkqJ63-3wGae7BHTCg7NT7IUlC4TYFI4WclmJGE3bhVIC7OgeA2FuD6UXsJUG4xLfHTLurjN9rvjf5gb-20wtPV05uqV4gWIVHd8j3GWs0dfX7BfM0XyyOYl-gsGOWE5WrZnDX6-tiwMZZmZB_OmrXsE2kGf3Ub9k-',
};

const INITIAL_ITEMS = [
  {
    id: '1',
    name: 'Iced Vanilla Latte',
    price: 5.8,
    assignedTo: ['me'],
    avatars: [{ type: 'image', uri: ITEM_AVATARS.latte }],
    extraCount: 1,
    unassigned: false,
  },
  {
    id: '2',
    name: 'Croissant Butter',
    price: 4.25,
    assignedTo: ['sarah'],
    avatars: [{ type: 'image', uri: ITEM_AVATARS.croissant }],
    extraCount: 0,
    unassigned: false,
  },
  {
    id: '3',
    name: 'Avocado Smash Toast',
    price: 14.5,
    assignedTo: ['mike'],
    avatars: [{ type: 'icon', name: 'person' }],
    extraCount: 0,
    unassigned: false,
  },
  {
    id: '4',
    name: 'Double Espresso',
    price: 3.45,
    assignedTo: [],
    avatars: [],
    extraCount: 0,
    unassigned: true,
  },
];

const MEMBERS_LIST = ['me', 'sarah', 'mike'];
const MEMBER_LABELS = { me: 'Me', sarah: 'Sarah', mike: 'Mike' };

const MEMBERS_SUMMARY = [
  { key: 'me', name: 'You', items: 2, amount: '$9.25', avatar: MEMBER_AVATARS.me },
  { key: 'sarah', name: 'Sarah Jenkins', items: 1, amount: '$4.25', avatar: MEMBER_AVATARS.sarah },
  { key: 'mike', name: 'Mike Ross', items: 1, amount: '$14.50', avatar: MEMBER_AVATARS.mike },
];

function TopAppBar({ insets, onBack }) {
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBarInner}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          )}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: PROFILE_URL }} style={styles.profileAvatar} />
          </View>
          <Text style={styles.appTitle}>WealthSplit</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <MaterialIcons name="notifications-none" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MerchantHeader() {
  return (
    <View style={styles.merchantHeader}>
      <View style={styles.merchantLeft}>
        <Text style={styles.splittingLabel}>Splitting Bill From</Text>
        <Text style={styles.merchantName}>Brew District{'\n'}Caf\u00e9</Text>
        <Text style={styles.merchantDate}>Oct 24, 2023 \u2022 09:42 AM</Text>
      </View>
      <View style={styles.totalBadge}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>$32.50</Text>
      </View>
    </View>
  );
}

function MemberChips({ assignedTo, onToggle }) {
  return (
    <View style={styles.chipRow}>
      {MEMBERS_LIST.map((member) => {
        const active = assignedTo.includes(member);
        return (
          <TouchableOpacity
            key={member}
            onPress={() => onToggle(member)}
            activeOpacity={0.8}
            style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
          >
            <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
              {MEMBER_LABELS[member]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ItemAvatars({ item }) {
  if (item.unassigned) {
    return (
      <View style={styles.unassignedIcon}>
        <MaterialIcons name="priority-high" size={16} color={colors.onErrorContainer} />
      </View>
    );
  }

  return (
    <View style={styles.itemAvatarRow}>
      {item.avatars.map((av, i) =>
        av.type === 'image' ? (
          <Image
            key={i}
            source={{ uri: av.uri }}
            style={[styles.itemAvatar, i > 0 && { marginLeft: -8 }]}
          />
        ) : (
          <View key={i} style={[styles.itemAvatarPlaceholder, i > 0 && { marginLeft: -8 }]}>
            <MaterialIcons name={av.name} size={14} color={colors.outline} />
          </View>
        ),
      )}
      {item.extraCount > 0 && (
        <View style={[styles.itemAvatarExtra, { marginLeft: -8 }]}>
          <Text style={styles.itemAvatarExtraText}>+{item.extraCount}</Text>
        </View>
      )}
    </View>
  );
}

function BillItemCard({ item, onToggleMember }) {
  const isUnassigned = item.unassigned;

  return (
    <View
      style={[
        styles.itemCard,
        isUnassigned ? styles.itemCardUnassigned : styles.itemCardNormal,
      ]}
    >
      <View style={styles.itemCardHeader}>
        <View style={styles.itemCardInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {isUnassigned ? (
            <Text style={styles.itemPriceUnassigned}>
              Unassigned \u2022 ${item.price.toFixed(2)}
            </Text>
          ) : (
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          )}
        </View>
        <ItemAvatars item={item} />
      </View>
      <MemberChips
        assignedTo={item.assignedTo}
        onToggle={(member) => onToggleMember(item.id, member)}
      />
    </View>
  );
}

function MembersSummary() {
  const [activeTab, setActiveTab] = useState('split');

  return (
    <View style={styles.membersSection}>
      <View style={styles.membersHeader}>
        <Text style={styles.membersTitle}>Members</Text>
        <View style={styles.membersTabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('split')}
            activeOpacity={0.8}
            style={[styles.membersTab, activeTab === 'split' && styles.membersTabActive]}
          >
            <Text
              style={[
                styles.membersTabText,
                activeTab === 'split' && styles.membersTabTextActive,
              ]}
            >
              Split{'\n'}Equally
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('set')}
            activeOpacity={0.8}
            style={[styles.membersTab, activeTab === 'set' && styles.membersTabActive]}
          >
            <Text
              style={[
                styles.membersTabText,
                activeTab === 'set' && styles.membersTabTextActive,
              ]}
            >
              Set{'\n'}Amount
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {MEMBERS_SUMMARY.map((member) => (
        <View key={member.key} style={styles.memberRow}>
          <View style={styles.memberLeft}>
            <View style={styles.memberAvatarWrap}>
              <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
            </View>
            <View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberItemCount}>
                {member.items} {member.items === 1 ? 'Item' : 'Items'}
              </Text>
            </View>
          </View>
          <Text style={styles.memberAmount}>{member.amount}</Text>
        </View>
      ))}
    </View>
  );
}

function BottomActions({ insets, onSend }) {
  return (
    <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
      <View style={styles.subtotalRow}>
        <Text style={styles.assignedCount}>4 of 5 Items Assigned</Text>
        <Text style={styles.subtotalText}>Subtotal: $28.00</Text>
      </View>
      <TouchableOpacity activeOpacity={0.85} onPress={onSend}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryDim]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.sendButton, shadows.sendButton]}
        >
          <Text style={styles.sendButtonText}>Send to Members</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function BillSplitScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(INITIAL_ITEMS);

  const handleToggleMember = (itemId, member) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const already = item.assignedTo.includes(member);
        const newAssigned = already
          ? item.assignedTo.filter((m) => m !== member)
          : [...item.assignedTo, member];
        return { ...item, assignedTo: newAssigned, unassigned: newAssigned.length === 0 };
      }),
    );
  };

  return (
    <View style={styles.root}>
      <TopAppBar insets={insets} onBack={navigation?.canGoBack?.() ? navigation.goBack : null} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MerchantHeader />

        <View style={styles.assignSection}>
          <Text style={styles.assignTitle}>Assign Items</Text>
          {items.map((item) => (
            <BillItemCard key={item.id} item={item} onToggleMember={handleToggleMember} />
          ))}
        </View>

        <MembersSummary />
      </ScrollView>

      <BottomActions insets={insets} onSend={() => navigation.navigate('ReviewPayment')} />
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
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
  },
  profileAvatar: {
    width: 40,
    height: 40,
  },
  appTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.onSurface,
  },
  iconButton: {
    padding: 8,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Merchant Header
  merchantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  merchantLeft: {
    flex: 1,
    marginRight: 16,
  },
  splittingLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  merchantName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onSurface,
    lineHeight: 34,
  },
  merchantDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },
  totalBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radii.xl,
    alignItems: 'center',
    minWidth: 100,
  },
  totalLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  totalAmount: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },

  // Assign Items Section
  assignSection: {
    marginBottom: 32,
  },
  assignTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.onSurface,
    marginBottom: 16,
    paddingHorizontal: 2,
  },

  // Bill Item Card
  itemCard: {
    padding: 20,
    borderRadius: radii.xl,
    marginBottom: 12,
  },
  itemCardNormal: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  itemCardUnassigned: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    opacity: 0.95,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemCardInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  itemPrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  itemPriceUnassigned: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
  },

  // Item Avatars
  itemAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  itemAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemAvatarExtra: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemAvatarExtraText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  unassignedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Member Chips
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radii.full,
  },
  chipActive: {
    backgroundColor: colors.secondary,
  },
  chipInactive: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.onSecondary,
  },
  chipTextInactive: {
    color: colors.onSurfaceVariant,
  },

  // Members Summary
  membersSection: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: 24,
    marginBottom: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  membersTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  membersTabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  membersTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
  },
  membersTabActive: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  membersTabText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 13,
  },
  membersTabTextActive: {
    color: colors.secondary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
  },
  memberAvatar: {
    width: 40,
    height: 40,
  },
  memberName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  memberItemCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  memberAmount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },

  // Bottom Actions
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    ...Platform.select({
      ios: {},
      android: { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
    }),
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  assignedCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  subtotalText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  sendButton: {
    paddingVertical: 18,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSecondary,
  },
});
