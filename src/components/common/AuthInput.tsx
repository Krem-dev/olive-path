/**
 * AuthInput — the app's form field, built on Fluent's real `Input`.
 *
 * Keeps the original API (label / error / isPassword / leftIcon) so screens
 * read the same, but the control itself is now Microsoft's Fluent Input:
 * Fluent's focus ring, error styling, assistive text and icon slots.
 *
 * Fluent takes icons as `{ svgSource: { src: Component } }`, so `leftIcon`
 * accepts one of our generated Fluent icon components rather than an
 * Ionicons name string.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Input, useFluentColors, FluentSpacing } from '../fluent';
import { Eye20Regular, EyeOff20Regular } from '../fluent/icons';

type FluentIcon = React.FC<any>;

interface AuthInputProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
  /** Adds the show/hide toggle and masks the text. */
  isPassword?: boolean;
  /** A Fluent icon component, e.g. `Mail24Regular`. */
  leftIcon?: FluentIcon;
  /** Helper copy under the field. Hidden while an error is showing. */
  assistiveText?: string;
  onBlur?: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  editable?: boolean;
  maxLength?: number;
  testID?: string;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  isPassword = false,
  leftIcon,
  assistiveText,
  onBlur,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  editable = true,
  maxLength,
  testID,
}: AuthInputProps) {
  const colors = useFluentColors();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper} testID={testID}>
      <Input
        label={label}
        value={value}
        onChange={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        // Fluent hides assistiveText when an error is present, so passing both is safe.
        assistiveText={error ? undefined : assistiveText}
        type={keyboardType}
        defaultIcon={leftIcon ? { svgSource: { src: leftIcon } } : undefined}
        // `accessoryIcon: null` suppresses Fluent's default clear (X) button.
        accessoryIcon={
          isPassword
            ? { svgSource: { src: showPassword ? EyeOff20Regular : Eye20Regular } }
            : null
        }
        accessoryButtonOnPress={isPassword ? () => setShowPassword((s) => !s) : undefined}
        accessoryIconAccessibilityLabel={
          isPassword ? (showPassword ? 'Hide password' : 'Show password') : undefined
        }
        accessoryIconColor={colors.neutralForeground3 as string}
        textInputProps={{
          secureTextEntry: isPassword && !showPassword,
          autoCapitalize: autoCapitalize ?? (isPassword ? 'none' : undefined),
          autoComplete,
          textContentType,
          editable,
          maxLength,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: FluentSpacing.l,
  },
});
