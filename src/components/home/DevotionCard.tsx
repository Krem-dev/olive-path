import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { Devotion } from '../../types/content';

interface DevotionCardProps {
  devotion: Devotion;
}

export default function DevotionCard({ devotion }: DevotionCardProps) {
  return (
    <LinearGradient
      colors={['#011838', '#0A3060']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Decorative icon */}
      <Ionicons
        name="book-outline"
        size={80}
        color="rgba(255,255,255,0.06)"
        style={styles.decorativeIcon}
      />
      <Text style={styles.label}>TODAY'S DEVOTION</Text>
      <Text style={styles.scripture}>"{devotion.scripture}"</Text>
      <Text style={styles.ref}>— {devotion.scriptureRef}</Text>
      <View style={styles.divider} />
      <Text style={styles.encouragement}>{devotion.encouragement}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  decorativeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5BB8E8',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  scripture: {
    fontFamily: 'serif',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  ref: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: Spacing.md,
  },
  encouragement: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
  },
});
