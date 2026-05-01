import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { qaApi } from '../../api/qa';
import { useFetch } from '../../hooks/useFetch';
import { QAItem } from '../../types/content';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QAScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const itemsFetch = useFetch(
    () =>
      qaApi.list({
        category: activeCategory === 'All' ? undefined : activeCategory,
        search: debouncedSearch || undefined,
      }),
    [activeCategory, debouncedSearch],
  );

  const categoriesFetch = useFetch(() => qaApi.categories(), []);

  const items = itemsFetch.data ?? [];
  const CATEGORIES = ['All', ...(categoriesFetch.data ?? [])];

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }: { item: QAItem }) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity
        style={[styles.qaCard, isExpanded && styles.qaCardExpanded]}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.92}
      >
        <View style={styles.qaHeader}>
          <View style={styles.qaQuestionWrap}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{item.category}</Text>
            </View>
            <Text style={styles.questionText}>{item.question}</Text>
          </View>
          <View
            style={[
              styles.chevronWrap,
              isExpanded && styles.chevronWrapActive,
            ]}
          >
            <Ionicons
              name={isExpanded ? 'remove' : 'add'}
              size={18}
              color={isExpanded ? Colors.accent : Colors.textPrimary}
            />
          </View>
        </View>
        {isExpanded && (
          <View style={styles.answerSection}>
            <View style={styles.answerDivider} />
            <Text style={styles.answerText}>{item.answer}</Text>
            <View style={styles.scriptureCard}>
              <Ionicons name="leaf" size={12} color={Colors.accent} />
              <Text style={styles.scriptureText}>{item.scripture}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Biblical Q&A</Text>
        <Text style={styles.subtitle}>
          {items.length}{' '}
          {items.length === 1 ? 'question' : 'questions'}
          {activeCategory !== 'All' ? ` in ${activeCategory.toLowerCase()}` : ''}
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
          placeholder="Search questions or scripture"
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

      {/* ── Category pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Q&A list ── */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          itemsFetch.loading ? (
            <View style={[styles.empty, { paddingTop: 80 }]}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name={search ? 'search-outline' : 'help-circle-outline'}
                size={28}
                color={Colors.accent}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {search ? 'No matches' : 'No questions yet'}
            </Text>
            <Text style={styles.emptySub}>
              {search
                ? `Nothing matches "${search}". Try another word.`
                : 'New questions will appear here as they\'re shared.'}
            </Text>
            {(search || activeCategory !== 'All') && (
              <TouchableOpacity
                style={styles.emptyBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setSearch('');
                  setActiveCategory('All');
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

  // ── Chip scroll ──
  chipScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: Spacing.lg,
  },
  chipRow: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },
  chipTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },

  // ── List ──
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },

  // ── Q&A Card ──
  qaCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  qaCardExpanded: {
    borderColor: 'rgba(184, 137, 62, 0.35)',
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  qaQuestionWrap: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    marginBottom: 8,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: 2,
  },
  chevronWrapActive: {
    backgroundColor: Colors.surfaceBlue,
    borderColor: 'rgba(184, 137, 62, 0.35)',
  },

  // ── Answer ──
  answerSection: {
    marginTop: Spacing.base,
  },
  answerDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.base,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.base,
  },
  scriptureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.25)',
  },
  scriptureText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
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
});
