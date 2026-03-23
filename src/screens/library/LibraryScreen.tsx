import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { useLibraryStore, Playlist } from '../../store/libraryStore';
import { sermons, motivations } from '../../data/mockData';
import { Sermon } from '../../types/content';
import { RootStackParamList } from '../../types';

type Tab = 'playlists' | 'downloads' | 'bookmarks';

const TABS: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'playlists', label: 'Playlists', icon: 'list-outline' },
  { key: 'downloads', label: 'Downloads', icon: 'download-outline' },
  { key: 'bookmarks', label: 'Bookmarks', icon: 'bookmark-outline' },
];

const allContent = [...sermons, ...motivations];
const getItem = (id: string) => allContent.find((i) => i.id === id);

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('playlists');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
  );

  const { playlists, downloadedIds, bookmarkedIds, createPlaylist, deletePlaylist } =
    useLibraryStore();

  const downloadedItems = useMemo(
    () => downloadedIds.map(getItem).filter(Boolean) as Sermon[],
    [downloadedIds]
  );

  const bookmarkedItems = useMemo(
    () => bookmarkedIds.map(getItem).filter(Boolean) as Sermon[],
    [bookmarkedIds]
  );

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateModal(false);
    }
  };

  const handleItemPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const renderContentRow = ({ item }: { item: Sermon }) => (
    <TouchableOpacity style={styles.contentRow} activeOpacity={0.8} onPress={() => handleItemPress(item)}>
      <View style={styles.rowThumbWrap}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.rowThumb} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rowMeta}>{item.scripture} · {item.duration}</Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderPlaylistCard = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id })}
    >
      <View style={styles.playlistIcon}>
        <Ionicons name="musical-notes" size={22} color={Colors.accent} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>
          {item.itemIds.length} {item.itemIds.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deletePlaylist(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = (message: string, hint: string) => (
    <View style={styles.empty}>
      <Ionicons
        name={
          activeTab === 'playlists'
            ? 'list'
            : activeTab === 'downloads'
            ? 'download'
            : 'bookmark'
        }
        size={48}
        color={Colors.border}
      />
      <Text style={styles.emptyText}>{message}</Text>
      <Text style={styles.emptyHint}>{hint}</Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate('MainTabs')}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyBtnText}>Browse Teachings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <Text style={styles.headerTitle}>Library</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={active ? '#FFFFFF' : Colors.textSecondary}
              />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {activeTab === 'playlists' && (
        <>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
            <Text style={styles.createBtnText}>Create Playlist</Text>
          </TouchableOpacity>
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistCard}
            contentContainerStyle={styles.listContent}
            refreshControl={refreshControl}
            ListEmptyComponent={renderEmpty('No playlists yet', 'Create a playlist to organise your favourite teachings')}
          />
        </>
      )}

      {activeTab === 'downloads' && (
        <FlatList
          data={downloadedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderContentRow}
          contentContainerStyle={styles.listContent}
            refreshControl={refreshControl}
          ListEmptyComponent={renderEmpty('No downloads yet', 'Download teachings to listen offline')}
        />
      )}

      {activeTab === 'bookmarks' && (
        <FlatList
          data={bookmarkedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderContentRow}
          contentContainerStyle={styles.listContent}
            refreshControl={refreshControl}
          ListEmptyComponent={renderEmpty('No bookmarks yet', 'Save teachings to find them quickly later')}
        />
      )}

      {/* Create Playlist Modal */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCreateModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist name"
              placeholderTextColor={Colors.textSecondary}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setNewPlaylistName('');
                  setShowCreateModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCreate,
                  !newPlaylistName.trim() && styles.modalCreateDisabled,
                ]}
                onPress={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
              >
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  createBtnText: {
    ...Typography.bodyMedium,
    fontSize: 14,
    color: Colors.accent,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 100,
  },
  // Playlist card
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  playlistIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    ...Typography.bodyMedium,
    fontSize: 14,
  },
  playlistCount: {
    ...Typography.caption,
    marginTop: 2,
  },
  // Content row
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  rowThumbWrap: {
    width: 60,
    height: 40,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  rowThumb: {
    width: '100%',
    height: '100%',
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    ...Typography.bodyMedium,
    fontSize: 14,
  },
  rowMeta: {
    ...Typography.caption,
    marginTop: 2,
  },
  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.md,
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
  emptyBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  modalTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  modalInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
  },
  modalCancel: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  modalCancelText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  modalCreate: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  modalCreateDisabled: {
    opacity: 0.4,
  },
  modalCreateText: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
  },
});
