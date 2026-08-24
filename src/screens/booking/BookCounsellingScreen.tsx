import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFluentColors, FluentSpacing } from '../../components/fluent';
import {
  TopBar,
  Button,
  SuccessState,
  DatePickerField,
  SelectField,
  TextArea,
} from '../../components/ui';
import AuthInput from '../../components/common/AuthInput';
import { bookingsApi } from '../../api/bookings';
import { ApiError } from '../../api/client';
import { ArrowRight24Regular, Call24Regular, Dismiss24Regular, Mail24Regular, Person24Regular } from '../../components/fluent/icons';

const COUNSELLING_TYPES = [
  'Marriage & Family',
  'Spiritual Growth',
  'Career & Purpose',
  'Grief & Loss',
  'Relationship',
  'Financial',
  'Youth & Parenting',
  'Other',
];

export default function BookCounsellingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colors = useFluentColors();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [counsellingType, setCounsellingType] = useState('');
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [concern, setConcern] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing details', 'Please fill in your name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await bookingsApi.counselling({
        fullName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        type: counsellingType || 'Other',
        preferredDate: date ? date.toISOString().split('T')[0] : undefined,
        concern: concern.trim() || undefined,
      });
      setSubmitted(true);
    } catch (e) {
      Alert.alert(
        'Could not submit',
        e instanceof ApiError ? e.message : 'Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}>
        <TopBar title="Book Counselling" backIcon={Dismiss24Regular} />
        <SuccessState
          title="Booking submitted"
          message="Your counselling request has been received. We'll contact you to confirm your appointment."
          buttonLabel="Back to home"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.neutralBackground3 as string }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopBar title="Book Counselling" />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthInput
          label="Full name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          leftIcon={Person24Regular}
        />
        <AuthInput
          label="Phone number"
          placeholder="0XX XXX XXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={Call24Regular}
        />
        <AuthInput
          label="Email (optional)"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={Mail24Regular}
        />

        <SelectField
          label="Counselling type"
          value={counsellingType}
          options={COUNSELLING_TYPES}
          onSelect={setCounsellingType}
          placeholder="Select type"
        />

        <DatePickerField
          label="Preferred date"
          value={date}
          onChange={setDate}
          placeholder="Select a date"
          minimumDate={new Date()}
        />

        <TextArea
          label="Brief concern"
          value={concern}
          onChangeText={setConcern}
          placeholder="What would you like to discuss?"
        />

        <Button
          label="Submit request"
          onPress={handleSubmit}
          loading={submitting}
          iconRight={ArrowRight24Regular}
          size="lg"
        />
      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.l,
  },
});
