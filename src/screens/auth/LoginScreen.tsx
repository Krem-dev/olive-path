/**
 * LoginScreen — migrated to Fluent UI.
 *
 * All chrome is Fluent: Button, Text, Divider and Input (via AuthInput), with
 * colours read from Fluent's alias tokens rather than the legacy palette.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  Text,
  Divider,
  useFluentColors,
  FluentSpacing,
} from '../../components/fluent';
import { Mail24Regular, LockClosed24Regular } from '../../components/fluent/icons';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import { Button as AppButton } from '../../components/ui';
import AuthInput from '../../components/common/AuthInput';
import AuthTopBar from '../../components/common/AuthTopBar';
import ErrorBanner from '../../components/common/ErrorBanner';
import { ApiError } from '../../api/client';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<LoginNavProp>();
  const login = useAuthStore((s) => s.login);
  const colors = useFluentColors();

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
      const msg = e instanceof ApiError ? e.message : 'Could not sign in. Try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AuthTopBar
        trailing={
          /* Dev-only shortcut to the Fluent UI gallery, so it can be reviewed
             without signing in. __DEV__ compiles it out of release builds.
             Remove once the Fluent review is done. */
          __DEV__ ? (
            <Button
              appearance="primary"
              size="small"
              onClick={() => navigation.navigate('FluentGallery')}
            >
              Fluent UI ›
            </Button>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="title1" style={styles.title}>
          Sign In
        </Text>

        <View style={styles.form}>
          <AuthInput
            label="Email"
            value={email}
            onChangeText={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            leftIcon={Mail24Regular}
          />
          <AuthInput
            label="Password"
            value={password}
            onChangeText={(v) => handleChange('password', v)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            placeholder="Enter your password"
            isPassword
            leftIcon={LockClosed24Regular}
          />

          <View style={styles.forgotRow}>
            <Button
              appearance="subtle"
              size="small"
              onClick={() => navigation.navigate('ForgotPassword')}
            >
              Forgot password?
            </Button>
          </View>

          <ErrorBanner message={submitError} />

          <AppButton
            label="Sign In"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting}
            onPress={handleLogin}
          />

          {/* Divider takes no `style` prop, so spacing goes on a wrapper. */}
          <View style={styles.divider}>
            <Divider alignContent="center">or</Divider>
          </View>

          <AppButton
            label="Continue with Google"
            variant="outlined"
            size="lg"
            onPress={() => {}}
            leading={
              <Image
                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                style={styles.googleIcon}
              />
            }
          />
        </View>

        <View style={styles.footer}>
          <Text variant="body2" color={colors.neutralForeground2 as string}>
            Don&apos;t have an account?
          </Text>
          <Button appearance="subtle" size="small" onClick={() => navigation.navigate('SignUp')}>
            Sign Up
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -FluentSpacing.s,
  },
  divider: {
    marginVertical: FluentSpacing.m,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FluentSpacing.xs,
    marginTop: FluentSpacing.xxl,
  },
});
