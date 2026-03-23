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
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import AuthInput from '../../components/common/AuthInput';
// import LogoPlaceholder from '../../components/common/LogoPlaceholder';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email');
      return;
    }
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
          { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo — replace with <Image> when asset is provided */}
        {/* <Image source={require('../../assets/logo.png')} style={styles.logo} /> */}

        {sent ? (
          <View style={styles.sentContainer}>
            <View style={styles.sentIcon}>
              <Ionicons name="mail-open-outline" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.sentEmail}>{email}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Reset Password</Text>

            <View style={styles.form}>
              <AuthInput
                label="Email"
                icon="mail-outline"
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
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backLinkText}>Back to Login</Text>
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
    ...Typography.h2,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  form: {
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.button,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
  backLinkText: {
    ...Typography.bodyMedium,
    fontSize: 13,
    color: Colors.accent,
  },
  sentContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  sentIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sentEmail: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
  },
});
