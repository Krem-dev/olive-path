import React, { useEffect } from 'react';
import {
  View,
  Text,
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
import { Colors, Spacing } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
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
    <View style={styles.container}>
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
            <View style={styles.dividerLine} />
            <Text style={styles.tagline}>EBRONI GLOBAL MEDIA</Text>
            <View style={styles.dividerLine} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: Spacing.xl,
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
    gap: Spacing.md,
  },
  dividerLine: {
    width: 28,
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.55,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.8,
  },
});
