/**
 * NotificationsScreen — migrated to Fluent UI.
 *
 * Rows are FluentCards with a tinted Fluent icon per notification type; the
 * All / Unread switch uses Fluent Chips.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  Spinner,
  FluentCard,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import {
  Mic24Regular,
  LeafTwo24Regular,
  Heart24Regular,
  Sparkle24Regular,
  AlertOff24Regular,
  CheckmarkCircle24Regular,
} from '../../components/fluent/icons';
import { TopBar, EmptyState, FilterPills } from '../../components/ui';
import { notificationsApi, ApiNotification } from '../../api/notifications';

type FluentIcon = React.FC<any>;

const TYPE_ICON: Record<ApiNotification['type'], FluentIcon> = {
  new_teaching: Mic24Regular,
  devotion: LeafTwo24Regular,
  prayer: Heart24Regular,
  general: Sparkle24Regular,
};

interface NotificationView {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: FluentIcon;
}

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toView(n: ApiNotification): NotificationView {
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    time: relativeTime(n.createdAt),
    read: n.isRead,
    icon: TYPE_ICON[n.type] || TYPE_ICON.general,
  };
}

const PAGE_SIZE = 5;
type Filter = 'all' | 'unread';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useFluentColors();

  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationView[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await notificationsApi.list();
        if (!alive) return;
        setItems(list.map(toView));
        if (list.some((n) => !n.isRead)) {
          notificationsApi.markAllRead().catch(() => {});
          setTimeout(() => {
            if (alive) setItems((prev) => prev.map((n) => ({ ...n, read: true })));
          }, 800);
        }
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === 'unread' ? items.filter((n) => !n.read) : items),
    [filter, items],
  );
  const displayed = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = displayed.length < filtered.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 350);
  }, [hasMore, loading]);

  const renderItem = ({ item }: { item: NotificationView }) => {
    const Icon = item.icon;
    return (
      <FluentCard appearance="filled" size="large" horizontal onPress={() => {}}>
        <View style={[s.iconBox, { backgroundColor: FluentTint.subtle }]}>
          <Icon color={colors.brandForeground1 as string} />
        </View>

        <View style={s.flex}>
          <View style={s.titleRow}>
            <Text
              variant={item.read ? 'body1' : 'body1Strong'}
              numberOfLines={1}
              style={s.flex}
            >
              {item.title}
            </Text>
            {!item.read && (
              <View style={[s.dot, { backgroundColor: colors.brandBackground as string }]} />
            )}
          </View>

          <Text
            variant="body2"
            color={colors.neutralForeground2 as string}
            numberOfLines={2}
            style={s.message}
          >
            {item.message}
          </Text>

          <Text
            variant="caption1"
            color={colors.neutralForeground3 as string}
            style={s.time}
          >
            {item.time.toUpperCase()}
          </Text>
        </View>
      </FluentCard>
    );
  };

  return (
    <View style={[s.screen, { backgroundColor: colors.neutralBackground3 as string }]}>
      <TopBar title="Notifications" />

      <View style={s.filters}>
        <FilterPills
          options={FILTERS}
          activeKey={filter}
          onSelect={(k) => {
            setFilter(k as Filter);
            setPage(1);
          }}
        />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: FluentSpacing.l,
          paddingBottom: insets.bottom + FluentSpacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={s.gap} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading ? <Spinner style={s.footer} /> : null}
        ListEmptyComponent={
          <EmptyState
            icon={filter === 'unread' ? CheckmarkCircle24Regular : AlertOff24Regular}
            title={filter === 'unread' ? "You're all caught up" : 'No notifications yet'}
          />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  filters: { marginBottom: FluentSpacing.m },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: FluentCorner.xxLarge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
  },
  dot: { width: 8, height: 8, borderRadius: FluentCorner.circular },
  message: { marginTop: 2, lineHeight: 18 },
  time: { marginTop: FluentSpacing.xs, letterSpacing: 0.3 },
  gap: { height: FluentSpacing.s },
  footer: { paddingVertical: FluentSpacing.l },
});
