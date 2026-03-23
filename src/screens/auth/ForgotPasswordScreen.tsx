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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../constants';
import AuthInput from '../../components/common/AuthInput';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setSent(true);
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
        {sent ? (
          <View style={styles.sentContainer}>
            <Ionicons name="checkmark-circle" size={56} color="#059669" />
            <Text style={styles.sentTitle}>Check Your Email</Text>
            <Text style={styles.sentEmail}>{email}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link.
            </Text>

            <View style={styles.form}>
              <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                error={error}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
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
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backLink: {
    alignSelf: 'center',
    marginTop: Spacing.xl,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  sentContainer: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.md,
  },
  sentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sentEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
});
