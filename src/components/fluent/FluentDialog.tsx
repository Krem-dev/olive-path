/**
 * FluentDialog — Fluent 2 Dialog, built for React Native.
 *
 * Microsoft ships no `@fluentui-react-native/dialog` package. This implements
 * the Fluent 2 Dialog spec on RN's `Modal`, using real Fluent `Button` and
 * `Text` for its contents so the chrome is genuinely Fluent, not a lookalike.
 *
 * Note: Fluent's Button takes `onClick`, not `onPress`.
 */

import React from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  ViewStyle,
} from 'react-native';
import { ButtonV1 as Button, Text } from '@fluentui/react-native';
import { useFluentColors, FluentCorner, FluentSpacing } from '../../theme/fluent';

export interface FluentDialogAction {
  label: string;
  onPress: () => void;
  /** `primary` renders the filled brand button. Default `subtle`. */
  appearance?: 'primary' | 'subtle' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export interface FluentDialogProps {
  visible: boolean;
  title: string;
  /** Body copy. Omit when passing `children` instead. */
  message?: string;
  children?: React.ReactNode;
  /** Rendered right-aligned in the footer, in order. */
  actions?: FluentDialogAction[];
  /** Fires on scrim tap and Android hardware back. Omit to force an action. */
  onDismiss?: () => void;
  /** `alert` blocks scrim-dismiss, matching Fluent's alert dialog. */
  type?: 'modal' | 'alert';
  testID?: string;
}

/** Fluent 2 `shadow64` — the elevation a dialog surface sits at. */
const SHADOW_64 = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.24,
    shadowRadius: 64,
  },
  android: { elevation: 24 },
  default: {},
})!;

export default function FluentDialog({
  visible,
  title,
  message,
  children,
  actions = [],
  onDismiss,
  type = 'modal',
  testID,
}: FluentDialogProps) {
  const colors = useFluentColors();
  const { width, height } = useWindowDimensions();

  const dismissable = type !== 'alert' && !!onDismiss;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
      testID={testID}
    >
      <Pressable
        style={[styles.scrim, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
        onPress={dismissable ? onDismiss : undefined}
        accessible={false}
      >
        {/* Inner Pressable swallows taps so they don't reach the scrim. */}
        <Pressable
          accessibilityViewIsModal
          accessibilityRole="alert"
          onPress={() => {}}
          style={[
            styles.surface,
            SHADOW_64,
            {
              backgroundColor: colors.neutralBackground1 as string,
              maxWidth: Math.min(width - FluentSpacing.xxl * 2, 480),
              maxHeight: height * 0.8,
            },
          ]}
        >
          <Text variant="subtitle1" style={styles.title}>
            {title}
          </Text>

          {message || children ? (
            <ScrollView
              style={styles.bodyScroll}
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {message ? (
                <Text variant="body1" color={colors.neutralForeground2 as string}>
                  {message}
                </Text>
              ) : null}
              {children}
            </ScrollView>
          ) : null}

          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((a) => (
                <Button
                  key={a.label}
                  appearance={a.appearance ?? 'subtle'}
                  size="medium"
                  loading={a.loading}
                  disabled={a.disabled}
                  onClick={a.onPress}
                >
                  {a.label}
                </Button>
              ))}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: FluentSpacing.xxl,
  },
  surface: {
    width: '100%',
    borderRadius: FluentCorner.xxLarge,
    padding: FluentSpacing.xxl,
    gap: FluentSpacing.m,
  },
  title: {
    marginBottom: FluentSpacing.xxs,
  },
  bodyScroll: {
    flexGrow: 0,
  },
  body: {
    gap: FluentSpacing.s,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: FluentSpacing.s,
    marginTop: FluentSpacing.s,
  },
});
