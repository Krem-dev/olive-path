import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Text, useFluentColors, FluentSpacing } from '../components/fluent';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const colors = useFluentColors();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const wordOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) }),
    );
    logoScale.value = withDelay(
      200,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.1)) }),
    );
    wordOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );

    const timer = setTimeout(() => onFinish(), 2400);
    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const wordAnimatedStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.neutralBackground1 as string }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, logoAnimatedStyle]}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View style={[styles.wordWrap, wordAnimatedStyle]}>
          <View style={styles.dividerRow}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.brandForeground1 as string }]}
            />
            <Text
              variant="caption1Strong"
              color={colors.brandForeground1 as string}
              style={styles.tagline}
            >
              EBRONI GLOBAL MEDIA
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.brandForeground1 as string }]}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: FluentSpacing.xl,
  },
  logo: {
    width: 180,
    height: 180,
  },
  wordWrap: {
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.m,
  },
  dividerLine: {
    width: 28,
    height: 1,
    opacity: 0.55,
  },
  tagline: {
    letterSpacing: 1.8,
  },
});
