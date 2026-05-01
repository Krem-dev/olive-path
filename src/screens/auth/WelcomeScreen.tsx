import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';

const { width } = Dimensions.get('window');

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Slide {
  id: string;
  icon: IoniconName;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'leaf',
    eyebrow: 'WELCOME',
    title: 'A path of faith',
    subtitle:
      'Teachings, sermons, and biblical resources from Rev. Ing. Eric Ofori Broni — gathered in one place.',
  },
  {
    id: '2',
    icon: 'headset-outline',
    eyebrow: 'LISTEN & WATCH',
    title: 'Wherever you are',
    subtitle:
      'Stream audio and video teachings, or download them to enjoy offline — on your schedule.',
  },
  {
    id: '3',
    icon: 'book-outline',
    eyebrow: 'GROW DAILY',
    title: 'Rooted in Scripture',
    subtitle:
      'Weekly devotions, biblical Q&A, and motivational messages to encourage you in every season.',
  },
];

type WelcomeNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<WelcomeNavProp>();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconWrap}>
        <View style={styles.iconRing}>
          <Ionicons name={item.icon} size={36} color={Colors.accent} />
        </View>
      </View>
      <Text style={styles.eyebrow}>{item.eyebrow}</Text>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* ── Top bar — logo + skip ── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Olive Path</Text>
        </View>
        {!isLastSlide && (
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            hitSlop={10}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Slides ── */}
      <View style={styles.slidesWrap}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />
      </View>

      {/* ── Dots ── */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* ── Buttons ── */}
      <View style={styles.bottomSection}>
        {isLastSlide ? (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.textInverse}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.textInverse}
              />
            </TouchableOpacity>
            <View style={styles.secondaryPlaceholder} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandLogo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },

  // ── Slides ──
  slidesWrap: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  iconWrap: {
    marginBottom: Spacing['2xl'],
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(184, 137, 62, 0.25)',
    ...Shadows.sm,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.6,
    marginBottom: Spacing.md,
  },
  slideTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: Spacing.base,
  },
  slideSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: Spacing.sm,
  },

  // ── Dots ──
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.accent,
  },
  dotInactive: {
    width: 7,
    backgroundColor: Colors.border,
  },

  // ── Bottom buttons ──
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  secondaryPlaceholder: {
    height: 14 * 2 + 18, // matches secondaryButton height to keep layout stable across slides
  },
});
