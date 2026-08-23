/**
 * ForgotPasswordScreen — migrated to Fluent UI.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
} from '../../components/fluent';
import {
  ChevronLeft24Regular,
  MailRead48Regular,
  Mail24Regular,
  ArrowRight24Regular,
} from '../../components/fluent/icons';
import AuthInput from '../../components/common/AuthInput';
import { useAuthStore } from '../../store/authStore';
import { ApiError } from '../../api/client';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const colors = useFluentColors();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send reset link. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sent ? (
          <View style={styles.sentContainer}>
            <View
              style={[
                styles.sentIconWrap,
                { backgroundColor: colors.brandBackground2 as string },
              ]}
            >
              <MailRead48Regular color={colors.brandForeground1 as string} />
            </View>
            <Text variant="title1" style={styles.center}>
              Check your email
            </Text>
            <Text
              variant="body1"
              style={styles.center}
              color={colors.neutralForeground2 as string}
            >
              {`We sent a reset link to ${email}`}
            </Text>
            <Button
              appearance="primary"
              size="large"
              onClick={() => navigation.goBack()}
              width="100%"
            >
              Back to Sign In
            </Button>
          </View>
        ) : (
          <>
            <Text variant="title1" style={styles.title}>
              Reset password
            </Text>

            <View style={styles.form}>
              <AuthInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (error) setError('');
                }}
                error={error}
                assistiveText="We'll send a reset link to this address."
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                leftIcon={Mail24Regular}
              />

              <Button
                appearance="primary"
                size="large"
                loading={submitting}
                disabled={submitting}
                onClick={handleSubmit}
                icon={{ svgSource: { src: ArrowRight24Regular } }}
                iconPosition="after"
                width="100%"
              >
                Send reset link
              </Button>
            </View>

            <View style={styles.footer}>
              <Button appearance="subtle" size="small" onClick={() => navigation.goBack()}>
                Back to Sign In
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  container: {
    paddingHorizontal: FluentSpacing.l,
    flexGrow: 1,
  },
  title: {
    marginTop: FluentSpacing.l,
    marginBottom: FluentSpacing.xxl,
  },
  form: {
    gap: FluentSpacing.s,
  },
  center: {
    textAlign: 'center',
  },
  sentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: FluentSpacing.m,
    paddingHorizontal: FluentSpacing.l,
  },
  sentIconWrap: {
    width: 88,
    height: 88,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FluentSpacing.s,
  },
  footer: {
    alignItems: 'center',
    marginTop: FluentSpacing.xxl,
  },
});
