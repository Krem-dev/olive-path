import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { devotionsApi } from '../../api/devotions';
import { sermonsApi } from '../../api/sermons';
import { programsApi } from '../../api/programs';
import { RootStackParamList } from '../../types';
import { Sermon } from '../../types/content';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = React.useState(false);

  const devotion = useFetch(() => devotionsApi.current(), []);
  const sermons = useFetch(() => sermonsApi.recent(), []);
  const programs = useFetch(() => programsApi.upcoming(), []);

  const todayLabel = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  const handleItemPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      devotion.refetch(),
      sermons.refetch(),
      programs.refetch(),
    ]);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accent}
        />
      }
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateLabel}>{todayLabel}</Text>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name?.split(' ')[0] || 'Welcome'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
            style={styles.headerIconBtn}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.textPrimary}
            />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={16} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── This Week's Devotion (HERO) ── */}
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.scriptureCard}
        onPress={() => navigation.navigate('WeeklyDevotion')}
      >
        <View style={styles.scriptureHeaderRow}>
          <View style={styles.scriptureBadge}>
            <Ionicons name="leaf" size={10} color={Colors.accent} />
            <Text style={styles.scriptureBadgeText}>This Week's Word</Text>
          </View>
          <TouchableOpacity activeOpacity={0.6} hitSlop={8}>
            <Ionicons
              name="bookmark-outline"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.scriptureQuote}>
          "{devotion.data?.scripture ?? ''}"
        </Text>
        <View style={styles.scriptureFooter}>
          <View style={styles.scriptureRefRow}>
            <View style={styles.scriptureRefDot} />
            <Text style={styles.scriptureRef}>
              {devotion.data?.scriptureRef ?? '—'}
            </Text>
          </View>
          <View style={styles.scriptureCta}>
            <Text style={styles.scriptureCtaText}>Read devotion</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={Colors.accent}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Quick Actions ── */}
      <View style={styles.actionRow}>
        <ActionTile
          icon="chatbubbles-outline"
          label="Counselling"
          tint="brass"
          onPress={() => navigation.navigate('BookCounselling')}
        />
        <ActionTile
          icon="calendar-outline"
          label="Book Pastor"
          tint="olive"
          onPress={() => navigation.navigate('BookEric')}
        />
        <ActionTile
          icon="heart-outline"
          label="Prayer"
          tint="brass"
          onPress={() => navigation.navigate('PrayerRequest')}
        />
      </View>

      {/* ── Upcoming Programs ── */}
      <View style={styles.sectionRow}>
        <View>
          <Text style={styles.sectionEyebrow}>WHAT'S NEXT</Text>
          <Text style={styles.sectionTitle}>Upcoming Programs</Text>
        </View>
      </View>
      <FlatList
        data={programs.data ?? []}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
        renderItem={({ item }) => {
          const dateObj = new Date(item.date);
          const day = dateObj.getDate();
          const month = dateObj
            .toLocaleDateString('en-US', { month: 'short' })
            .toUpperCase();
          return (
            <TouchableOpacity
              activeOpacity={0.92}
              style={styles.programCard}
            >
              <View style={styles.programDateWrap}>
                <Text style={styles.programDay}>{day}</Text>
                <Text style={styles.programMonth}>{month}</Text>
              </View>
              <View style={styles.programInfo}>
                <Text style={styles.programTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.programMeta}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.programMetaText}>{item.time}</Text>
                </View>
                <View style={styles.programMeta}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.programMetaText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* ── Recent Teachings ── */}
      <View style={styles.sectionRow}>
        <View>
          <Text style={styles.sectionEyebrow}>FROM THE PULPIT</Text>
          <Text style={styles.sectionTitle}>Recent Teachings</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={(sermons.data ?? []).slice(0, 5)}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.base }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.teachCard}
            activeOpacity={0.88}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.teachThumbWrap}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.teachThumb}
              />
              <View style={styles.teachThumbOverlay} />
              <View style={styles.teachPlayBtn}>
                <Ionicons name="play" size={14} color={Colors.textInverse} />
              </View>
              <View style={styles.teachDuration}>
                <Text style={styles.teachDurationText}>{item.duration}</Text>
              </View>
            </View>
            <Text style={styles.teachTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.teachSub} numberOfLines={1}>
              {item.scripture}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ── Bottom CTA — Q&A ── */}
      <TouchableOpacity style={styles.bottomBanner} activeOpacity={0.88}>
        <View style={styles.bannerIconWrap}>
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={Colors.accent}
          />
        </View>
        <View style={styles.bannerCenter}>
          <Text style={styles.bannerTitle}>Biblical Q&A</Text>
          <Text style={styles.bannerSub}>
            Find answers grounded in scripture
          </Text>
        </View>
        <View style={styles.bannerArrowWrap}>
          <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Action tile ──
type Tint = 'olive' | 'brass';
function ActionTile({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  tint: Tint;
  onPress: () => void;
}) {
  const tintBg =
    tint === 'olive'
      ? 'rgba(61, 79, 44, 0.10)'
      : 'rgba(184, 137, 62, 0.13)';
  const tintFg = tint === 'olive' ? Colors.primary : Colors.accent;

  return (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.tileIconWrap, { backgroundColor: tintBg }]}>
        <Ionicons name={icon} size={20} color={tintFg} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 0,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Daily Scripture Card ──
  scriptureCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  scriptureHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scriptureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
  },
  scriptureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scriptureQuote: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 26,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  scriptureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scriptureRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scriptureRefDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  scriptureRef: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.2,
  },
  scriptureCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scriptureCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.2,
  },

  // ── Action tiles ──
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  tile: {
    flex: 1,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  tileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },

  // ── Section header ──
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },

  // ── Carousel ──
  carousel: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.xl,
  },

  // ── Program cards ──
  programCard: {
    flexDirection: 'row',
    width: 280,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  programDateWrap: {
    width: 56,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programDay: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 26,
  },
  programMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginTop: 2,
  },
  programInfo: { flex: 1, justifyContent: 'center' },
  programTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  programMetaText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },

  // ── Teaching cards ──
  teachCard: { width: 220 },
  teachThumbWrap: {
    width: '100%',
    height: 130,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm + 2,
    backgroundColor: Colors.surfaceBlue,
  },
  teachThumb: { width: '100%', height: '100%' },
  teachThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 25, 0.18)',
  },
  teachPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: -19,
    marginTop: -19,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  teachDuration: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(31, 36, 25, 0.78)',
  },
  teachDurationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  teachTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  teachSub: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '500',
  },

  // ── Bottom Q&A CTA ──
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCenter: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  bannerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  bannerArrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
