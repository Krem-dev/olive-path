/**
 * FluentSlider — Fluent 2 Slider, built for React Native.
 *
 * Microsoft ships no `@fluentui-react-native/slider` package, so this wraps
 * `@react-native-community/slider` (which gives us the native, accessible
 * track-and-thumb behaviour) and dresses it in Fluent's alias tokens.
 *
 * Built with the sermon audio scrubber in mind: pass `showTimeLabels` to get
 * the elapsed/remaining row underneath.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text } from '@fluentui/react-native';
import { useFluentColors, FluentSpacing } from '../../theme/fluent';

export interface FluentSliderProps {
  value: number;
  onValueChange?: (value: number) => void;
  /** Fires once the user lifts their finger — use this to seek, not onValueChange. */
  onSlidingComplete?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
  label?: string;
  /** Renders `elapsed / remaining` beneath the track, formatted as m:ss. */
  showTimeLabels?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Formats seconds as m:ss (or h:mm:ss past an hour). */
export function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default function FluentSlider({
  value,
  onValueChange,
  onSlidingComplete,
  minimumValue = 0,
  maximumValue = 1,
  step = 0,
  disabled = false,
  size = 'medium',
  label,
  showTimeLabels = false,
  style,
  testID,
}: FluentSliderProps) {
  const colors = useFluentColors();

  // While dragging, show the finger position rather than the prop value —
  // otherwise the thumb fights the playback position streaming in from the player.
  const [dragValue, setDragValue] = useState<number | null>(null);
  const shown = dragValue ?? value;

  const handleChange = useCallback(
    (v: number) => {
      setDragValue(v);
      onValueChange?.(v);
    },
    [onValueChange],
  );

  const handleComplete = useCallback(
    (v: number) => {
      setDragValue(null);
      onSlidingComplete?.(v);
    },
    [onSlidingComplete],
  );

  const trackColors = useMemo(
    () => ({
      min: disabled
        ? (colors.brandBackgroundDisabled as string)
        : (colors.brandBackground as string),
      max: disabled
        ? (colors.neutralStrokeDisabled as string)
        : (colors.neutralStrokeAccessible as string),
      thumb: disabled
        ? (colors.neutralForegroundDisabled as string)
        : (colors.brandBackground as string),
    }),
    [colors, disabled],
  );

  return (
    <View style={[styles.root, style]} testID={testID}>
      {label ? (
        <Text variant="body2" color={colors.neutralForeground2 as string}>
          {label}
        </Text>
      ) : null}

      <Slider
        value={shown}
        onValueChange={handleChange}
        onSlidingComplete={handleComplete}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={trackColors.min}
        maximumTrackTintColor={trackColors.max}
        thumbTintColor={trackColors.thumb}
        tapToSeek
        style={size === 'small' ? styles.trackSmall : styles.trackMedium}
        accessibilityLabel={label}
      />

      {showTimeLabels ? (
        <View style={styles.timeRow}>
          <Text variant="caption1" color={colors.neutralForeground2 as string}>
            {formatTime(shown)}
          </Text>
          <Text variant="caption1" color={colors.neutralForeground2 as string}>
            {`-${formatTime(Math.max(0, maximumValue - shown))}`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: FluentSpacing.xxs,
  },
  trackMedium: {
    width: '100%',
    height: 32,
  },
  trackSmall: {
    width: '100%',
    height: 24,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -FluentSpacing.xs,
  },
});
