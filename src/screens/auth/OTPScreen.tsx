/**
 * OTPScreen — migrated to Fluent UI.
 *
 * The four digit boxes stay as raw TextInputs: Fluent ships no PIN/OTP
 * component, and its Input is a full labelled field. They are styled entirely
 * from Fluent tokens so they still read as Fluent.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Button,
  Text,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
} from '../../components/fluent';
import { TopBar } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';

type OTPRouteParams = {
  OTP: { name: string; email: string; password: string };
};

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<OTPRouteParams, 'OTP'>>();
  const { name, email, password } = route.params;
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const colors = useFluentColors();

  const [code, setCode] = useState(['', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length < 4) {
      Alert.alert('Enter the full code', 'Please enter all 4 digits.');
      return;
    }
    setSubmitting(true);
    try {
      await verifyOtp(name, email, password, otp);
    } catch (e: any) {
      Alert.alert('Verification failed', e.message || 'Invalid or expired code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      Alert.alert('Code resent', 'Check your email for a new code.');
    } catch {
      Alert.alert('Failed', 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopBar title="Verify Email" />

      <View style={[styles.container, { paddingBottom: insets.bottom + FluentSpacing.xxl }]}>
        <Text variant="subtitle1">Enter verification code</Text>
        <Text
          variant="body1"
          color={colors.neutralForeground2 as string}
          style={styles.sub}
        >
          {`We sent a 4-digit code to ${email}`}
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              style={[
                styles.codeInput,
                {
                  backgroundColor: colors.neutralBackground1 as string,
                  borderColor: digit
                    ? (colors.brandStroke1 as string)
                    : (colors.neutralStroke1 as string),
                  color: colors.neutralForeground1 as string,
                },
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textContentType="oneTimeCode"
              accessibilityLabel={`Digit ${i + 1} of 4`}
            />
          ))}
        </View>

        <Button
          appearance="primary"
          size="large"
          loading={submitting}
          disabled={submitting}
          onClick={handleVerify}
          width="100%"
        >
          Verify
        </Button>

        <View style={styles.resend}>
          <Button
            appearance="subtle"
            size="medium"
            disabled={resending}
            loading={resending}
            onClick={handleResend}
          >
            {resending ? 'Sending…' : "Didn't get the code? Resend"}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: FluentSpacing.xxl,
    paddingTop: FluentSpacing.xxl,
  },
  sub: {
    marginTop: FluentSpacing.s,
    marginBottom: FluentSpacing.xxl,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: FluentSpacing.xxl,
  },
  codeInput: {
    width: 56,
    height: 64,
    borderRadius: FluentCorner.xLarge,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  resend: {
    alignSelf: 'center',
    marginTop: FluentSpacing.l,
  },
});
