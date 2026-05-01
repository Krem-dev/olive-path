import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  light?: boolean;
}

export default function SectionHeader({ title, onSeeAll, light }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, light && styles.titleLight]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity
          onPress={onSeeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAll}>See All</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h4,
  },
  titleLight: {
    color: '#FFFFFF',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAll: {
    ...Typography.bodyMedium,
    fontSize: 13,
    color: Colors.accent,
  },
});
