import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, useFluentColors, FluentSpacing } from '../../components/fluent';
import { Person24Regular, Mail24Regular, LockClosed24Regular } from '../../components/fluent/icons';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import { Button as AppButton } from '../../components/ui';
import AuthInput from '../../components/common/AuthInput';
import AuthTopBar from '../../components/common/AuthTopBar';
import ErrorBanner from '../../components/common/ErrorBanner';
import { ApiError } from '../../api/client';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SignUpNavProp>();
  const signup = useAuthStore((s) => s.signup);
  const colors = useFluentColors();

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
      const normalizedEmail = await signup(name, email, password);
      // OTP sent — navigate to verification screen with the exact email stored in DB
      navigation.navigate('OTP', { name, email: normalizedEmail, password });
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
      style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AuthTopBar />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="title1" style={styles.title}>
          Create account
        </Text>

        {/* ── Form ── */}
        <View style={styles.form}>
          <AuthInput
            label="Full name"
            value={name}
            onChangeText={(v) => handleChange('name', v)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            autoComplete="name"
            leftIcon={Person24Regular}
          />
          <AuthInput
            label="Email"
            value={email}
            onChangeText={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
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
            assistiveText="At least 6 characters."
            isPassword
            leftIcon={LockClosed24Regular}
          />
          <AuthInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            isPassword
            leftIcon={LockClosed24Regular}
          />

          <ErrorBanner message={submitError} />

          <AppButton
            label="Create Account"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting}
            onPress={handleSignUp}
          />
        </View>

        <View style={styles.footer}>
          <Text variant="body2" color={colors.neutralForeground2 as string}>
            Already have an account?
          </Text>
          <Button appearance="subtle" size="small" onClick={() => navigation.navigate('Login')}>
            Sign In
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FluentSpacing.xs,
    marginTop: FluentSpacing.xxl,
  },
});
