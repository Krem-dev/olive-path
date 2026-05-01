import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { devotionsApi } from '../../api/devotions';
import { useFetch } from '../../hooks/useFetch';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WeeklyDevotion'>;
type Rt = RouteProp<RootStackParamList, 'WeeklyDevotion'>;

export default function WeeklyDevotionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const requestedId = route.params?.devotionId;

  // Fetch the requested devotion (or current if none requested)
  const devotionFetch = useFetch(
    () =>
      requestedId
        ? devotionsApi.byId(requestedId)
        : devotionsApi.current(),
    [requestedId],
  );

  // Past devotions list — fetched in parallel; only shown on the "current" view
  const pastFetch = useFetch(() => devotionsApi.list({ limit: 10 }), []);

  if (devotionFetch.loading) {
    return (
      <View
        style={[
          styles.screen,
          styles.centered,
          { paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (devotionFetch.error || !devotionFetch.data) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={[styles.header, { paddingTop: 8 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.headerBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Devotion</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={[styles.centered, { flex: 1 }]}>
          <Text style={styles.errorText}>
            {devotionFetch.error || 'Devotion not available.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={devotionFetch.refetch}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const devotion = devotionFetch.data;
  // The 'current devotion' view is the one without an explicit requestedId
  const isCurrent = !requestedId;
  const dateRange = formatDateRange(devotion.weekStart, devotion.weekEnd);
  const paragraphs = devotion.reflection.split('\n\n');
  const pastList = (pastFetch.data?.data ?? []).filter(
    (d) => d.id !== devotion.id,
  );

  return (
    <View style={styles.screen}>
      {/* ── Custom Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.headerBtn}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Devotion</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerBtn}
            hitSlop={6}
          >
            <Ionicons
              name="bookmark-outline"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerBtn}
            hitSlop={6}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrowText}>
              {isCurrent ? 'THIS WEEK' : 'PAST DEVOTION'}
            </Text>
            <View style={styles.eyebrowLine} />
          </View>
          <Text style={styles.heroTitle}>{devotion.title}</Text>
          <Text style={styles.heroDate}>{dateRange}</Text>
        </View>

        {/* ── Scripture ── */}
        <View style={styles.scriptureBlock}>
          <Ionicons
            name="leaf"
            size={16}
            color={Colors.accent}
            style={styles.scriptureLeaf}
          />
          <Text style={styles.scriptureText}>"{devotion.scripture}"</Text>
          <View style={styles.scriptureRefRow}>
            <View style={styles.scriptureRefLine} />
            <Text style={styles.scriptureRef}>{devotion.scriptureRef}</Text>
          </View>
        </View>

        {/* ── Encouragement tagline ── */}
        <View style={styles.encouragementWrap}>
          <Text style={styles.encouragementText}>
            {devotion.encouragement}
          </Text>
        </View>

        {/* ── Reflection ── */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>REFLECTION</Text>
          {paragraphs.map((p, i) => (
            <Text key={i} style={styles.bodyText}>
              {p}
            </Text>
          ))}

          {/* Pastor attribution */}
          <View style={styles.pastorRow}>
            <View style={styles.pastorAvatar}>
              <Text style={styles.pastorInitials}>
                {getInitials(devotion.pastor.name)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pastorName}>{devotion.pastor.name}</Text>
              <Text style={styles.pastorTitle}>{devotion.pastor.title}</Text>
            </View>
          </View>
        </View>

        {/* ── Prayer ── */}
        {devotion.prayer && (
          <View style={styles.prayerCard}>
            <View style={styles.prayerHeader}>
              <View style={styles.prayerIconWrap}>
                <Ionicons name="heart" size={14} color={Colors.accent} />
              </View>
              <Text style={styles.prayerLabel}>A Prayer For You</Text>
            </View>
            <Text style={styles.prayerText}>{devotion.prayer}</Text>
          </View>
        )}

        {/* ── Past Devotions ── */}
        {isCurrent && pastList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>PAST DEVOTIONS</Text>
            <View style={{ gap: Spacing.md }}>
              {pastList.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={styles.pastCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.push('WeeklyDevotion', { devotionId: d.id })
                  }
                >
                  <View style={styles.pastDateWrap}>
                    <Text style={styles.pastDay}>
                      {new Date(d.weekStart).getDate()}
                    </Text>
                    <Text style={styles.pastMonth}>
                      {new Date(d.weekStart)
                        .toLocaleDateString('en-US', { month: 'short' })
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pastTitle} numberOfLines={1}>
                      {d.title}
                    </Text>
                    <Text style={styles.pastScripture} numberOfLines={1}>
                      {d.scriptureRef}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  screen: { flex: 1, backgroundColor: Colors.background },
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
  retryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Hero ──
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.6,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 40,
    marginBottom: Spacing.sm,
  },
  heroDate: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },

  // ── Scripture block ──
  scriptureBlock: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    ...Shadows.sm,
  },
  scriptureLeaf: {
    marginBottom: Spacing.md,
    opacity: 0.85,
  },
  scriptureText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 19,
    lineHeight: 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  scriptureRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scriptureRefLine: {
    width: 16,
    height: 1,
    backgroundColor: Colors.accent,
  },
  scriptureRef: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
  },

  // ── Encouragement ──
  encouragementWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.1,
  },

  // ── Section ──
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: Spacing.base,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 26,
    color: Colors.textPrimary,
    fontWeight: '400',
    marginBottom: Spacing.base,
  },

  // ── Pastor attribution ──
  pastorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  pastorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastorInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  pastorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pastorTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // ── Prayer ──
  prayerCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.18)',
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  prayerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(184, 137, 62, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  prayerText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 26,
    color: Colors.textPrimary,
  },

  // ── Past devotions list ──
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  pastDateWrap: {
    width: 50,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastDay: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 24,
  },
  pastMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginTop: 2,
  },
  pastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  pastScripture: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
});
