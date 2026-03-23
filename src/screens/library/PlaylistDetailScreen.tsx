import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { useLibraryStore } from '../../store/libraryStore';
import { sermons, motivations } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Sermon } from '../../types/content';

type Route = RouteProp<RootStackParamList, 'PlaylistDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const allContent = [...sermons, ...motivations];
const getItem = (id: string) => allContent.find((i) => i.id === id);

export default function PlaylistDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const playlist = useLibraryStore((s) =>
    s.playlists.find((p) => p.id === route.params.playlistId)
  );
  const removeFromPlaylist = useLibraryStore((s) => s.removeFromPlaylist);

  if (!playlist) return null;

  const items = playlist.itemIds.map(getItem).filter(Boolean) as Sermon[];

  const handleItemPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const renderItem = ({ item }: { item: Sermon }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbWrap}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rowMeta}>{item.scripture} · {item.duration}</Text>
      </View>
      <TouchableOpacity
        onPress={() => removeFromPlaylist(playlist.id, item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-circle-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{playlist.name}</Text>
          <Text style={styles.headerCount}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="musical-notes" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>This playlist is empty</Text>
            <Text style={styles.emptyHint}>
              Add items from any teaching's detail page
            </Text>
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  headerInfo: { flex: 1 },
  headerTitle: { ...Typography.h3 },
  headerCount: { ...Typography.caption, marginTop: 2 },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  thumbWrap: {
    width: 60, height: 40,
    borderRadius: BorderRadius.sm, overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  thumb: { width: '100%', height: '100%' },
  rowInfo: { flex: 1 },
  rowTitle: { ...Typography.bodyMedium, fontSize: 14 },
  rowMeta: { ...Typography.caption, marginTop: 2 },
  empty: {
    alignItems: 'center', paddingTop: Spacing['5xl'], gap: Spacing.sm,
  },
  emptyText: { ...Typography.bodyMedium, color: Colors.textSecondary },
  emptyHint: { ...Typography.caption, color: Colors.textSecondary },
});
