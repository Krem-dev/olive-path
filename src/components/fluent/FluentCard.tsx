/**
 * FluentCard — Fluent 2 Card, built for React Native.
 *
 * Microsoft ships no `@fluentui-react-native/card` package, so this implements
 * the Fluent 2 Card spec directly against Fluent's own alias tokens. It reads
 * its colors from the same theme every real Fluent component uses, so it stays
 * visually consistent with Button, Input, Menu et al. — including when the
 * brand ramp changes.
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { useFluentColors, FluentCorner, FluentSpacing } from '../../theme/fluent';

export type FluentCardAppearance = 'filled' | 'filled-alternative' | 'outline' | 'subtle';
export type FluentCardSize = 'small' | 'medium' | 'large';

export interface FluentCardProps {
  children: React.ReactNode;
  /** Fluent 2 card appearances. Default `filled` — white surface + shadow. */
  appearance?: FluentCardAppearance;
  /** Controls padding, gap and corner radius. Default `medium`. */
  size?: FluentCardSize;
  /** Makes the card pressable, with Fluent's pressed-state background. */
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  /** Lays children out in a row instead of a column. */
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
}

const PADDING: Record<FluentCardSize, number> = {
  small: FluentSpacing.s, // 8
  medium: FluentSpacing.m, // 12
  large: FluentSpacing.l, // 16
};

const GAP: Record<FluentCardSize, number> = {
  small: FluentSpacing.xs, // 4
  medium: FluentSpacing.s, // 8
  large: FluentSpacing.m, // 12
};

const RADIUS: Record<FluentCardSize, number> = {
  small: FluentCorner.medium, // 4
  medium: FluentCorner.xLarge, // 8
  large: FluentCorner.xLarge, // 8
};

/** Fluent 2 `shadow4` — the elevation a resting filled card sits at. */
const SHADOW_4 = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
  },
  android: { elevation: 4 },
  default: {},
})!;

export default function FluentCard({
  children,
  appearance = 'filled',
  size = 'medium',
  onPress,
  onLongPress,
  disabled = false,
  horizontal = false,
  style,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: FluentCardProps) {
  const colors = useFluentColors();

  const base: ViewStyle = {
    padding: PADDING[size],
    gap: GAP[size],
    borderRadius: RADIUS[size],
    flexDirection: horizontal ? 'row' : 'column',
    alignItems: horizontal ? 'center' : undefined,
  };

  const byAppearance = (pressed: boolean): ViewStyle => {
    switch (appearance) {
      case 'filled':
        return {
          backgroundColor: pressed
            ? (colors.neutralBackground1Pressed as string)
            : (colors.neutralBackground1 as string),
          ...SHADOW_4,
        };
      case 'filled-alternative':
        return {
          backgroundColor: pressed
            ? (colors.neutralBackground2Pressed as string)
            : (colors.neutralBackground2 as string),
        };
      case 'outline':
        return {
          backgroundColor: pressed
            ? (colors.neutralBackground1Pressed as string)
            : (colors.neutralBackground1 as string),
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: pressed
            ? (colors.neutralStroke1Pressed as string)
            : (colors.neutralStroke1 as string),
        };
      case 'subtle':
        return {
          backgroundColor: pressed
            ? (colors.subtleBackgroundPressed as string)
            : (colors.subtleBackground as string),
        };
    }
  };

  const disabledStyle: ViewStyle = disabled
    ? { backgroundColor: colors.neutralBackgroundDisabled as string, opacity: 0.6 }
    : {};

  if (!onPress && !onLongPress) {
    return (
      <View
        style={[base, byAppearance(false), disabledStyle, style]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        testID={testID}
      >
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      style={({ pressed }) => [base, byAppearance(pressed), disabledStyle, style]}
    >
      {children}
    </Pressable>
  );
}
