import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  thumbnailUrl: string;
  duration?: string;
  tag?: string;
  onPress?: () => void;
  width?: number;
}

export default function ContentCard({
  title,
  subtitle,
  thumbnailUrl,
  duration,
  tag,
  onPress,
  width = 200,
}: ContentCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        {duration && (
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={11} color="#FFFFFF" />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
        {tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: Spacing.md,
  },
  thumbnailContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tagBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  info: {
    paddingTop: Spacing.sm,
  },
  title: {
    ...Typography.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
});
