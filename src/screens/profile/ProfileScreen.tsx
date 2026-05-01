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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  color?: string;
  rightText?: string;
  iconTint?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const generalItems: MenuItem[] = [
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      rightText: 'On',
      iconTint: '#E8F4FD',
    },
    {
      icon: 'download-outline',
      label: 'Downloads',
      rightText: 'Wi-Fi only',
      iconTint: '#D1FAE5',
    },
  ];

  const aboutItems: MenuItem[] = [
    {
      icon: 'globe-outline',
      label: 'Visit Website',
      onPress: () => Linking.openURL('https://www.olivepath.org'),
      iconTint: '#E8F4FD',
    },
    {
      icon: 'logo-facebook',
      label: 'Facebook',
      onPress: () => Linking.openURL('https://www.olivepathnetwork.org'),
      iconTint: '#E8F0FD',
    },
    {
      icon: 'mail-outline',
      label: 'Contact Us',
      onPress: () => Linking.openURL('mailto:ericbroni@olivepath.org'),
      iconTint: '#FEF3C7',
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      rightText: 'v1.0.0',
      iconTint: '#F0F2F5',
    },
  ];

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuRow,
              index < items.length - 1 && styles.menuRowBorder,
            ]}
            onPress={item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.iconTint || '#F0F2F5' }]}>
              <Ionicons
                name={item.icon}
                size={18}
                color={item.color || Colors.textSecondary}
              />
            </View>
            <Text style={[styles.menuLabel, item.color ? { color: item.color } : undefined]}>
              {item.label}
            </Text>
            {item.rightText && (
              <Text style={styles.menuRight}>{item.rightText}</Text>
            )}
            {item.onPress && (
              <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <View style={[styles.backRow, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.backTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {getInitials(user?.name || 'Guest')}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      {/* Sections */}
      {renderSection('General', generalItems)}
      {renderSection('About Olive Path', aboutItems)}

      {/* About text */}
      <View style={styles.aboutBox}>
        <Text style={styles.aboutText}>
          EBroni Global Media — Making Christ known. All teachings by Rev. Ing. Eric Ofori Broni.
        </Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Back
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backTitle: {
    ...Typography.bodyMedium,
    fontSize: 16,
  },
  // Header
  header: {
    alignItems: 'center',
    paddingBottom: Spacing['3xl'],
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    ...Typography.h3,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Sections
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    ...Typography.bodyMedium,
    fontSize: 14,
    flex: 1,
  },
  menuRight: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  // About
  aboutBox: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  aboutText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.xl,
    backgroundColor: '#FEE2E2',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
});
