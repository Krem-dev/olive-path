import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { sermonsApi } from '../../api/sermons';
import { useFetch } from '../../hooks/useFetch';
import { RootStackParamList } from '../../types';
import { useLibraryStore } from '../../store/libraryStore';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type MotivationDetailRoute = RouteProp<
  RootStackParamList,
  'MotivationDetail'
>;

const TYPE_META: Record<
  string,
  { icon: IoniconName; label: string; primaryAction: string }
> = {
  video: { icon: 'videocam', label: 'Video', primaryAction: 'Watch' },
  audio: { icon: 'headset', label: 'Audio', primaryAction: 'Listen' },
  reading: { icon: 'book', label: 'Reading', primaryAction: 'Read' },
};

export default function MotivationDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<MotivationDetailRoute>();
  const itemId = route.params.sermonId;

  const { data: item, loading, error } = useFetch(
    () => sermonsApi.byId(itemId),
    [itemId],
  );

  const {
    bookmarkedIds,
    downloadedIds,
    toggleBookmark,
    toggleDownload,
  } = useLibraryStore();

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.errorText}>{error || 'Motivation not found.'}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.errorBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.errorBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isBookmarked = bookmarkedIds.includes(item.id);
  const isDownloaded = downloadedIds.includes(item.id);
  const typeMeta = TYPE_META[item.contentType] || TYPE_META.audio;
  const dateLabel = new Date(item.publishedAt)
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  return (
    <View style={styles.screen}>
      {/* ── Floating top bar ── */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroPlay}>
            <Ionicons
              name={typeMeta.icon}
              size={28}
              color={Colors.textInverse}
            />
          </View>
          <View style={styles.heroPills}>
            <View style={styles.motivBadge}>
              <Ionicons name="flame" size={11} color={Colors.accent} />
              <Text style={styles.motivBadgeText}>Motivation</Text>
            </View>
            <View style={styles.heroPill}>
              <Ionicons
                name="time-outline"
                size={11}
                color={Colors.textInverse}
              />
              <Text style={styles.heroPillText}>{item.duration}</Text>
            </View>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          <Text style={styles.dateEyebrow}>{dateLabel}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.scripturePill}>
            <Ionicons name="leaf" size={11} color={Colors.accent} />
            <Text style={styles.scriptureText}>{item.scripture}</Text>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <ActionTile
              icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              label={isBookmarked ? 'Saved' : 'Save'}
              tint={isBookmarked ? 'brass' : 'neutral'}
              onPress={() => toggleBookmark(item.id)}
            />
            <ActionTile
              icon={
                isDownloaded
                  ? 'checkmark-circle'
                  : 'cloud-download-outline'
              }
              label={isDownloaded ? 'Downloaded' : 'Download'}
              tint={isDownloaded ? 'success' : 'neutral'}
              onPress={() => toggleDownload(item.id)}
            />
            <ActionTile
              icon="share-social-outline"
              label="Share"
              tint="neutral"
              onPress={() => {}}
            />
          </View>

          {/* Message */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>MESSAGE</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>

          {/* Speaker */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>SPEAKER</Text>
            <View style={styles.speakerCard}>
              <View style={styles.speakerAvatar}>
                <Text style={styles.speakerInitials}>EOB</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.speakerName}>
                  Rev. Ing. Eric Ofori Broni
                </Text>
                <Text style={styles.speakerTitle}>EBroni Global Media</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Ionicons
            name={typeMeta.icon}
            size={16}
            color={Colors.textInverse}
          />
          <Text style={styles.primaryButtonText}>
            {typeMeta.primaryAction}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ActionTile({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  tint: 'brass' | 'success' | 'neutral';
  onPress: () => void;
}) {
  const bg =
    tint === 'brass'
      ? 'rgba(184, 137, 62, 0.13)'
      : tint === 'success'
      ? Colors.successLight
      : Colors.surfaceBlue;
  const fg =
    tint === 'brass'
      ? Colors.accent
      : tint === 'success'
      ? Colors.success
      : Colors.textSecondary;
  const labelColor =
    tint === 'brass'
      ? Colors.accent
      : tint === 'success'
      ? Colors.success
      : Colors.textPrimary;
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.tileIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={fg} />
      </View>
      <Text style={[styles.tileLabel, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  errorBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  hero: {
    aspectRatio: 16 / 10,
    backgroundColor: Colors.surfaceBlue,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 25, 0.32)',
  },
  heroPlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 64,
    height: 64,
    marginTop: -32,
    marginLeft: -32,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  heroPills: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    flexDirection: 'row',
    gap: 6,
  },
  motivBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.4)',
  },
  motivBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.3,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(31, 36, 25, 0.78)',
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  dateEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  scripturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.25)',
    marginBottom: Spacing.lg,
  },
  scriptureText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  tile: {
    flex: 1,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: Spacing.base,
  },
  summary: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 25,
  },
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  speakerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  speakerTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
});
