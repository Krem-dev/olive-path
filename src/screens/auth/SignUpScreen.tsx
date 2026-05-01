import React, { useState, useCallback } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import AuthInput from '../../components/common/AuthInput';
import { ApiError } from '../../api/client';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SignUpNavProp>();
  const signup = useAuthStore((s) => s.signup);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = useCallback(
    (field: string, value: string, allValues?: Record<string, string>) => {
      const pw = allValues?.password ?? password;
      switch (field) {
        case 'name':
          if (!value.trim()) return 'Name is required';
          if (value.trim().length < 2) return 'At least 2 characters';
          return '';
        case 'email':
          if (!value.trim()) return 'Email is required';
          if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email';
          return '';
        case 'password':
          if (!value) return 'Password is required';
          if (value.length < 6) return 'Minimum 6 characters';
          return '';
        case 'confirmPassword':
          if (!value) return 'Please confirm your password';
          if (value !== pw) return 'Passwords do not match';
          return '';
        default:
          return '';
      }
    },
    [password],
  );

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    if (touched[field]) {
      const error = validateField(field, value, {
        password: field === 'password' ? value : password,
        confirmPassword:
          field === 'confirmPassword' ? value : confirmPassword,
      });
      setErrors((prev) => ({ ...prev, [field]: error }));
      if (field === 'password' && touched.confirmPassword && confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            confirmPassword !== value ? 'Passwords do not match' : '',
        }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = { name, email, password, confirmPassword }[field] || '';
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSignUp = async () => {
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors: Record<string, string> = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== '')) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await signup(name, email, password);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : 'Could not create account. Try again.';
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
          <Text style={styles.title}>Create account</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          <AuthInput
            label="Full name"
            placeholder="Your name"
            value={name}
            onChangeText={(v) => handleChange('name', v)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            autoComplete="name"
            leftIcon="person-outline"
          />
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
          <AuthInput
            label="Confirm password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            isPassword
            leftIcon="lock-closed-outline"
          />

          {submitError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={14} color={Colors.error} />
              <Text style={styles.errorBannerText}>{submitError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            onPress={handleSignUp}
            activeOpacity={0.85}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Create Account</Text>
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
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
            hitSlop={6}
          >
            <Text style={styles.footerLink}>Sign In</Text>
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
