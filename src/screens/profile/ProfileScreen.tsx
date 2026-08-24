/**
 * ProfileScreen — migrated to Fluent UI.
 *
 * fluent-migration-exempt: keeps Ionicons for brand logos only.
 *
 * BRAND LOGOS: Fluent System Icons contains no third-party brand marks, so the
 * Facebook / Instagram / YouTube rows keep their Ionicons logos. Substituting
 * generic Fluent glyphs would make the social links unrecognisable. Every other
 * icon on this screen is Fluent.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import {
  Globe24Regular,
  Mail24Regular,
  Info24Regular,
  ChevronRight20Regular,
  SignOut24Regular,
} from '../../components/fluent/icons';
import { TopBar, Button, Card } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';

type FluentIcon = React.FC<any>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  /** A Fluent icon, or a brand mark Fluent does not provide. */
  icon?: FluentIcon;
  brandIcon?: IoniconName;
  label: string;
  onPress?: () => void;
  rightText?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: Globe24Regular,
    label: 'Visit website',
    onPress: () => Linking.openURL('https://www.olivepathnetwork.org'),
  },
  {
    brandIcon: 'logo-facebook',
    label: 'Facebook',
    onPress: () => Linking.openURL('https://www.facebook.com/share/18ctrkC9mV/'),
  },
  {
    brandIcon: 'logo-instagram',
    label: 'Instagram',
    onPress: () => Linking.openURL('https://www.instagram.com/olivepathnetwork'),
  },
  {
    brandIcon: 'logo-youtube',
    label: 'YouTube',
    onPress: () => Linking.openURL('https://youtube.com/@olivepathnetwork'),
  },
  {
    icon: Mail24Regular,
    label: 'Contact us',
    onPress: () => Linking.openURL('mailto:ericbroni@olivepathnetwork.org'),
  },
  {
    icon: Info24Regular,
    label: 'App version',
    rightText: 'v1.0.0',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const colors = useFluentColors();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data including prayer requests, bookmarks, purchases, and bookings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await authApi.deleteAccount();
              await logout();
              Alert.alert(
                'Account deleted',
                'Your account and data have been permanently removed.',
              );
            } catch {
              Alert.alert('Failed', 'Could not delete account. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}>
      <TopBar title="Profile" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + FluentSpacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInfo}>
          <Text variant="title1">{user?.name || 'Friend'}</Text>
          {user?.email ? (
            <Text variant="body2" color={colors.neutralForeground2 as string}>
              {user.email}
            </Text>
          ) : null}
        </View>

        <View style={styles.cardWrap}>
          <Card padded={false}>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                  accessibilityRole={item.onPress ? 'button' : undefined}
                  accessibilityLabel={item.label}
                  style={({ pressed }) => [
                    styles.row,
                    index < MENU_ITEMS.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.neutralStroke2 as string,
                    },
                    pressed &&
                      item.onPress && {
                        backgroundColor: colors.neutralBackground1Pressed as string,
                      },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: FluentTint.subtle }]}>
                    {Icon ? (
                      <Icon color={colors.brandForeground1 as string} />
                    ) : (
                      <Ionicons
                        name={item.brandIcon!}
                        size={18}
                        color={colors.brandForeground1 as string}
                      />
                    )}
                  </View>

                  <Text variant="body1Strong" style={styles.rowLabel}>
                    {item.label}
                  </Text>

                  {item.rightText ? (
                    <Text variant="caption1" color={colors.neutralForeground2 as string}>
                      {item.rightText}
                    </Text>
                  ) : null}

                  {item.onPress ? (
                    <ChevronRight20Regular color={colors.neutralForeground3 as string} />
                  ) : null}
                </Pressable>
              );
            })}
          </Card>
        </View>

        <View style={styles.logoutWrap}>
          <Button label="Log out" onPress={logout} variant="danger" icon={SignOut24Regular} />
        </View>

        <Pressable
          onPress={handleDeleteAccount}
          accessibilityRole="button"
          style={styles.deleteBtn}
        >
          <Text variant="body2" color={colors.dangerForeground1 as string}>
            Delete my account
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  userInfo: {
    alignItems: 'center',
    paddingTop: FluentSpacing.l,
    paddingBottom: FluentSpacing.xl,
    gap: FluentSpacing.xxs,
  },
  cardWrap: {
    paddingHorizontal: FluentSpacing.l,
    marginBottom: FluentSpacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: FluentSpacing.m,
    paddingHorizontal: FluentSpacing.l,
    gap: FluentSpacing.m,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: FluentCorner.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: { flex: 1 },
  logoutWrap: { paddingHorizontal: FluentSpacing.l },
  deleteBtn: {
    alignSelf: 'center',
    marginTop: FluentSpacing.xl,
    paddingVertical: FluentSpacing.s,
  },
});
