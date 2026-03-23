import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  error,
  isPassword,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error ? styles.inputError : undefined,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor="#A0AEC0"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize={isPassword ? 'none' : undefined}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#A0AEC0"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  inputFocused: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
