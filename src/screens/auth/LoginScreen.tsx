import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
} from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import AuthInput from '../../components/common/AuthInput';
import { ApiError } from '../../api/client';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<LoginNavProp>();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === 'email' ? email : password;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    const newErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await login(email, password);
      // Auth state flips → RootNavigator unmounts auth stack
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : 'Could not sign in. Try again.';
      setSubmitError(msg);
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
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          <AuthInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />
          <AuthInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(v) => handleChange('password', v)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            isPassword
            leftIcon="lock-closed-outline"
          />

          {/* Forgot password */}
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {submitError && (
            <View style={styles.errorBanner}>
              <Ionicons
                name="alert-circle"
                size={14}
                color={Colors.error}
              />
              <Text style={styles.errorBannerText}>{submitError}</Text>
            </View>
          )}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Sign In</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={Colors.textInverse}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Image
              source={{
                uri: 'https://developers.google.com/identity/images/g-logo.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.7}
            hitSlop={6}
          >
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
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

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: 'rgba(196, 69, 54, 0.3)',
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: Spacing.sm,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
    lineHeight: 18,
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
  },

  // ── Google ──
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
});
