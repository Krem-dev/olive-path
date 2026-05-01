import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Tint = 'olive' | 'brass';

interface MenuItem {
  icon: IoniconName;
  label: string;
  onPress?: () => void;
  rightText?: string;
  tint: Tint;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const aboutItems: MenuItem[] = [
    {
      icon: 'globe-outline',
      label: 'Visit website',
      onPress: () => Linking.openURL('https://www.olivepathnetwork.org'),
      tint: 'brass',
    },
    {
      icon: 'logo-facebook',
      label: 'Facebook',
      onPress: () =>
        Linking.openURL('https://www.facebook.com/share/18ctrkC9mV/'),
      tint: 'olive',
    },
    {
      icon: 'logo-instagram',
      label: 'Instagram',
      onPress: () =>
        Linking.openURL('https://www.instagram.com/olivepathnetwork'),
      tint: 'brass',
    },
    {
      icon: 'logo-youtube',
      label: 'YouTube',
      onPress: () =>
        Linking.openURL('https://youtube.com/@olivepathnetwork'),
      tint: 'olive',
    },
    {
      icon: 'mail-outline',
      label: 'Contact us',
      onPress: () =>
        Linking.openURL('mailto:ericbroni@olivepathnetwork.org'),
      tint: 'brass',
    },
    {
      icon: 'information-circle-outline',
      label: 'App version',
      rightText: 'v1.0.0',
      tint: 'olive',
    },
  ];

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionEyebrow}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => {
          const tintBg =
            item.tint === 'olive'
              ? 'rgba(61, 79, 44, 0.10)'
              : 'rgba(184, 137, 62, 0.13)';
          const tintFg =
            item.tint === 'olive' ? Colors.primary : Colors.accent;
          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                index < items.length - 1 && styles.menuRowBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
              disabled={!item.onPress && !item.rightText}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: tintBg }]}
              >
                <Ionicons name={item.icon} size={18} color={tintFg} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.rightText ? (
                <Text style={styles.menuRight}>{item.rightText}</Text>
              ) : null}
              {item.onPress ? (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textSecondary}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User card ── */}
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
          {user?.email ? (
            <Text style={styles.userEmail}>{user.email}</Text>
          ) : null}
        </View>

        {/* ── About ── */}
        {renderSection('ABOUT OLIVE PATH', aboutItems)}

        {/* ── Mission card ── */}
        <View style={styles.missionCard}>
          <Ionicons name="leaf" size={14} color={Colors.accent} />
          <Text style={styles.missionText}>
            EBroni Global Media — making Christ known. All teachings by Rev.
            Ing. Eric Ofori Broni.
          </Text>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
          activeOpacity={0.85}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={Colors.error}
          />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },

  // ── User card ──
  userCard: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  userName: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // ── Section ──
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: 10,
    paddingHorizontal: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },
  menuRight: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // ── Mission card ──
  missionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.2)',
  },
  missionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  // ── Logout ──
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    paddingVertical: 14,
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(196, 69, 54, 0.25)',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.1,
  },
});
