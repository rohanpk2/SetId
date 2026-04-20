import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radii, shadows } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { users as usersApi } from '../services/api';
import LazyImage from '../components/LazyImage';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await usersApi.getMyProfile();
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      loadProfile().finally(() => {
        if (!cancelled) setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, [loadProfile]),
  );

  const display = profile || user;
  const initials = (display?.full_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This permanently removes your account. Your personal details will be wiped and you\'ll be signed out. Bills and payments you were part of will remain for the other members involved.\n\nThis cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (deleting) return;
            setDeleting(true);
            try {
              await usersApi.deleteAccount();
              // logout clears cached state + token and flips the RootNavigator
              // back to the auth stack.
              await logout();
            } catch (err) {
              setDeleting(false);
              Alert.alert(
                'Could not delete account',
                err?.error?.message
                  ?? err?.message
                  ?? 'Something went wrong. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={[styles.heroCard, shadows.card]}>
              <View style={styles.avatarLarge}>
                {display?.avatar_url ? (
                  <LazyImage
                    source={{ uri: display.avatar_url }}
                    style={styles.avatarImg}
                    fallbackIcon="person"
                    fallbackIconSize={40}
                  />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </View>
              <Text style={styles.name}>{display?.full_name || 'User'}</Text>
              <Text style={styles.email}>{display?.email || ''}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Account</Text>
              <View style={[styles.rowCard, shadows.card]}>
                <View style={styles.row}>
                  <MaterialIcons name="badge" size={22} color={colors.onSurfaceVariant} />
                  <Text style={styles.rowText}>Member since</Text>
                  <Text style={styles.rowValue}>
                    {display?.created_at
                      ? new Date(display.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleLogout}>
              <LinearGradient
                colors={[colors.error, '#7d2c2a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutBtn}
              >
                <MaterialIcons name="logout" size={20} color={colors.onError} />
                <Text style={styles.logoutText}>Log out</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDeleteAccount}
              disabled={deleting}
              style={[styles.deleteBtn, deleting && styles.deleteBtnDisabled]}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={colors.error} />
              ) : (
                <>
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={colors.error}
                  />
                  <Text style={styles.deleteText}>Delete account</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.onSurface,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heroCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarImg: {
    width: 88,
    height: 88,
  },
  avatarInitials: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    color: colors.secondary,
  },
  name: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
  email: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  rowCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  rowText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: colors.onSurface,
  },
  rowValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: radii.full,
    marginTop: 8,
  },
  logoutText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.onError,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 12,
  },
  deleteBtnDisabled: {
    opacity: 0.6,
  },
  deleteText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    textDecorationLine: 'underline',
  },
});
