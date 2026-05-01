import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { sermonsApi } from '../../api/sermons';
import { Sermon } from '../../types/content';
import { RootStackParamList } from '../../types';

type CategoryFilter = 'all' | 'preaching' | 'motivation';
type FormatFilter = 'all' | 'video' | 'audio' | 'reading';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const PAGE_SIZE = 10;

const FORMAT_FILTERS: {
  key: FormatFilter;
  label: string;
  icon: IoniconName;
}[] = [
  { key: 'all', label: 'All formats', icon: 'apps-outline' },
  { key: 'video', label: 'Video', icon: 'videocam-outline' },
  { key: 'audio', label: 'Audio', icon: 'headset-outline' },
  { key: 'reading', label: 'Reading', icon: 'book-outline' },
];

const CATEGORY_FILTERS: {
  key: CategoryFilter;
  label: string;
  emptyTitle: string;
  emptySub: string;
}[] = [
  {
    key: 'all',
    label: 'All',
    emptyTitle: 'Nothing here yet',
    emptySub: 'New teachings will appear here as they\'re shared.',
  },
  {
    key: 'preaching',
    label: 'Preaching',
    emptyTitle: 'No sermons match',
    emptySub: 'Try a different search or clear filters.',
  },
  {
    key: 'motivation',
    label: 'Motivation',
    emptyTitle: 'No motivation match',
    emptySub: 'Try a different search or clear filters.',
  },
];

const TYPE_ICON: Record<string, IoniconName> = {
  video: 'videocam',
  audio: 'headset',
  reading: 'book',
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');

  const [items, setItems] = useState<Sermon[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input by 300ms so we don't fire on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadPage = useCallback(
    async (
      reset: boolean,
      opts: {
        category: CategoryFilter;
        format: FormatFilter;
        searchTerm: string;
        targetPage: number;
      },
    ) => {
      try {
        const env = await sermonsApi.list({
          category: opts.category === 'all' ? undefined : opts.category,
          contentType: opts.format === 'all' ? undefined : opts.format,
          search: opts.searchTerm || undefined,
          page: opts.targetPage,
          limit: PAGE_SIZE,
        });
        setItems((prev) => (reset ? env.data : [...prev, ...env.data]));
        setTotal(env.pagination?.total ?? env.data.length);
        setPage(opts.targetPage);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load teachings');
      }
    },
    [],
  );

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setLoading(true);
    void loadPage(true, {
      category: categoryFilter,
      format: formatFilter,
      searchTerm: debouncedSearch,
      targetPage: 1,
    }).finally(() => setLoading(false));
  }, [categoryFilter, formatFilter, debouncedSearch, loadPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(true, {
      category: categoryFilter,
      format: formatFilter,
      searchTerm: debouncedSearch,
      targetPage: 1,
    });
    setRefreshing(false);
  }, [loadPage, categoryFilter, formatFilter, debouncedSearch]);

  const hasMore = items.length < total;

  const handleEndReached = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    void loadPage(false, {
      category: categoryFilter,
      format: formatFilter,
      searchTerm: debouncedSearch,
      targetPage: page + 1,
    }).finally(() => setLoadingMore(false));
  }, [
    hasMore,
    loadingMore,
    loading,
    loadPage,
    categoryFilter,
    formatFilter,
    debouncedSearch,
    page,
  ]);

  const handleCardPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const activeCategory = CATEGORY_FILTERS.find(
    (c) => c.key === categoryFilter,
  )!;

  const renderItem = ({ item, index }: { item: Sermon; index: number }) => {
    const isLeft = index % 2 === 0;
    const typeIcon = TYPE_ICON[item.contentType];
    return (
      <TouchableOpacity
        style={[styles.card, { marginRight: isLeft ? Spacing.md : 0 }]}
        activeOpacity={0.88}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
          <View style={styles.thumbOverlay} />
          <View style={styles.thumbFooter}>
            <View style={styles.typePill}>
              <Ionicons name={typeIcon} size={10} color={Colors.textInverse} />
              <Text style={styles.typePillText}>{item.duration}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardScripture} numberOfLines={1}>
          {item.scripture}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>
          {total} {total === 1 ? 'teaching' : 'teachings'}
          {categoryFilter !== 'all' ? ` in ${activeCategory.label.toLowerCase()}` : ''}
        </Text>
      </View>

      {/* ── Search ── */}
      <View
        style={[
          styles.searchBar,
          searchFocused && styles.searchBarFocused,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={searchFocused ? Colors.accent : Colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachings or scripture"
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Segmented control (Category) ── */}
      <View style={styles.segmented}>
        {CATEGORY_FILTERS.map((f) => {
          const active = categoryFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setCategoryFilter(f.key)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.segmentText,
                  active && styles.segmentTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Format pills (secondary) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.formatScroll}
        contentContainerStyle={styles.formatRow}
      >
        {FORMAT_FILTERS.map((item) => {
          const active = formatFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.formatPill,
                active && styles.formatPillActive,
              ]}
              onPress={() => setFormatFilter(item.key)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={item.icon}
                size={14}
                color={active ? Colors.accent : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.formatPillText,
                  active && styles.formatPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Results grid ── */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
        ListFooterComponent={
          loading && items.length === 0 ? null : loadingMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          ) : !hasMore && items.length > PAGE_SIZE ? (
            <View style={styles.endFooter}>
              <View style={styles.endLine} />
              <Text style={styles.endText}>End of teachings</Text>
              <View style={styles.endLine} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={28}
                  color={Colors.accent}
                />
              </View>
              <Text style={styles.emptyTitle}>Couldn't load</Text>
              <Text style={styles.emptySub}>{error}</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                activeOpacity={0.85}
                onPress={onRefresh}
              >
                <Text style={styles.emptyBtnText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name={search ? 'search-outline' : 'leaf-outline'}
                  size={28}
                  color={Colors.accent}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {search ? 'No matches' : activeCategory.emptyTitle}
              </Text>
              <Text style={styles.emptySub}>
                {search
                  ? `Nothing matches "${search}". Try another word.`
                  : activeCategory.emptySub}
              </Text>
              {(search ||
                categoryFilter !== 'all' ||
                formatFilter !== 'all') && (
                <TouchableOpacity
                  style={styles.emptyBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSearch('');
                    setCategoryFilter('all');
                    setFormatFilter('all');
                  }}
                >
                  <Text style={styles.emptyBtnText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )
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

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.1,
  },

  // ── Search ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBarFocused: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    height: '100%',
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
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── Format pills ──
  formatScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: Spacing.lg,
  },
  formatRow: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  formatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
  },
  formatPillActive: {
    backgroundColor: 'rgba(184, 137, 62, 0.12)',
  },
  formatPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
  formatPillTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },

  // ── Grid ──
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    marginBottom: Spacing.xl,
  },
  thumbWrap: {
    aspectRatio: 4 / 3,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm + 2,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 25, 0.10)',
  },
  thumbFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(31, 36, 25, 0.85)',
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 19,
    marginBottom: 3,
    paddingHorizontal: 2,
  },
  cardScripture: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
    paddingHorizontal: 2,
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
    marginBottom: Spacing.lg,
  },
  emptyBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },

  // ── Pagination footer ──
  loadingFooter: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  endFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  endLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  endText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
