import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { sermons, motivations } from '../../data/mockData';
import { Sermon } from '../../types/content';
import { RootStackParamList } from '../../types';

type CategoryFilter = 'all' | 'preaching' | 'motivation';
type TypeFilter = 'all' | 'video' | 'audio' | 'reading';

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'preaching', label: 'Preaching' },
  { key: 'motivation', label: 'Motivation' },
];

const TYPE_FILTERS: { key: TypeFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'All Types', icon: 'apps-outline' },
  { key: 'video', label: 'Video', icon: 'videocam-outline' },
  { key: 'audio', label: 'Audio', icon: 'headset-outline' },
  { key: 'reading', label: 'Reading', icon: 'book-outline' },
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const allContent = useMemo(() => [...sermons, ...motivations], []);

  const filtered = useMemo(() => {
    let items = allContent;

    if (categoryFilter !== 'all') {
      items = items.filter((i) => i.category === categoryFilter);
    }

    if (typeFilter !== 'all') {
      items = items.filter((i) => i.contentType === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.scripture.toLowerCase().includes(q)
      );
    }

    return items;
  }, [allContent, categoryFilter, typeFilter, search]);

  const handleCardPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const renderItem = ({ item }: { item: Sermon }) => {
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => handleCardPress(item)}>
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.scripture}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <Text style={styles.headerTitle}>Discover</Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachings..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.filterRow}>
        {CATEGORY_FILTERS.map((f) => {
          const active = categoryFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategoryFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Type Filters */}
      <View style={styles.typeRow}>
        {TYPE_FILTERS.map((f) => {
          const active = typeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.typeChip, active && styles.typeChipActive]}
              onPress={() => setTypeFilter(f.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={f.icon}
                size={14}
                color={active ? '#FFFFFF' : Colors.textSecondary}
              />
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No results found</Text>
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
  headerTitle: {
    ...Typography.h2,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
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
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  typeRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  typeChipActive: {
    backgroundColor: Colors.accent,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  card: {
    width: '48%',
  },
  thumbWrap: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    aspectRatio: 16 / 10,
    backgroundColor: Colors.surface,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardInfo: {
    paddingTop: Spacing.sm,
  },
  cardTitle: {
    ...Typography.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  cardSub: {
    ...Typography.caption,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
