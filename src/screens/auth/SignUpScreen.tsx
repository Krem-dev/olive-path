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
import { Colors, Spacing, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import AuthInput from '../../components/common/AuthInput';

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
    if (validate()) signup(name, email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoComplete="name"
          />
          <AuthInput
            label="Email"
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

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
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing['3xl'],
  },
  form: {
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});
