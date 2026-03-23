import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../../constants';
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
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },
  scripture: {
    fontFamily: 'serif',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  ref: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: Spacing.sm,
  },
  encouragement: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.7)',
  },
});
