import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Teaching Available',
    message: '"The Power of Faith" has been added to Preaching.',
    time: '2 hours ago',
    read: false,
    icon: 'mic-outline',
    iconColor: '#028FD6',
    iconBg: '#E8F4FD',
  },
  {
    id: '2',
    title: 'Daily Devotion',
    message: 'Your daily devotion is ready. Start your day with the Word.',
    time: '5 hours ago',
    read: false,
    icon: 'book-outline',
    iconColor: '#059669',
    iconBg: '#D1FAE5',
  },
  {
    id: '3',
    title: 'New Motivation',
    message: '"Rise Above Your Circumstances" is now available.',
    time: '1 day ago',
    read: true,
    icon: 'flame-outline',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: '4',
    title: 'New Q&A Added',
    message: 'A new question on "Holy Spirit" has been answered.',
    time: '2 days ago',
    read: true,
    icon: 'chatbubbles-outline',
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[styles.notifRow, !item.read && styles.notifUnread]}>
      <View style={[styles.notifIcon, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptyHint}>We'll notify you when new content is available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    ...Typography.bodyMedium,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 40,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  notifUnread: {
    backgroundColor: Colors.surfaceBlue,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    ...Typography.bodyMedium,
    fontSize: 14,
  },
  notifMessage: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
  notifTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  emptyHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
