/**
 * SermonDetailScreen — migrated to Fluent UI.
 */

import React from 'react';
import { View, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Text,
  Spinner,
  FluentCard,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import {
  ChevronLeft24Regular,
  ShareAndroid24Regular,
  Clock16Regular,
  LeafTwo16Regular,
  Video24Filled,
  Headphones24Filled,
  BookOpen24Filled,
  Bookmark24Regular,
  Bookmark24Filled,
  ArrowDownload24Regular,
  CheckmarkCircle24Filled,
} from '../../components/fluent/icons';
import { Button } from '../../components/ui';
import { sermonsApi } from '../../api/sermons';
import { useFetch } from '../../hooks/useFetch';
import { RootStackParamList } from '../../types';
import { useLibraryStore } from '../../store/libraryStore';

type FluentIcon = React.FC<any>;
type SermonDetailRoute = RouteProp<RootStackParamList, 'SermonDetail'>;

const TYPE_META: Record<
  string,
  { icon: FluentIcon; label: string; primaryAction: string }
> = {
  video: { icon: Video24Filled, label: 'Video', primaryAction: 'Watch sermon' },
  audio: { icon: Headphones24Filled, label: 'Audio', primaryAction: 'Listen sermon' },
  reading: { icon: BookOpen24Filled, label: 'Reading', primaryAction: 'Read sermon' },
};

export default function SermonDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<SermonDetailRoute>();
  const colors = useFluentColors();
  const sermonId = route.params.sermonId;

  const { data: sermon, loading, error } = useFetch(
    () => sermonsApi.byId(sermonId),
    [sermonId],
  );

  const { bookmarkedIds, downloadedIds, toggleBookmark, toggleDownload } =
    useLibraryStore();

  const screenBg = { backgroundColor: colors.neutralBackground3 as string };

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered, screenBg]}>
        <Spinner />
      </View>
    );
  }

  if (error || !sermon) {
    return (
      <View style={[styles.screen, styles.centered, screenBg]}>
        <Text variant="body1" color={colors.neutralForeground2 as string}>
          {error || 'Sermon not found.'}
        </Text>
        <Button
          label="Go back"
          onPress={() => navigation.goBack()}
          variant="outlined"
          fullWidth={false}
        />
      </View>
    );
  }

  const isBookmarked = bookmarkedIds.includes(sermon.id);
  const isDownloaded = downloadedIds.includes(sermon.id);
  const typeMeta = TYPE_META[sermon.contentType] || TYPE_META.audio;
  const TypeIcon = typeMeta.icon;
  const dateLabel = new Date(sermon.publishedAt)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    .toUpperCase();

  const iconBtn = ({ pressed }: { pressed: boolean }) => [
    styles.iconBtn,
    {
      backgroundColor: pressed
        ? (colors.neutralBackground1Pressed as string)
        : (colors.neutralBackground1 as string),
    },
  ];

  return (
    <View style={[styles.screen, screenBg]}>
      {/* ── Floating top bar ── */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={iconBtn}
        >
          <ChevronLeft24Regular color={colors.neutralForeground1 as string} />
        </Pressable>
        <Pressable
          onPress={() => {}}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share"
          style={iconBtn}
        >
          <ShareAndroid24Regular color={colors.neutralForeground1 as string} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Image source={{ uri: sermon.thumbnailUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={[styles.heroPlay, { backgroundColor: colors.brandBackground as string }]}>
            <TypeIcon color={colors.neutralForegroundOnColor as string} />
          </View>
          <View style={styles.heroPills}>
            <View style={styles.heroPill}>
              <TypeIcon color="#FFFFFF" width={12} height={12} />
              <Text variant="caption1Strong" color="#FFFFFF">
                {typeMeta.label}
              </Text>
            </View>
            <View style={styles.heroPill}>
              <Clock16Regular color="#FFFFFF" width={12} height={12} />
              <Text variant="caption1Strong" color="#FFFFFF">
                {sermon.duration}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
            {dateLabel}
          </Text>
          <Text variant="title1">{sermon.title}</Text>

          <View style={[styles.scripturePill, { backgroundColor: FluentTint.subtle }]}>
            <LeafTwo16Regular color={colors.brandForeground1 as string} width={12} height={12} />
            <Text variant="caption1Strong" color={colors.brandForeground1 as string}>
              {sermon.scripture}
            </Text>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <ActionTile
              icon={isBookmarked ? Bookmark24Filled : Bookmark24Regular}
              label={isBookmarked ? 'Saved' : 'Save'}
              active={isBookmarked}
              onPress={() => toggleBookmark(sermon.id)}
            />
            <ActionTile
              icon={isDownloaded ? CheckmarkCircle24Filled : ArrowDownload24Regular}
              label={isDownloaded ? 'Downloaded' : 'Download'}
              active={isDownloaded}
              onPress={() => toggleDownload(sermon.id)}
            />
            <ActionTile
              icon={ShareAndroid24Regular}
              label="Share"
              active={false}
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
              SUMMARY
            </Text>
            <Text variant="body1" color={colors.neutralForeground1 as string} style={styles.summary}>
              {sermon.summary}
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
              SPEAKER
            </Text>
            <FluentCard appearance="filled" size="large" horizontal>
              <View style={[styles.avatar, { backgroundColor: colors.brandBackground as string }]}>
                <Text variant="body2Strong" color={colors.neutralForegroundOnColor as string}>
                  EOB
                </Text>
              </View>
              <View style={styles.flex}>
                <Text variant="body1Strong">Rev. Ing. Eric Ofori Broni</Text>
                <Text variant="caption1" color={colors.neutralForeground2 as string}>
                  EBroni Global Media
                </Text>
              </View>
            </FluentCard>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + FluentSpacing.m,
            backgroundColor: colors.neutralBackground1 as string,
            borderTopColor: colors.neutralStroke2 as string,
          },
        ]}
      >
        <Button
          label={typeMeta.primaryAction}
          onPress={() => {}}
          variant="primary"
          size="lg"
          icon={typeMeta.icon}
        />
      </View>
    </View>
  );
}

