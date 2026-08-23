/**
 * LibraryScreen — migrated to Fluent UI.
 *
 * The My Books / Browse switch uses Fluent Chips, search is Fluent's
 * Input, each book sits on a FluentCard and the price is a Fluent Badge.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Input,
  Text,
  Spinner,
  FluentCard,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import { BookOpen24Regular, Search24Regular } from '../../components/fluent/icons';
import { booksApi, OwnedBookResponse } from '../../api/books';
import { Book } from '../../types/content';
import { RootStackParamList } from '../../types';
import { EmptyState, FilterPills } from '../../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab_ = 'mine' | 'browse';

const SYM: Record<string, string> = { GHS: '₵', USD: '$', EUR: '€', GBP: '£' };
function price(p: number, c: string) {
  return p === 0 ? 'Free' : `${SYM[c] || c}${p}`;
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const colors = useFluentColors();

  const [tab, setTab] = useState<Tab_>('browse');
  const [search, setSearch] = useState('');
  const [owned, setOwned] = useState<OwnedBookResponse[]>([]);
  const [catalog, setCatalog] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [o, c] = await Promise.all([booksApi.owned(), booksApi.catalog()]);
      setOwned(o);
      setCatalog(c);
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      load().finally(() => {
        if (alive) setLoading(false);
      });
      return () => {
        alive = false;
      };
    }, [load]),
  );

  const ownedSet = useMemo(() => new Set(owned.map((b) => b.id)), [owned]);

  const filtered = useMemo(() => {
    const list = tab === 'mine' ? owned : catalog;
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    );
  }, [tab, search, owned, catalog]);

  const openBook = (book: Book) => {
    nav.navigate(ownedSet.has(book.id) ? 'BookReader' : 'BookDetail', { bookId: book.id });
  };

  const renderBook = ({ item }: { item: Book | OwnedBookResponse }) => (
    <FluentCard
      appearance="filled"
      size="medium"
      onPress={() => openBook(item)}
      style={s.bookCard}
      accessibilityLabel={`${item.title} by ${item.author}`}
    >
      <Image
        source={{ uri: item.coverUrl }}
        style={[s.bookCover, { backgroundColor: colors.neutralBackground4 as string }]}
      />
      <Text variant="body1Strong" numberOfLines={2}>
        {item.title}
      </Text>
      <Text variant="caption1" color={colors.neutralForeground2 as string} numberOfLines={1}>
        {item.author}
      </Text>
      {!ownedSet.has(item.id) && (
        <View style={s.badgeRow}>
          {/* Fluent's Badge resolves its tint colours from `brandForeground2`,
              which the Android token bundle does not define — the brand tint
              renders wrong there. Styled directly from tokens that do resolve. */}
          <View
            style={[
              s.pricePill,
              {
                backgroundColor:
                  item.price === 0
                    ? (colors.successBackground1 as string)
                    : FluentTint.subtle,
              },
            ]}
          >
            <Text
              variant="caption1Strong"
              color={
                item.price === 0
                  ? (colors.successForeground1 as string)
                  : (colors.brandForeground1 as string)
              }
            >
              {price(item.price, item.currency)}
            </Text>
          </View>
        </View>
      )}
    </FluentCard>
  );

  return (
    <View
      style={[
        s.screen,
        { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
      ]}
    >
      <View style={s.header}>
        <Text variant="title1">Library</Text>
      </View>

      <View style={s.gutter}>
        {/* Fluent's TabList cannot be used here: it renders a FocusZone
            container, and focus-zone ships native code for macOS only, so it
            crashes on Android with "Can't find ViewManager 'FocusZone'".
            Fluent Chips give the same affordance and match the other screens. */}
        <FilterPills
          options={[
            { key: 'mine', label: 'My Books' },
            { key: 'browse', label: 'Browse' },
          ]}
          activeKey={tab}
          onSelect={(k) => setTab(k as Tab_)}
        />
      </View>

      <View style={[s.gutter, s.searchRow]}>
        <Input
          placeholder="Search books…"
          value={search}
          onChange={setSearch}
          defaultIcon={{ svgSource: { src: Search24Regular } }}
          accessoryButtonOnPress={() => setSearch('')}
          accessoryIconAccessibilityLabel="Clear search"
          accessibilityLabel="Search books"
          textInputProps={{ autoCapitalize: 'none', returnKeyType: 'search' }}
        />
      </View>

      {loading ? (
        <Spinner style={s.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={s.row}
          renderItem={renderBook}
          contentContainerStyle={{
            paddingHorizontal: FluentSpacing.l,
            paddingBottom: insets.bottom + FluentSpacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={s.gap} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await load();
                setRefreshing(false);
              }}
              tintColor={colors.brandForeground1 as string}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={tab === 'mine' ? BookOpen24Regular : Search24Regular}
              title={tab === 'mine' ? 'No books yet' : 'No books found'}
              hint={tab === 'mine' ? 'Books you purchase will appear here' : undefined}
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
  searchRow: { marginTop: FluentSpacing.s, marginBottom: FluentSpacing.m },
  row: { justifyContent: 'space-between', gap: FluentSpacing.m },
  gap: { height: FluentSpacing.l },
  bookCard: { flex: 1, maxWidth: '48%' },
  bookCover: {
    width: '100%',
    height: 180,
    borderRadius: FluentCorner.large,
    marginBottom: FluentSpacing.xs,
  },
  badgeRow: { flexDirection: 'row', marginTop: FluentSpacing.xxs },
  pricePill: {
    paddingHorizontal: FluentSpacing.s,
    paddingVertical: 2,
    borderRadius: FluentCorner.circular,
  },
  loader: { marginTop: FluentSpacing.xxxl },
});
