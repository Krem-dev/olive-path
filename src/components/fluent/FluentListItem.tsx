/**
 * FluentListItem — Fluent 2 list row, built for React Native.
 *
 * Microsoft ships no list package for RN. This is the row primitive for
 * sermon lists, Q&A lists, playlists and downloads: leading media, a
 * title/subtitle stack, and a trailing accessory.
 *
 * Designed to be the `renderItem` of a FlatList, so it stays cheap: no
 * internal state, and `React.memo` on the way out.
 */

import React from 'react';
import { View, Pressable, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from '@fluentui/react-native';
import { ChevronRight20Regular } from './icons';
import { useFluentColors, FluentCorner, FluentSpacing } from '../../theme/fluent';

export interface FluentListItemProps {
  title: string;
  subtitle?: string;
  /** Third line — e.g. duration, scripture reference, publish date. */
  caption?: string;
  /** Thumbnail URI. Takes precedence over `leading`. */
  imageUri?: string;
  /** Custom leading element (an icon, avatar, or index number). */
  leading?: React.ReactNode;
  /** Custom trailing element. Ignored when `showChevron` is true. */
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  /** Adds a hairline separator below the row. */
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const THUMB_SIZE = 48;

function FluentListItem({
  title,
  subtitle,
  caption,
  imageUri,
  leading,
  trailing,
  showChevron = false,
  onPress,
  onLongPress,
  disabled = false,
  selected = false,
  divider = false,
  style,
  testID,
}: FluentListItemProps) {
  const colors = useFluentColors();

  const background = (pressed: boolean): string => {
    if (disabled) return colors.neutralBackgroundDisabled as string;
    if (pressed) return colors.neutralBackground1Pressed as string;
    if (selected) return colors.neutralBackground1Selected as string;
    return colors.neutralBackground1 as string;
  };

  const content = (pressed: boolean) => (
    <View
      style={[
        styles.row,
        { backgroundColor: background(pressed) },
        divider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.neutralStroke2 as string,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.thumb, { backgroundColor: colors.neutralBackground3 as string }]}
          resizeMode="cover"
        />
      ) : (
        leading ?? null
      )}

      <View style={styles.textStack}>
        <Text variant="body1Strong" numberOfLines={1} color={colors.neutralForeground1 as string}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body2" numberOfLines={2} color={colors.neutralForeground2 as string}>
            {subtitle}
          </Text>
        ) : null}
        {caption ? (
          <Text variant="caption1" numberOfLines={1} color={colors.neutralForeground3 as string}>
            {caption}
          </Text>
        ) : null}
      </View>

      {showChevron ? (
        <ChevronRight20Regular color={colors.neutralForeground3 as string} />
      ) : (
        trailing ?? null
      )}
    </View>
  );

  if (!onPress && !onLongPress) {
    return <View testID={testID}>{content(false)}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={[title, subtitle, caption].filter(Boolean).join(', ')}
      accessibilityState={{ disabled, selected }}
      testID={testID}
    >
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.m,
    paddingHorizontal: FluentSpacing.l,
    paddingVertical: FluentSpacing.m,
    minHeight: 64,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: FluentCorner.medium,
  },
  textStack: {
    flex: 1,
    gap: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default React.memo(FluentListItem);