function ActionTile({
  icon: Icon,
  label,
  active,
  onPress,
}: {
  icon: FluentIcon;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useFluentColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: pressed
            ? (colors.neutralBackground1Pressed as string)
            : active
              ? FluentTint.subtle
              : (colors.neutralBackground1 as string),
          borderColor: active
            ? (colors.brandStroke1 as string)
            : (colors.neutralStroke2 as string),
        },
      ]}
    >
      <Icon
        color={
          active
            ? (colors.brandForeground1 as string)
            : (colors.neutralForeground2 as string)
        }
      />
      <Text
        variant="caption1Strong"
        color={
          active
            ? (colors.brandForeground1 as string)
            : (colors.neutralForeground2 as string)
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  tracked: { letterSpacing: 1.2 },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: FluentSpacing.l,
    paddingHorizontal: FluentSpacing.l,
  },

  topBar: {
    position: 'absolute',
    left: FluentSpacing.l,
    right: FluentSpacing.l,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hero: { height: 280, justifyContent: 'flex-end' },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroPlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: 64,
    height: 64,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPills: {
    flexDirection: 'row',
    gap: FluentSpacing.s,
    padding: FluentSpacing.l,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.xs,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: FluentSpacing.s,
    paddingVertical: 3,
    borderRadius: FluentCorner.circular,
  },

  content: {
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.l,
    gap: FluentSpacing.s,
  },
  scripturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: FluentSpacing.xs,
    paddingHorizontal: FluentSpacing.m,
    paddingVertical: FluentSpacing.xs,
    borderRadius: FluentCorner.circular,
  },

  quickActions: {
    flexDirection: 'row',
    gap: FluentSpacing.m,
    marginTop: FluentSpacing.m,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: FluentSpacing.xs,
    paddingVertical: FluentSpacing.m,
    borderRadius: FluentCorner.xLarge,
    borderWidth: 1,
  },

  section: { marginTop: FluentSpacing.xl, gap: FluentSpacing.s },
  summary: { lineHeight: 24 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.m,
    borderTopWidth: 1,
    // Without elevation the ScrollView paints over this bar on Android.
    zIndex: 20,
    elevation: 8,
  },
});
