/**
 * EmptyState — placeholder for empty lists.
 * `icon` is now a Fluent icon component rather than an Ionicons name.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import Button from './Button';

type FluentIcon = React.FC<any>;

interface EmptyStateProps {
  /** A Fluent icon component, e.g. `Library24Regular`. */
  icon: FluentIcon;
  title: string;
  hint?: string;
  buttonLabel?: string;
  onPress?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  hint,
  buttonLabel,
  onPress,
}: EmptyStateProps) {
  const colors = useFluentColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.neutralBackground4 as string }]}>
        <Icon color={colors.neutralForeground3 as string} />
      </View>

      <Text variant="body1Strong" color={colors.neutralForeground2 as string}>
        {title}
      </Text>

      {hint ? (
        <Text
          variant="body2"
          color={colors.neutralForeground3 as string}
          style={styles.hint}
        >
          {hint}
        </Text>
      ) : null}

      {buttonLabel && onPress ? (
        <Button
          label={buttonLabel}
          onPress={onPress}
          variant="outlined"
          size="sm"
          fullWidth={false}
          style={styles.btn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: FluentSpacing.xxxl,
    paddingHorizontal: FluentSpacing.xxl,
    gap: FluentSpacing.xs,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FluentSpacing.l,
  },
  hint: {
    textAlign: 'center',
  },
  btn: {
    marginTop: FluentSpacing.s,
  },
});
