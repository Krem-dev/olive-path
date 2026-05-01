import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { booksApi, OwnedBookResponse } from '../../api/books';
import { Book, BookProgress } from '../../types/content';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tab = 'mine' | 'browse';

const CURRENCY_SYMBOL: Record<string, string> = {
  GHS: '₵',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Free';
  const symbol = CURRENCY_SYMBOL[currency] || `${currency} `;
  return `${symbol}${price}`;
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('mine');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [owned, setOwned] = useState<OwnedBookResponse[]>([]);
  const [catalog, setCatalog] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [o, c] = await Promise.all([
        booksApi.owned(),
        booksApi.catalog(),
      ]);
      setOwned(o);
      setCatalog(c);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load library');
    }
  }, []);

  // Reload whenever the tab gets focus — purchases or progress may have changed
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

  const filteredBrowse = useMemo(() => {
    if (!search.trim()) return catalog;
    const q = search.toLowerCase();
    return catalog.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }, [search, catalog]);

  const continueReading = useMemo(() => {
    const inProgress = owned
      .filter((b) => b.progress && b.progress.progress < 1)
      .map((b) => ({ book: b, progress: b.progress! }))
      .sort(
        (a, b) =>
          new Date(b.progress.lastOpenedAt).getTime() -
          new Date(a.progress.lastOpenedAt).getTime(),
      );
    return inProgress[0];
  }, [owned]);

  const progressMap = useMemo(() => {
    const m: Record<number, BookProgress> = {};
    owned.forEach((b) => {
      if (b.progress) m[b.id] = b.progress;
    });
    return m;
  }, [owned]);

  const handleBookPress = (book: Book) => {
    if (ownedSet.has(book.id)) {
      navigation.navigate('BookReader', { bookId: book.id });
    } else {
      navigation.navigate('BookDetail', { bookId: book.id });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleContinue = () => {
    if (continueReading) {
      navigation.navigate('BookReader', {
        bookId: continueReading.book.id,
      });
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>
          Books by Rev. Ing. Eric Ofori Broni
        </Text>
      </View>

      {/* ── Tab segmented control ── */}
      <View style={styles.segmented}>
        {(['mine', 'browse'] as Tab[]).map((key) => {
          const active = tab === key;
          const label = key === 'mine' ? 'My Books' : 'Browse';
          const count = key === 'mine' ? owned.length : catalog.length;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setTab(key)}
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
              <View style={[styles.countPill, active && styles.countPillActive]}>
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

      {loading && owned.length === 0 && catalog.length === 0 ? (
        <View style={[styles.empty, { paddingTop: 80 }]}>
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
            onPress={handleRefresh}
          >
            <Text style={styles.emptyBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : tab === 'mine' ? (
        <MyBooksView
          owned={owned}
          progressMap={progressMap}
          continueReading={continueReading}
          onBookPress={handleBookPress}
          onContinue={handleContinue}
          onBrowse={() => setTab('browse')}
          insets={insets.bottom}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <BrowseView
          books={filteredBrowse}
          allCount={catalog.length}
          search={search}
          onSearch={setSearch}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          onBookPress={handleBookPress}
          insets={insets.bottom}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

// ──────────────────────────────────────────────────────────
//  My Books tab
// ──────────────────────────────────────────────────────────
function MyBooksView({
  owned,
  progressMap,
  continueReading,
  onBookPress,
  onContinue,
  onBrowse,
  insets,
  refreshing,
  onRefresh,
}: {
  owned: OwnedBookResponse[];
  progressMap: Record<number, BookProgress>;
  continueReading?: { book: OwnedBookResponse; progress: BookProgress };
  onBookPress: (b: Book) => void;
  onContinue: () => void;
  onBrowse: () => void;
  insets: number;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  if (owned.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="book-outline" size={28} color={Colors.accent} />
        </View>
        <Text style={styles.emptyTitle}>Your shelf is empty</Text>
        <Text style={styles.emptySub}>
          Start your library with one of Pastor Eric's books — devotionals,
          teaching, and study guides.
        </Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          activeOpacity={0.85}
          onPress={onBrowse}
        >
          <Text style={styles.emptyBtnText}>Browse books</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={Colors.textInverse}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: insets + 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accent}
        />
      }
    >
      {/* Continue Reading hero */}
      {continueReading && (
        <View style={styles.hero}>
          <View style={styles.heroLabel}>
            <Ionicons name="bookmark" size={11} color={Colors.accent} />
            <Text style={styles.heroLabelText}>Continue reading</Text>
          </View>
          <TouchableOpacity
            style={styles.heroCard}
            activeOpacity={0.92}
            onPress={onContinue}
          >
            <View style={styles.heroCoverWrap}>
              <Image
                source={{ uri: continueReading.book.coverUrl }}
                style={styles.heroCover}
              />
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {continueReading.book.title}
              </Text>
              <Text style={styles.heroAuthor} numberOfLines={1}>
                {continueReading.book.author}
              </Text>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${continueReading.progress.progress * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(continueReading.progress.progress * 100)}%
                </Text>
              </View>
              <View style={styles.heroMeta}>
                <Text style={styles.heroMetaText}>
                  Page {continueReading.progress.currentPage} of{' '}
                  {continueReading.book.pages}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroCta}
            activeOpacity={0.85}
            onPress={onContinue}
          >
            <Ionicons
              name="play"
              size={13}
              color={Colors.textInverse}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.heroCtaText}>Continue reading</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Your books grid */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionEyebrow}>YOUR SHELF</Text>
          <Text style={styles.sectionTitle}>All your books</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {owned.map((book, i) => (
          <BookCard
            key={book.id}
            book={book}
            isLeft={i % 2 === 0}
            owned
            progress={progressMap[book.id]}
            onPress={onBookPress}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ──────────────────────────────────────────────────────────
//  Browse tab
// ──────────────────────────────────────────────────────────
function BrowseView({
  books: items,
  allCount,
  search,
  onSearch,
  searchFocused,
  setSearchFocused,
  onBookPress,
  insets,
  refreshing,
  onRefresh,
}: {
  books: Book[];
  allCount: number;
  search: string;
  onSearch: (s: string) => void;
  searchFocused: boolean;
  setSearchFocused: (b: boolean) => void;
  onBookPress: (b: Book) => void;
  insets: number;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={[styles.browseList, { paddingBottom: insets + 32 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accent}
        />
      }
      ListHeaderComponent={
        <View>
          {/* Search */}
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
              placeholder="Search books, topics, authors"
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={onSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => onSearch('')} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionEyebrow}>
                {search ? 'RESULTS' : 'ALL TITLES'}
              </Text>
              <Text style={styles.sectionTitle}>
                {search ? `${items.length} found` : `${allCount} books available`}
              </Text>
            </View>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <BookCard
          book={item}
          isLeft={index % 2 === 0}
          onPress={onBookPress}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Ionicons
              name="search-outline"
              size={28}
              color={Colors.accent}
            />
          </View>
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptySub}>
            Try another title, topic, or author.
          </Text>
        </View>
      }
    />
  );
}

// ──────────────────────────────────────────────────────────
//  Book card (used in both tabs)
// ──────────────────────────────────────────────────────────
function BookCard({
  book,
  isLeft,
  owned,
  progress,
  onPress,
}: {
  book: Book;
  isLeft: boolean;
  owned?: boolean;
  progress?: BookProgress;
  onPress: (b: Book) => void;
}) {
  const isFree = book.price === 0;
  return (
    <TouchableOpacity
      style={[styles.card, { marginRight: isLeft ? Spacing.md : 0 }]}
      activeOpacity={0.9}
      onPress={() => onPress(book)}
    >
      <View style={styles.coverWrap}>
        <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        {owned && progress && progress.progress < 1 && (
          <View style={styles.cardProgressBar}>
            <View
              style={[
                styles.cardProgressFill,
                { width: `${progress.progress * 100}%` },
              ]}
            />
          </View>
        )}
        {owned && progress?.progress === 1 && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark" size={11} color={Colors.textInverse} />
          </View>
        )}
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.cardAuthor} numberOfLines={1}>
        {book.author.replace('Rev. Ing. ', '')}
      </Text>
      <View style={styles.cardFooter}>
        {owned ? (
          <View style={styles.ownedPill}>
            <Ionicons
              name="checkmark-circle"
              size={11}
              color={Colors.success}
            />
            <Text style={styles.ownedPillText}>Owned</Text>
          </View>
        ) : (
          <View
            style={[
              styles.pricePill,
              isFree && styles.freePill,
            ]}
          >
            <Text
              style={[
                styles.pricePillText,
                isFree && styles.freePillText,
              ]}
            >
              {formatPrice(book.price, book.currency)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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

  // ── Segmented ──
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
    minWidth: 20,
    alignItems: 'center',
  },
  countPillActive: {
    backgroundColor: 'rgba(184, 137, 62, 0.15)',
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  countPillTextActive: {
    color: Colors.accent,
  },

  // ── Hero (Continue Reading) ──
  hero: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  heroLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: Spacing.md,
  },
  heroLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroCard: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  heroCoverWrap: {
    width: 86,
    height: 128,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceBlue,
    ...Shadows.sm,
  },
  heroCover: {
    width: '100%',
    height: '100%',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 2,
  },
  heroAuthor: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    minWidth: 32,
    textAlign: 'right',
  },
  heroMeta: {
    marginTop: 2,
  },
  heroMetaText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },

  // ── Section header ──
  sectionHeaderRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
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
    marginBottom: Spacing.lg,
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

  // ── Grid ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
  },
  browseList: {
    paddingHorizontal: Spacing.lg,
  },

  // ── Book card ──
  card: {
    flex: 1,
    marginBottom: Spacing.xl,
  },
  coverWrap: {
    aspectRatio: 2 / 3,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceBlue,
    marginBottom: Spacing.sm + 2,
    ...Shadows.md,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  cardProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(31, 36, 25, 0.18)',
  },
  cardProgressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  completedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
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
  cardAuthor: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  cardFooter: {
    paddingHorizontal: 2,
  },
  pricePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.3)',
  },
  pricePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.2,
  },
  freePill: {
    backgroundColor: Colors.successLight,
    borderColor: 'rgba(92, 122, 61, 0.3)',
  },
  freePillText: {
    color: Colors.success,
  },
  ownedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: 'rgba(92, 122, 61, 0.3)',
  },
  ownedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
});
