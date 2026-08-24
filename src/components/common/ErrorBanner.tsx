/**
 * ErrorBanner — inline form-level error, styled with Fluent's danger tokens.
 *
 * Used for submit failures (bad credentials, network errors) that belong to
 * the form as a whole rather than to a single field — field-level errors go
 * through Fluent Input's own `error` prop via AuthInput.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import { ErrorCircle24Regular } from '../fluent/icons';

interface ErrorBannerProps {
  message?: string | null;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  const colors = useFluentColors();

  if (!message) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: colors.dangerBackground1 as string,
          borderColor: colors.dangerStroke1 as string,
        },
      ]}
    >
      <ErrorCircle24Regular color={colors.dangerForeground1 as string} />
      <Text variant="body2" color={colors.dangerForeground1 as string} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
    padding: FluentSpacing.m,
    borderRadius: FluentCorner.medium,
    borderWidth: 1,
  },
  text: {
    flex: 1,
  },
});
