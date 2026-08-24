/**
 * SuccessState — full-screen confirmation, migrated to Fluent.
 * `icon` is a Fluent icon component; colours come from Fluent tokens.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import { CheckmarkCircle48Filled } from '../fluent/icons';
import Button from './Button';

type FluentIcon = React.FC<any>;

interface SuccessStateProps {
  /** A Fluent icon component. Defaults to a filled checkmark. */
  icon?: FluentIcon;
  title: string;
  message: string;
  buttonLabel?: string;
  onPress: () => void;
}

export default function SuccessState({
  icon: Icon = CheckmarkCircle48Filled,
  title,
  message,
  buttonLabel = 'Done',
  onPress,
}: SuccessStateProps) {
  const colors = useFluentColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.successBackground1 as string }]}>
        <Icon color={colors.successForeground1 as string} />
      </View>

      <Text variant="title1" style={styles.center}>
        {title}
      </Text>
      <Text
        variant="body1"
        color={colors.neutralForeground2 as string}
        style={[styles.center, styles.message]}
      >
        {message}
      </Text>

      <Button label={buttonLabel} onPress={onPress} size="md" fullWidth={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: FluentSpacing.xxl,
    gap: FluentSpacing.s,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FluentSpacing.l,
  },
  center: {
    textAlign: 'center',
  },
  message: {
    marginBottom: FluentSpacing.l,
  },
});
