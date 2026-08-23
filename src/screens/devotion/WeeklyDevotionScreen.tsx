/**
 * WeeklyDevotionScreen — migrated to Fluent UI.
 *
 * TYPOGRAPHY: the scripture quote and devotion title deliberately keep their
 * serif face. Fluent's type ramp is built for UI chrome; setting devotional
 * text in it would make this read like a settings page. Everything else —
 * chrome, icons, surfaces, colour — is Fluent.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  ChevronRight20Regular,
  Bookmark24Regular,
  Share24Regular,
  LeafTwo24Regular,
  Heart24Filled,
} from '../../components/fluent/icons';
import { Button } from '../../components/ui';
import { devotionsApi } from '../../api/devotions';
import { useFetch } from '../../hooks/useFetch';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WeeklyDevotion'>;
type Rt = RouteProp<RootStackParamList, 'WeeklyDevotion'>;

export default function WeeklyDevotionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const colors = useFluentColors();
  const requestedId = route.params?.devotionId;

  const devotionFetch = useFetch(
    () => (requestedId ? devotionsApi.byId(requestedId) : devotionsApi.current()),
    [requestedId],
  );

  // Past devotions list — fetched in parallel; only shown on the "current" view
  const pastFetch = useFetch(() => devotionsApi.list({ limit: 10 }), []);

  const headerBtn = ({ pressed }: { pressed: boolean }) => [
    styles.headerBtn,
    pressed && { backgroundColor: colors.neutralBackground1Pressed as string },
  ];

  const Header = ({ topPad }: { topPad: number }) => (
    <View style={[styles.header, { paddingTop: topPad }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={headerBtn}
      >
        <ChevronLeft24Regular color={colors.neutralForeground1 as string} />
      </Pressable>

      <Text variant="body1Strong" style={styles.headerTitle}>
        Weekly Devotion
      </Text>

      <View style={styles.headerActions}>
        <Pressable hitSlop={6} accessibilityRole="button" accessibilityLabel="Bookmark" style={headerBtn}>
          <Bookmark24Regular color={colors.neutralForeground1 as string} />
        </Pressable>
        <Pressable hitSlop={6} accessibilityRole="button" accessibilityLabel="Share" style={headerBtn}>
          <Share24Regular color={colors.neutralForeground1 as string} />
        </Pressable>
      </View>
    </View>
  );

  if (devotionFetch.loading) {
    return (
      <View
        style={[
          styles.screen,
          styles.centered,
          { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
        ]}
      >
        <Spinner />
      </View>
    );
  }

  if (devotionFetch.error || !devotionFetch.data) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
        ]}
      >
        <Header topPad={8} />
        <View style={[styles.centered, styles.flex]}>
          <Text
            variant="body1"
            color={colors.neutralForeground2 as string}
            style={styles.center}
          >
            {devotionFetch.error || 'Devotion not available.'}
          </Text>
          <Button
            label="Try again"
            onPress={devotionFetch.refetch}
            variant="outlined"
            fullWidth={false}
          />
        </View>
      </View>
    );
  }

  const devotion = devotionFetch.data;
  // The 'current devotion' view is the one without an explicit requestedId
  const isCurrent = !requestedId;
  const dateRange = formatDateRange(devotion.weekStart, devotion.weekEnd);
  const paragraphs = devotion.reflection.split('\n\n');
  const pastList = (pastFetch.data?.data ?? []).filter((d) => d.id !== devotion.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}>
      <Header topPad={insets.top + 8} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + FluentSpacing.xxxl }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.eyebrowRow}>
            <View style={[styles.eyebrowLine, { backgroundColor: colors.brandStroke1 as string }]} />
            <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
              {isCurrent ? 'THIS WEEK' : 'PAST DEVOTION'}
            </Text>
            <View style={[styles.eyebrowLine, { backgroundColor: colors.brandStroke1 as string }]} />
          </View>

          <Text style={[styles.heroTitle, { color: colors.neutralForeground1 as string }]}>
            {devotion.title}
          </Text>
          <Text variant="body2" color={colors.neutralForeground2 as string}>
            {dateRange}
          </Text>
        </View>

        {/* ── Scripture ── */}
        <View style={styles.gutter}>
          <FluentCard appearance="filled" size="large">
            <LeafTwo24Regular
              color={colors.brandForeground1 as string}
              width={20}
              height={20}
              style={styles.leaf}
            />
            <Text style={[styles.scriptureText, { color: colors.neutralForeground1 as string }]}>
              {`"${devotion.scripture}"`}
            </Text>
            <View style={styles.scriptureRefRow}>
              <View style={[styles.refLine, { backgroundColor: colors.brandStroke1 as string }]} />
              <Text variant="body2Strong" color={colors.brandForeground1 as string}>
                {devotion.scriptureRef}
              </Text>
            </View>
          </FluentCard>
        </View>

        {/* ── Encouragement ── */}
        <View style={[styles.gutter, styles.encouragement]}>
          <Text variant="body1Strong" style={styles.center}>
            {devotion.encouragement}
          </Text>
        </View>

        {/* ── Reflection ── */}
        <View style={[styles.gutter, styles.section]}>
          <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
            REFLECTION
          </Text>
          {paragraphs.map((para, i) => (
            <Text
              key={i}
              variant="body1"
              color={colors.neutralForeground1 as string}
              style={styles.bodyText}
            >
              {para}
            </Text>
          ))}

          <View style={styles.pastorRow}>
            <View style={[styles.pastorAvatar, { backgroundColor: colors.brandBackground as string }]}>
              <Text variant="body2Strong" color={colors.neutralForegroundOnColor as string}>
                {getInitials(devotion.pastor.name)}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text variant="body1Strong">{devotion.pastor.name}</Text>
              <Text variant="caption1" color={colors.neutralForeground2 as string}>
                {devotion.pastor.title}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Prayer ── */}
        {devotion.prayer ? (
          <View style={styles.gutter}>
            <FluentCard appearance="filled-alternative" size="large">
              <View style={styles.prayerHeader}>
                <View style={[styles.prayerIcon, { backgroundColor: FluentTint.subtle }]}>
                  <Heart24Filled color={colors.brandForeground1 as string} width={16} height={16} />
                </View>
                <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
                  A PRAYER FOR YOU
                </Text>
              </View>
              <Text style={[styles.prayerText, { color: colors.neutralForeground1 as string }]}>
                {devotion.prayer}
              </Text>
            </FluentCard>
          </View>
        ) : null}

        {/* ── Past devotions ── */}
        {isCurrent && pastList.length > 0 ? (
          <View style={[styles.gutter, styles.section]}>
            <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
              PAST DEVOTIONS
            </Text>
            <View style={styles.pastList}>
              {pastList.map((d) => (
                <FluentCard
                  key={d.id}
                  appearance="filled"
                  size="medium"
                  horizontal
                  onPress={() => navigation.push('WeeklyDevotion', { devotionId: d.id })}
                >
                  <View style={[styles.pastDate, { backgroundColor: FluentTint.subtle }]}>
                    <Text variant="body1Strong" color={colors.brandForeground1 as string}>
                      {String(new Date(d.weekStart).getDate())}
                    </Text>
                    <Text variant="caption1Strong" color={colors.brandForeground1 as string}>
                      {new Date(d.weekStart)
                        .toLocaleDateString('en-US', { month: 'short' })
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.flex}>
                    <Text variant="body1Strong" numberOfLines={1}>
                      {d.title}
                    </Text>
                    <Text variant="caption1" color={colors.neutralForeground2 as string} numberOfLines={1}>
                      {d.scriptureRef}
                    </Text>
                  </View>
                  <ChevronRight20Regular color={colors.neutralForeground3 as string} />
                </FluentCard>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const sameMonth = start.getMonth() === end.getMonth();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('en-US', opts);
  if (sameMonth) {
    return `${fmt(start, { month: 'long' })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${fmt(start, { month: 'short', day: 'numeric' })} – ${fmt(end, { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
}

function getInitials(fullName: string): string {
  const parts = fullName.replace(/\./g, '').split(/\s+/).filter(Boolean);
  // Take last 2 meaningful parts (skip honorifics like "Rev.", "Ing.")
  const meaningful = parts.filter(
    (p) => !['Rev', 'Ing', 'Mr', 'Mrs', 'Dr', 'Pst', 'Ps'].includes(p),
  );
  const pick = meaningful.length >= 2 ? meaningful : parts;
  return pick
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  gutter: { paddingHorizontal: FluentSpacing.l },
  center: { textAlign: 'center' },
  tracked: { letterSpacing: 1.2 },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: FluentSpacing.l,
    paddingHorizontal: FluentSpacing.l,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.s,
    gap: FluentSpacing.s,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: FluentCorner.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', gap: FluentSpacing.xxs },

  hero: {
    alignItems: 'center',
    paddingHorizontal: FluentSpacing.xxl,
    paddingTop: FluentSpacing.l,
    paddingBottom: FluentSpacing.xl,
    gap: FluentSpacing.s,
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: FluentSpacing.s },
  eyebrowLine: { width: 28, height: 1, opacity: 0.6 },

  // Serif, deliberately — see the note at the top of this file.
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
  },
  scriptureText: {
    fontFamily: 'serif',
    fontSize: 19,
    lineHeight: 32,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  prayerText: {
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 28,
    fontStyle: 'italic',
  },

  leaf: { alignSelf: 'center' },
  scriptureRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: FluentSpacing.s,
  },
  refLine: { width: 20, height: 1, opacity: 0.6 },

  encouragement: { paddingVertical: FluentSpacing.xl },
  section: { marginTop: FluentSpacing.l, gap: FluentSpacing.m },
  bodyText: { lineHeight: 26 },

  pastorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.m,
    marginTop: FluentSpacing.l,
  },
  pastorAvatar: {
    width: 44,
    height: 44,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  prayerHeader: { flexDirection: 'row', alignItems: 'center', gap: FluentSpacing.s },
  prayerIcon: {
    width: 28,
    height: 28,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pastList: { gap: FluentSpacing.m },
  pastDate: {
    width: 52,
    height: 52,
    borderRadius: FluentCorner.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
