import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
} from '../../components/fluent';
import {
  LeafTwo48Regular,
  Headphones48Regular,
  BookOpen48Regular,
  ArrowRight24Regular,
} from '../../components/fluent/icons';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';

const { width } = Dimensions.get('window');

type FluentIcon = React.FC<any>;

interface Slide {
  id: string;
  icon: FluentIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: LeafTwo48Regular,
    eyebrow: 'WELCOME',
    title: 'A path of faith',
    subtitle:
      'Teachings, sermons, and biblical resources from Rev. Ing. Eric Ofori Broni — gathered in one place.',
  },
  {
    id: '2',
    icon: Headphones48Regular,
    eyebrow: 'LISTEN & WATCH',
    title: 'Wherever you are',
    subtitle:
      'Stream audio and video teachings, or download them to enjoy offline — on your schedule.',
  },
  {
    id: '3',
    icon: BookOpen48Regular,
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
  const colors = useFluentColors();

  const renderSlide = ({ item }: { item: Slide }) => {
    const SlideIcon = item.icon;
    return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconWrap}>
        <View style={[styles.iconRing, { backgroundColor: colors.brandBackground2 as string }]}>
          <SlideIcon color={colors.brandForeground1 as string} />
        </View>
      </View>
      <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.eyebrow}>
        {item.eyebrow}
      </Text>
      <Text variant="title1" style={styles.center}>
        {item.title}
      </Text>
      <Text
        variant="body1"
        color={colors.neutralForeground2 as string}
        style={styles.center}
      >
        {item.subtitle}
      </Text>
    </View>
    );
  };

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
          <Text variant="body1Strong">Olive Path</Text>
        </View>
        {!isLastSlide && (
          <Button appearance="subtle" size="small" onClick={handleSkip}>
            Skip
          </Button>
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
              {
                backgroundColor:
                  index === activeIndex
                    ? (colors.brandBackground as string)
                    : (colors.neutralStroke2 as string),
              },
            ]}
          />
        ))}
      </View>

      {/* ── Buttons ── */}
      <View style={styles.bottomSection}>
        {isLastSlide ? (
          <>
            <Button
              appearance="primary"
              size="large"
              onClick={() => navigation.navigate('SignUp')}
              icon={{ svgSource: { src: ArrowRight24Regular } }}
              iconPosition="after"
              width="100%"
            >
              Get Started
            </Button>
            <Button
              appearance="subtle"
              size="medium"
              onClick={() => navigation.navigate('Login')}
              width="100%"
            >
              I already have an account
            </Button>
          </>
        ) : (
          <>
            <Button
              appearance="primary"
              size="large"
              onClick={handleNext}
              icon={{ svgSource: { src: ArrowRight24Regular } }}
              iconPosition="after"
              width="100%"
            >
              Continue
            </Button>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.m,
    paddingBottom: FluentSpacing.s,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
  },
  brandLogo: {
    width: 28,
    height: 28,
  },
  slidesWrap: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: FluentSpacing.xxl,
    gap: FluentSpacing.s,
  },
  iconWrap: {
    marginBottom: FluentSpacing.l,
  },
  iconRing: {
    width: 112,
    height: 112,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: {
    letterSpacing: 1.2,
  },
  center: {
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: FluentSpacing.xs,
    paddingVertical: FluentSpacing.l,
  },
  dot: {
    height: 8,
    borderRadius: FluentCorner.circular,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 8,
  },
  bottomSection: {
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.l,
    gap: FluentSpacing.s,
  },
  secondaryPlaceholder: {
    height: 40,
  },
});
