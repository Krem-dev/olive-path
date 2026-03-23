import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import AuthInput from '../../components/common/AuthInput';
import GoogleButton from '../../components/common/GoogleButton';
import OrDivider from '../../components/common/OrDivider';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SignUpNavProp>();
  const signup = useAuthStore((s) => s.signup);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validate()) {
      signup(name, email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo — replace with <Image> when asset is provided */}
        {/* <Image source={require('../../assets/logo.png')} style={styles.logo} /> */}

        <Text style={styles.title}>Create Account</Text>

        {/* Form */}
        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            icon="person-outline"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoComplete="name"
          />
          <AuthInput
            label="Email"
            icon="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
          />
          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <OrDivider />

        {/* Google Sign In */}
        <GoogleButton
          onPress={() => {
            // TODO: wire up Google sign-in
            signup('Google User', 'google@example.com', '');
          }}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  form: {
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: 0,
  },
  buttonText: {
    ...Typography.button,
  },
  footer: {
    marginTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.bodyMedium,
    fontSize: 13,
    color: Colors.accent,
  },
});
