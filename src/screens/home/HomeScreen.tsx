import React from 'react';
import {
  View,
  Text,
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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { todaysDevotion, sermons, motivations } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Sermon } from '../../types/content';

import DevotionCard from '../../components/home/DevotionCard';
import SectionHeader from '../../components/common/SectionHeader';
import ContentCard from '../../components/common/ContentCard';
import RecentTeachingRow from '../../components/home/RecentTeachingRow';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleItemPress = (item: Sermon) => {
    if (item.category === 'preaching') {
      navigation.navigate('SermonDetail', { sermonId: item.id });
    } else {
      navigation.navigate('MotivationDetail', { sermonId: item.id });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
      }
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing['2xl'] }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
            style={styles.headerIconBtn}
          >
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Daily Devotion ── */}
      <DevotionCard devotion={todaysDevotion} />

      {/* ── Featured ── */}
      <SectionHeader title="Featured" />
      <FlatList
        data={sermons.slice(0, 4)}
        keyExtractor={(item) => `feat-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
        renderItem={({ item, index }) => (
          <ContentCard
            title={item.title}
            subtitle={item.scripture}
            thumbnailUrl={item.thumbnailUrl}
            duration={item.duration}
            tag={index === 0 ? 'New' : undefined}
            width={200}
            onPress={() => handleItemPress(item)}
          />
        )}
      />

      {/* ── Recent Teachings ── */}
      <SectionHeader title="Recent Teachings" />
      <FlatList
        data={sermons.slice(2, 7)}
        keyExtractor={(item) => `recent-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
        renderItem={({ item }) => (
          <ContentCard
            title={item.title}
            subtitle={item.scripture}
            thumbnailUrl={item.thumbnailUrl}
            duration={item.duration}
            width={180}
            onPress={() => handleItemPress(item)}
          />
        )}
      />

      {/* ── Popular ── */}
      <SectionHeader title="Popular" />
      <FlatList
        data={[...sermons].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4)}
        keyExtractor={(item) => `pop-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
        renderItem={({ item }) => (
          <ContentCard
            title={item.title}
            subtitle={item.scripture}
            thumbnailUrl={item.thumbnailUrl}
            duration={item.duration}
            width={180}
            onPress={() => handleItemPress(item)}
          />
        )}
      />

      {/* ── Prayer CTA ── */}
      <TouchableOpacity
        style={styles.ctaCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PrayerRequest')}
      >
        <View style={styles.ctaLeft}>
          <View style={styles.ctaIcon}>
            <Ionicons name="hand-left-outline" size={22} color={Colors.accent} />
          </View>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Need Prayer?</Text>
            <Text style={styles.ctaSubtitle}>Let us stand with you in faith.</Text>
          </View>
        </View>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Request</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h3,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  carousel: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(2,143,214,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    fontSize: 15,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
