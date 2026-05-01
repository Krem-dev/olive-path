import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants';
import { sermons } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { useLibraryStore } from '../../store/libraryStore';

type SermonDetailRoute = RouteProp<RootStackParamList, 'SermonDetail'>;

export default function SermonDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<SermonDetailRoute>();
  const sermon = sermons.find((s) => s.id === route.params.sermonId);

  const {
    bookmarkedIds, downloadedIds, playlists,
    toggleBookmark, toggleDownload, addToPlaylist,
  } = useLibraryStore();

  const [showPlaylistSheet, setShowPlaylistSheet] = useState(false);

  if (!sermon) return null;

  const isBookmarked = bookmarkedIds.includes(sermon.id);
  const isDownloaded = downloadedIds.includes(sermon.id);

  return (
    <View style={styles.screen}>
      {/* Back — floating white circle */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Thumbnail */}
        <View style={[styles.thumbWrap, { marginTop: insets.top }]}>
          <Image source={{ uri: sermon.thumbnailUrl }} style={styles.thumb} />
          <View style={styles.playOverlay}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={32} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color="#FFFFFF" />
            <Text style={styles.durationText}>{sermon.duration}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{sermon.title}</Text>
          <View style={styles.scriptureBadge}>
            <Text style={styles.scripture}>{sermon.scripture}</Text>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => toggleBookmark(sermon.id)}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isBookmarked ? Colors.accent : Colors.textSecondary}
                />
              </View>
              <Text style={[styles.quickText, isBookmarked && { color: Colors.accent }]}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => toggleDownload(sermon.id)}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons
                  name={isDownloaded ? 'checkmark-circle' : 'download-outline'}
                  size={20}
                  color={isDownloaded ? '#059669' : Colors.textSecondary}
                />
              </View>
              <Text style={[styles.quickText, isDownloaded && { color: '#059669' }]}>
                {isDownloaded ? 'Downloaded' : 'Download'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => setShowPlaylistSheet(true)}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.quickText}>Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickBtn}>
              <View style={styles.quickIconCircle}>
                <Ionicons name="share-social-outline" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.quickText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>SUMMARY</Text>
          <Text style={styles.summary}>{sermon.summary}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>SPEAKER</Text>
          <Text style={styles.speaker}>Rev. Ing. Eric Ofori Broni</Text>
        </View>
      </ScrollView>

      {/* Bottom play bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.playBtnText}>Play Audio</Text>
        </TouchableOpacity>
      </View>

      {/* Add to Playlist Modal */}
      <Modal visible={showPlaylistSheet} transparent animationType="slide">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowPlaylistSheet(false)}
        >
          <View
            style={[styles.sheetContent, { paddingBottom: insets.bottom + Spacing.lg }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add to Playlist</Text>
            {playlists.length === 0 ? (
              <Text style={styles.sheetEmpty}>No playlists yet. Create one in Library.</Text>
            ) : (
              <FlatList
                data={playlists}
                keyExtractor={(p) => p.id}
                renderItem={({ item: pl }) => {
                  const alreadyIn = pl.itemIds.includes(sermon.id);
                  return (
                    <TouchableOpacity
                      style={styles.sheetRow}
                      onPress={() => {
                        if (!alreadyIn) {
                          addToPlaylist(pl.id, sermon.id);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={alreadyIn ? 'checkmark-circle' : 'musical-notes-outline'}
                        size={20}
                        color={alreadyIn ? '#059669' : Colors.textSecondary}
                      />
                      <Text style={styles.sheetRowText}>{pl.name}</Text>
                      {alreadyIn && (
                        <Text style={styles.sheetAdded}>Added</Text>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  thumbWrap: {
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: 20,
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', paddingLeft: 4,
  },
  durationBadge: {
    position: 'absolute', bottom: 10, right: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: BorderRadius.sm,
    paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  durationText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  content: { padding: Spacing.base, paddingTop: Spacing.lg },
  title: { ...Typography.h2, marginBottom: Spacing.xs },
  scriptureBadge: {
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  scripture: { ...Typography.bodyMedium, color: Colors.accent, fontSize: 14 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  quickBtn: { alignItems: 'center', gap: 4 },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.lg },
  sectionLabel: {
    ...Typography.overline,
    marginBottom: Spacing.sm,
  },
  summary: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
  speaker: { ...Typography.bodyMedium },
  bottomBar: {
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: '#FFFFFF',
    ...Shadows.lg,
  },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md, gap: Spacing.sm,
    ...Shadows.md,
  },
  playBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  // Sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheetContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.xl, maxHeight: '50%',
  },
  sheetHandle: {
    width: 48, height: 4, borderRadius: 2,
    backgroundColor: '#D0D5DD', alignSelf: 'center', marginBottom: Spacing.lg,
  },
  sheetTitle: { ...Typography.h4, marginBottom: Spacing.lg },
  sheetEmpty: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.xl },
  sheetRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  sheetRowText: { ...Typography.bodyMedium, fontSize: 14, flex: 1 },
  sheetAdded: { fontSize: 12, fontWeight: '600', color: '#059669' },
});
