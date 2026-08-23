/**
 * DiscoverScreen — migrated to Fluent UI.
 *
 * Search is Fluent's Input, the filters are Fluent Chips (via FilterPills),
 * and each result row is a FluentListItem.
 */

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Input,
  Text,
  Spinner,
  FluentListItem,
  useFluentColors,
  FluentSpacing,
} from '../../components/fluent';
import { Search24Regular } from '../../components/fluent/icons';
import { sermonsApi } from '../../api/sermons';
import { Sermon } from '../../types/content';
import { RootStackParamList } from '../../types';
import { EmptyState, FilterPills } from '../../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'all' | 'preaching' | 'motivation';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'preaching', label: 'Preaching' },
  { key: 'motivation', label: 'Motivation' },
];

const PAGE_SIZE = 10;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const colors = useFluentColors();

  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reset on filter/search change
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setPage(1);
    setHasMore(true);
    sermonsApi
      .list({
        category: filter === 'all' ? undefined : filter,
        search: search.trim() || undefined,
        page: 1,
        limit: PAGE_SIZE,
      })
      .then((res) => {
        if (alive) {
          setItems(res.data);
          setHasMore(res.data.length >= PAGE_SIZE);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [filter, search]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    sermonsApi
      .list({
        category: filter === 'all' ? undefined : filter,
        search: search.trim() || undefined,
        page: nextPage,
        limit: PAGE_SIZE,
      })
      .then((res) => {
        setItems((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.data.length >= PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  const openSermon = (item: Sermon) => {
    nav.navigate(
      item.category === 'preaching' ? 'SermonDetail' : 'MotivationDetail',
      { sermonId: item.id },
    );
  };

  return (
    <View
      style={[
        s.screen,
        { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
      ]}
    >
      <View style={s.header}>
        <Text variant="title1">Discover</Text>
      </View>

      <View style={s.gutter}>
        <Input
          placeholder="Search teachings…"
          value={search}
          onChange={setSearch}
          defaultIcon={{ svgSource: { src: Search24Regular } }}
          // Fluent's default accessory is a clear (X) button; wire it up.
          accessoryButtonOnPress={() => setSearch('')}
          accessoryIconAccessibilityLabel="Clear search"
          accessibilityLabel="Search teachings"
          textInputProps={{ autoCapitalize: 'none', returnKeyType: 'search' }}
        />
      </View>

      <View style={s.filters}>
        <FilterPills
          options={FILTERS}
          activeKey={filter}
          onSelect={(k) => setFilter(k as Filter)}
        />
      </View>

      {loading ? (
        <Spinner style={s.loader} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <FluentListItem
              title={item.title}
              subtitle={`${item.scripture} · ${item.duration}`}
              imageUri={item.thumbnailUrl}
              showChevron
              onPress={() => openSermon(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + FluentSpacing.xxxl }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={[s.sep, { backgroundColor: colors.neutralStroke2 as string }]}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <Spinner style={s.footer} /> : null}
          ListEmptyComponent={
            <EmptyState
              icon={Search24Regular}
              title={search ? 'No results' : 'No teachings yet'}
              hint={search ? 'Try a different search term' : undefined}
            />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  gutter: { paddingHorizontal: FluentSpacing.l },
  header: {
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.m,
    paddingBottom: FluentSpacing.s,
  },
  filters: { marginTop: FluentSpacing.m, marginBottom: FluentSpacing.s },
  sep: { height: StyleSheet.hairlineWidth, marginLeft: 76 },
  loader: { marginTop: FluentSpacing.xxxl },
  footer: { paddingVertical: FluentSpacing.l },
});
