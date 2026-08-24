/**
 * AuthTopBar — the back-button bar shared by the auth screens.
 *
 * Built on Fluent tokens and the Fluent chevron icon. Extracted because the
 * same bar appeared verbatim in Login, SignUp and ForgotPassword.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import { ChevronLeft24Regular } from '../fluent/icons';

interface AuthTopBarProps {
  /** Rendered at the trailing edge — e.g. the dev gallery shortcut. */
  trailing?: React.ReactNode;
}

export default function AuthTopBar({ trailing }: AuthTopBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colors = useFluentColors();

  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: pressed
              ? (colors.neutralBackground1Pressed as string)
              : (colors.neutralBackground1 as string),
            borderColor: colors.neutralStroke1 as string,
          },
        ]}
      >
        <ChevronLeft24Regular color={colors.neutralForeground1 as string} />
      </Pressable>

      {/* Absolutely positioned so it cannot shift the back button. `top` comes
          from the inset because absolute children anchor to the parent's
          border box and therefore ignore its paddingTop. */}
      {trailing ? (
        <View style={[styles.trailing, { top: insets.top + 8 }]}>{trailing}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.s,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: FluentCorner.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  trailing: {
    position: 'absolute',
    right: FluentSpacing.l,
  },
});
