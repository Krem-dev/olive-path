import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { notificationsApi, ApiNotification } from '../../api/notifications';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Tint = 'olive' | 'brass';

const TINT_BG: Record<Tint, string> = {
  olive: 'rgba(61, 79, 44, 0.10)',
  brass: 'rgba(184, 137, 62, 0.13)',
};
const TINT_FG: Record<Tint, string> = {
  olive: Colors.primary,
  brass: Colors.accent,
};

const TYPE_PRESET: Record<
  ApiNotification['type'],
  { icon: IoniconName; tint: Tint }
> = {
  new_teaching: { icon: 'mic-outline', tint: 'brass' },
  devotion: { icon: 'leaf-outline', tint: 'olive' },
  prayer: { icon: 'heart-outline', tint: 'brass' },
  general: { icon: 'sparkles-outline', tint: 'olive' },
};

interface NotificationView {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: IoniconName;
  tint: Tint;
}

function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function toView(n: ApiNotification): NotificationView {
  const preset = TYPE_PRESET[n.type] || TYPE_PRESET.general;
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    time: relativeTime(n.createdAt),
    read: n.isRead,
    icon: preset.icon,
    tint: preset.tint,
  };
}

const PAGE_SIZE = 5;
type Filter = 'all' | 'unread';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationView[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initial load + mark all visible notifications as read on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await notificationsApi.list();
        if (!alive) return;
        setItems(list.map(toView));
        // Mark all as read on viewing the screen
        const hasUnread = list.some((n) => !n.isRead);
        if (hasUnread) {
          notificationsApi.markAllRead().catch(() => {});
          setTimeout(() => {
            if (alive)
              setItems((prev) => prev.map((n) => ({ ...n, read: true })));
          }, 800);
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.read);
    return items;
  }, [filter, items]);

  const displayed = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page],
  );
  const hasMore = displayed.length < filtered.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 350);
  }, [hasMore, loading]);

  const unreadCount = items.filter((n) => !n.read).length;

  const renderItem = ({ item }: { item: NotificationView }) => (
    <TouchableOpacity style={styles.notifCard} activeOpacity={0.85}>
      <View
        style={[
          styles.notifIcon,
          { backgroundColor: TINT_BG[item.tint] },
        ]}
      >
        <Ionicons name={item.icon} size={18} color={TINT_FG[item.tint]} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text
            style={[
              styles.notifTitle,
              !item.read && styles.notifTitleUnread,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Filter segmented ── */}
      <View style={styles.segmented}>
        {(['all', 'unread'] as Filter[]).map((key) => {
          const active = filter === key;
          const label = key === 'all' ? 'All' : 'Unread';
          const count =
            key === 'all' ? items.length : unreadCount;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => {
                setFilter(key);
                setPage(1);
              }}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.segmentText,
                  active && styles.segmentTextActive,
                ]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.countPill,
                  active && styles.countPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.countPillText,
                    active && styles.countPillTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name={
                  filter === 'unread'
                    ? 'checkmark-done-outline'
                    : 'notifications-off-outline'
                }
                size={28}
                color={Colors.accent}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'unread'
                ? "You're all caught up"
                : 'No notifications yet'}
            </Text>
            <Text style={styles.emptySub}>
              {filter === 'unread'
                ? 'Nothing unread. We\'ll let you know when there\'s something new.'
                : "We'll notify you when new content is available."}
            </Text>
          </View>
        }
      />
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
    paddingTop: Spacing.sm,
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

  // ── Segmented control ──
  segmented: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: 4,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm + 2,
  },
  segmentActive: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  countPill: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(31, 36, 25, 0.08)',
    minWidth: 22,
    alignItems: 'center',
  },
  countPillActive: {
    backgroundColor: 'rgba(184, 137, 62, 0.15)',
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  countPillTextActive: {
    color: Colors.accent,
  },

  // ── List ──
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.1,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  notifMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  loader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },

  // ── Empty ──
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(184, 137, 62, 0.25)',
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
