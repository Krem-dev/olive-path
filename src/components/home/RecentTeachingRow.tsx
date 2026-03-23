import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { Sermon } from '../../types/content';

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  video: 'videocam',
  audio: 'headset',
  reading: 'book',
};

interface RecentTeachingRowProps {
  sermon: Sermon;
  onPress?: () => void;
}

export default function RecentTeachingRow({ sermon, onPress }: RecentTeachingRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: sermon.thumbnailUrl }} style={styles.thumbnail} />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {sermon.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name={TYPE_ICON[sermon.contentType] || 'document-outline'}
            size={12}
            color={Colors.textSecondary}
          />
          <Text style={styles.meta}>
            {sermon.scripture} · {sermon.duration}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  thumbnailContainer: {
    width: 72,
    height: 48,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
  },
});
