/**
 * Card — thin alias over FluentCard.
 *
 * Kept so existing screens can keep importing `Card` from components/ui,
 * while the rendered surface is the Fluent 2 card built on Fluent tokens.
 */

import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { FluentCard, FluentSpacing } from '../fluent';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  onPress?: () => void;
}

export default function Card({ children, style, padded = true, onPress }: CardProps) {
  return (
    <FluentCard
      appearance="filled"
      size="large"
      onPress={onPress}
      style={[!padded && { padding: FluentSpacing.none }, style]}
    >
      {children}
    </FluentCard>
  );
}
