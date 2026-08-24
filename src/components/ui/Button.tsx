/**
 * Button — the app's button, built on Fluent's real `Button` (ButtonV1).
 *
 * Keeps the original call signature (`label` / `onPress` / `variant` / `size`)
 * so screens read the same, while the rendered control is Microsoft's Fluent.
 *
 * The app's six variants map onto Fluent's appearances. Fluent has no "danger"
 * appearance, so that one is recoloured with the theme's danger tokens.
 *
 * NOTE: Fluent's Button takes `onClick`; this wrapper keeps `onPress` and
 * bridges it, so existing call sites are unaffected.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import { Pressable } from 'react-native';
import {
  Button as FluentButton,
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
} from '../fluent';

type Variant = 'primary' | 'accent' | 'warm' | 'outlined' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type FluentIcon = React.FC<any>;

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  /** A Fluent icon component, e.g. `Play24Filled`. Rendered before the label. */
  icon?: FluentIcon;
  /** Same, but rendered after the label. Ignored if `icon` is also set. */
  iconRight?: FluentIcon;
  /**
   * Arbitrary node rendered before the label, for cases an icon component
   * cannot cover — e.g. the Google logo, which must be the official raster
   * mark rather than a Fluent glyph.
   */
  leading?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const APPEARANCE: Record<Variant, 'primary' | 'subtle' | 'outline'> = {
  primary: 'primary',
  accent: 'primary',
  warm: 'primary',
  outlined: 'outline',
  ghost: 'subtle',
  danger: 'primary',
};

/** Matches Fluent's own button heights, for the hand-drawn danger variant. */
const HEIGHT: Record<Size, { height: number }> = {
  sm: { height: 28 },
  md: { height: 36 },
  lg: { height: 44 },
};

const SIZE: Record<Size, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  leading,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  testID,
}: ButtonProps) {


  // Fluent's Android Button wraps itself in a ripple container whose style is
  // hardcoded to `alignSelf: 'baseline'`, so it always shrinks to its content.
  // Neither the `width` token nor `style` can escape it — they land on the
  // inner root, inside that content-sized wrapper. Measuring the surrounding
  // View and passing a concrete pixel width is the only way to stretch it.
  const Icon = icon ?? iconRight;
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>();
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setMeasuredWidth(e.nativeEvent.layout.width);
  }, []);

  const colors = useFluentColors();

  // The `danger` variant is the one case this wrapper does NOT delegate to
  // Fluent's Button. Fluent has no danger appearance and offers no working way
  // to recolour one on Android:
  //   • token props (backgroundColor, …) are ignored when passed as props
  //   • `style` loses to the styled slot
  //   • `customize()` renders the uncompressed slot tree, which mounts
  //     `FocusZone` — a native view manager that exists only on macOS/Windows,
  //     so it crashes with "Can't find ViewManager 'FocusZone'"
  // So it is drawn here from Fluent's own danger tokens, matching Fluent's
  // button geometry and type ramp.
  if (variant === 'danger') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
        style={({ pressed }) => [
          styles.dangerBtn,
          HEIGHT[size],
          fullWidth ? styles.fullWidth : styles.auto,
          {
            backgroundColor: pressed
              ? (colors.dangerForeground1 as string)
              : (colors.dangerBackground2 as string),
            opacity: disabled || loading ? 0.5 : 1,
          },
          style,
        ]}
      >
        {Icon ? <Icon color={colors.neutralForegroundOnColor as string} /> : null}
        <Text variant="body1Strong" color={colors.neutralForegroundOnColor as string}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <View onLayout={fullWidth ? onLayout : undefined} style={[fullWidth ? styles.fullWidth : styles.auto, style]}>
    <FluentButton
      appearance={APPEARANCE[variant]}
      size={SIZE[size]}
      loading={loading}
      disabled={disabled}
      onClick={onPress}
      icon={
        icon
          ? { svgSource: { src: icon } }
          : iconRight
            ? { svgSource: { src: iconRight } }
            : undefined
      }
      iconPosition={!icon && iconRight ? 'after' : 'before'}
      width={fullWidth ? measuredWidth : undefined}
      testID={testID}
    >
      {leading ? (
        <View style={styles.leadingRow}>
          {leading}
          <Text variant="body1Strong">{label}</Text>
        </View>
      ) : (
        label
      )}
    </FluentButton>
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
  },
  auto: {
    alignSelf: 'flex-start',
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: FluentSpacing.s,
    paddingHorizontal: FluentSpacing.l,
    borderRadius: FluentCorner.medium,
  },
  leadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
  },
});
