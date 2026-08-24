/**
 * SectionTitle — section heading with an optional trailing action.
 * Migrated to Fluent Text, Fluent icons and Fluent tokens.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, useFluentColors, FluentSpacing } from '../fluent';
import { ChevronRight20Regular } from '../fluent/icons';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionTitle({
  eyebrow,
  title,
  actionLabel,
  onAction,
}: SectionTitleProps) {
  const colors = useFluentColors();

  return (
    <View style={styles.container}>
      <View>
        {eyebrow ? (
          <Text
            variant="caption1Strong"
            color={colors.brandForeground1 as string}
            style={styles.eyebrow}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="subtitle1">{title}</Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text variant="body2" color={colors.brandForeground1 as string}>
            {actionLabel}
          </Text>
          <ChevronRight20Regular color={colors.brandForeground1 as string} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: FluentSpacing.l,
    marginBottom: FluentSpacing.m,
  },
  eyebrow: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
