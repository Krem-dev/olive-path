/**
 * TextArea — labelled multiline field.
 *
 * Fluent's Input is single-line and owns its own layout, so long-form entry is
 * drawn here from Fluent tokens to match it. Shared by the prayer and booking
 * screens.
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';

interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  /** Shows a live `n / max` counter under the field. Requires `maxLength`. */
  showCount?: boolean;
  minHeight?: number;
}

export default function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  showCount = false,
  minHeight = 120,
}: TextAreaProps) {
  const colors = useFluentColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text variant="body2" color={colors.neutralForeground2 as string} style={styles.label}>
        {label}
      </Text>

      <View
        style={[
          styles.wrap,
          {
            backgroundColor: colors.neutralBackground1 as string,
            borderBottomColor: focused
              ? (colors.brandStroke1 as string)
              : (colors.neutralStroke1 as string),
          },
        ]}
      >
        <TextInput
          style={[styles.input, { minHeight, color: colors.neutralForeground1 as string }]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutralForeground3 as string}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
          accessibilityLabel={label}
        />
      </View>

      {showCount && maxLength ? (
        <Text
          variant="caption1"
          color={colors.neutralForeground3 as string}
          style={styles.count}
        >
          {`${value.length} / ${maxLength}`}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: FluentSpacing.l },
  label: { marginBottom: FluentSpacing.s },
  // Matches Fluent Input: filled surface, bottom stroke only.
  wrap: {
    paddingHorizontal: FluentSpacing.l,
    paddingVertical: FluentSpacing.m,
    borderBottomWidth: 1,
  },
  input: { fontSize: 15, lineHeight: 22 },
  count: { textAlign: 'right', marginTop: FluentSpacing.xs },
});
