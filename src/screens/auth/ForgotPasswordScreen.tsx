import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import AuthInput from '../../components/common/AuthInput';
import { useAuthStore } from '../../store/authStore';
import { ApiError } from '../../api/client';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

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
      setError(
        e instanceof ApiError ? e.message : 'Could not send reset link. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sent ? (
          <View style={styles.sentContainer}>
            <View style={styles.sentIconWrap}>
              <Ionicons
                name="mail-open-outline"
                size={36}
                color={Colors.accent}
              />
            </View>
            <Text style={styles.sentTitle}>Check your email</Text>
            <Text style={styles.sentBody}>
              We sent a reset link to{' '}
              <Text style={styles.sentEmail}>{email}</Text>
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: Spacing.xl }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Reset password</Text>
            </View>

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
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                leftIcon="mail-outline"
              />

              <TouchableOpacity
                style={[styles.primaryButton, submitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.textInverse} />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send reset link</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={Colors.textInverse}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                hitSlop={6}
              >
                <Text style={styles.footerLink}>Back to Sign In</Text>
              </TouchableOpacity>
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
    backgroundColor: Colors.background,
  },

  // ── Top bar ──
  topBar: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // ── Container ──
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },

  // ── Header ──
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 38,
  },

  // ── Form ──
  form: {
    gap: 0,
  },

  // ── Buttons ──
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
  buttonDisabled: {
    opacity: 0.65,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },

  // ── Sent state ──
  sentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
  },
  sentIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(184, 137, 62, 0.25)',
  },
  sentTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  sentBody: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  sentEmail: {
    fontWeight: '700',
    color: Colors.accent,
  },
});
