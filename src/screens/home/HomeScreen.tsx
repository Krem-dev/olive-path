/**
 * HomeScreen — migrated to Fluent UI.
 *
 * Surfaces are FluentCard, headings use Fluent Text variants, every icon is a
 * Fluent System Icon, and all colour comes from Fluent's alias tokens.
 */

import React from 'react';
import {
  View,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FluentCard,
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import {
  Alert24Regular,
  Person24Filled,
  Bookmark24Regular,
  ChatMultiple24Regular,
  Calendar24Regular,
  Heart24Regular,
  QuestionCircle24Regular,
  BookOpen24Regular,
  LeafTwo24Regular,
} from '../../components/fluent/icons';
import { SectionTitle } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { devotionsApi } from '../../api/devotions';
import { sermonsApi } from '../../api/sermons';
import { programsApi } from '../../api/programs';
import { RootStackParamList } from '../../types';
import { Sermon } from '../../types/content';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FluentIcon = React.FC<any>;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const colors = useFluentColors();
  const [refreshing, setRefreshing] = React.useState(false);

  const devotion = useFetch(() => devotionsApi.current(), []);
  const sermons = useFetch(() => sermonsApi.recent(), []);
  const programs = useFetch(() => programsApi.upcoming(), []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([devotion.refetch(), sermons.refetch(), programs.refetch()]);
    setRefreshing(false);
  };

  const openSermon = (item: Sermon) => {
    nav.navigate(
      item.category === 'preaching' ? 'SermonDetail' : 'MotivationDetail',
      { sermonId: item.id },
    );
  };

  const iconBtn = ({ pressed }: { pressed: boolean }) => [
    s.headerBtn,
    {
      backgroundColor: pressed
        ? (colors.neutralBackground1Pressed as string)
        : (colors.neutralBackground1 as string),
      borderColor: colors.neutralStroke1 as string,
    },
  ];

  return (
    <ScrollView
      style={[s.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + FluentSpacing.xxxl }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.brandForeground1 as string}
        />
      }
    >
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.flex}>
          <Text variant="body2" color={colors.neutralForeground2 as string}>
            {`${greeting()},`}
          </Text>
          <Text variant="title1" numberOfLines={1}>
            {user?.name?.split(' ')[0] || 'Welcome'}
          </Text>
        </View>

        <Pressable
          onPress={() => nav.navigate('Notifications')}
          style={iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Alert24Regular color={colors.neutralForeground1 as string} />
          <View style={[s.notifDot, { backgroundColor: colors.dangerBackground2 as string }]} />
        </Pressable>

        <Pressable
          onPress={() => nav.navigate('Profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          style={({ pressed }) => [
            s.avatarBtn,
            {
              backgroundColor: pressed
                ? (colors.brandBackgroundPressed as string)
                : (colors.brandBackground as string),
            },
          ]}
        >
          <Person24Filled color={colors.neutralForegroundOnColor as string} />
        </Pressable>
      </View>

      {/* ── Devotion ── */}
      <View style={s.gutter}>
        <FluentCard
          appearance="filled"
          size="large"
          onPress={() => nav.navigate('WeeklyDevotion')}
        >
          <View style={s.devTop}>
            <Text
              variant="caption1Strong"
              color={colors.brandForeground1 as string}
              style={s.tracked}
            >
              THIS WEEK&apos;S WORD
            </Text>
            <Bookmark24Regular color={colors.neutralForeground3 as string} />
          </View>

          <Text variant="subtitle2" numberOfLines={4}>
            {`"${devotion.data?.scripture ?? ''}"`}
          </Text>

          <View style={s.devBottom}>
            <Text variant="body1Strong">{devotion.data?.scriptureRef ?? ''}</Text>
            <Text variant="body2" color={colors.brandForeground1 as string}>
              Read →
            </Text>
          </View>
        </FluentCard>
      </View>

      {/* ── Quick actions ── */}
      <View style={[s.gutter, s.quickRow]}>
        <QuickAction
          icon={ChatMultiple24Regular}
          label="Counselling"
          onPress={() => nav.navigate('BookCounselling')}
        />
        <QuickAction
          icon={Calendar24Regular}
          label="Book Pastor"
          onPress={() => nav.navigate('BookEric')}
        />
        <QuickAction
          icon={Heart24Regular}
          label="Prayer"
          onPress={() => nav.navigate('PrayerRequest')}
        />
      </View>

      {/* ── Upcoming programs ── */}
      {(programs.data ?? []).length > 0 && (
        <>
          <SectionTitle title="Upcoming Programs" />
          <FlatList
            data={programs.data}
            keyExtractor={(i) => String(i.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.hScroll}
            ItemSeparatorComponent={() => <View style={s.gapM} />}
            renderItem={({ item }) => {
              const d = new Date(item.date);
              return (
                <FluentCard appearance="filled" size="medium" horizontal style={s.progCard}>
                  <View
                    style={[
                      s.progDate,
                      { backgroundColor: FluentTint.subtle },
                    ]}
                  >
                    <Text variant="subtitle2" color={colors.brandForeground1 as string}>
                      {String(d.getDate())}
                    </Text>
                    <Text variant="caption1Strong" color={colors.brandForeground1 as string}>
                      {d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                  <View style={s.flex}>
                    <Text variant="body1Strong" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text
                      variant="caption1"
                      color={colors.neutralForeground2 as string}
                      numberOfLines={1}
                    >
                      {`${item.time} · ${item.location}`}
                    </Text>
                  </View>
                </FluentCard>
              );
            }}
          />
        </>
      )}

      {/* ── Recent teachings ── */}
      {(sermons.data ?? []).length > 0 && (
        <>
          <View style={s.sectionSpacer} />
          <SectionTitle
            title="Recent Teachings"
            actionLabel="See All"
            onAction={() => nav.navigate('MainTabs')}
          />
          <FlatList
            data={(sermons.data ?? []).slice(0, 6)}
            keyExtractor={(i) => String(i.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.hScroll}
            ItemSeparatorComponent={() => <View style={s.gapL} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => openSermon(item)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                style={s.teachCard}
              >
                <View style={s.teachImgWrap}>
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={[
                      s.teachImg,
                      { backgroundColor: colors.neutralBackground4 as string },
                    ]}
                  />
                  <View style={s.teachDur}>
                    <Text variant="caption1Strong" color="#FFFFFF">
                      {item.duration}
                    </Text>
                  </View>
                </View>
                <Text variant="body1Strong" numberOfLines={1} style={s.teachTitle}>
                  {item.title}
                </Text>
                <Text
                  variant="caption1"
                  color={colors.neutralForeground2 as string}
                  numberOfLines={1}
                >
                  {item.scripture}
                </Text>
              </Pressable>
            )}
          />
        </>
      )}

      {/* ── Explore more ── */}
      <View style={[s.gutter, s.quickRow, s.exploreRow]}>
        <QuickAction
          icon={QuestionCircle24Regular}
          label="Q&A"
          onPress={() => nav.navigate('MainTabs')}
        />
        <QuickAction
          icon={BookOpen24Regular}
          label="Library"
          onPress={() => nav.navigate('MainTabs')}
        />
        <QuickAction
          icon={LeafTwo24Regular}
          label="Devotion"
          onPress={() => nav.navigate('WeeklyDevotion')}
        />
      </View>
    </ScrollView>
  );
}

/* ── Quick action tile ── */
function QuickAction({
  icon: Icon,
  label,
  onPress,
}: {
  icon: FluentIcon;
  label: string;
  onPress: () => void;
}) {
  const colors = useFluentColors();
  return (
    <FluentCard appearance="filled" size="medium" onPress={onPress} style={s.quickBtn}>
      <View style={[s.quickIcon, { backgroundColor: FluentTint.subtle }]}>
        <Icon color={colors.brandForeground1 as string} />
      </View>
      <Text variant="caption1Strong" numberOfLines={1}>
        {label}
      </Text>
    </FluentCard>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  gutter: { paddingHorizontal: FluentSpacing.l },
  gapM: { width: FluentSpacing.m },
  gapL: { width: FluentSpacing.l },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.l,
    gap: FluentSpacing.mNudge,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: FluentCorner.xxLarge,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: FluentCorner.circular,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  devTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tracked: { letterSpacing: 1 },
  devBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: FluentSpacing.xs,
  },

  quickRow: {
    flexDirection: 'row',
    gap: FluentSpacing.m,
    marginTop: FluentSpacing.l,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: FluentCorner.xxLarge,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hScroll: {
    paddingHorizontal: FluentSpacing.l,
    paddingVertical: FluentSpacing.xs,
  },
  sectionSpacer: { height: FluentSpacing.xxl },

  progCard: { width: 260 },
  progDate: {
    width: 52,
    height: 52,
    borderRadius: FluentCorner.large,
    justifyContent: 'center',
    alignItems: 'center',
  },

  teachCard: { width: 220 },
  teachImgWrap: { position: 'relative' },
  teachImg: {
    width: 220,
    height: 124,
    borderRadius: FluentCorner.xLarge,
  },
  teachDur: {
    position: 'absolute',
    right: FluentSpacing.s,
    bottom: FluentSpacing.s,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: FluentSpacing.s,
    paddingVertical: 2,
    borderRadius: FluentCorner.medium,
  },
  teachTitle: { marginTop: FluentSpacing.s },

  exploreRow: { marginTop: FluentSpacing.xxl },
});
