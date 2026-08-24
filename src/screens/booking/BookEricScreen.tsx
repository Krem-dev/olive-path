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
  TextArea,
} from '../../components/ui';
import AuthInput from '../../components/common/AuthInput';
import { bookingsApi } from '../../api/bookings';
import { ApiError } from '../../api/client';
import { ArrowRight24Regular, Building24Regular, Call24Regular, Dismiss24Regular, Location24Regular, Mail24Regular, Person24Regular } from '../../components/fluent/icons';

export default function BookEricScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colors = useFluentColors();

  const [name, setName] = useState('');
  const [church, setChurch] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !church.trim() || !phone.trim() || !email.trim()) {
      Alert.alert(
        'Missing details',
        'Please fill in your name, church, phone number, and email.',
      );
      return;
    }
    setSubmitting(true);
    try {
      await bookingsApi.pastor({
        fullName: name.trim(),
        church: church.trim(),
        phone: phone.trim(),
        email: email.trim(),
        programDate: date ? date.toISOString().split('T')[0] : undefined,
        location: location.trim() || undefined,
        message: message.trim() || undefined,
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
        <TopBar title="Book Pastor for Programs" backIcon={Dismiss24Regular} />
        <SuccessState
          title="Booking submitted"
          message="Your booking request for Rev. Ing. Eric Ofori Broni has been received. Our team will review and contact you to confirm."
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
      <TopBar title="Book Pastor for Programs" />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthInput
          label="Your name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          leftIcon={Person24Regular}
        />
        <AuthInput
          label="Church / organization"
          placeholder="e.g. Grace Chapel International"
          value={church}
          onChangeText={setChurch}
          leftIcon={Building24Regular}
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
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={Mail24Regular}
        />

        <DatePickerField
          label="Program date"
          value={date}
          onChange={setDate}
          placeholder="Select a date"
          minimumDate={new Date()}
        />

        <AuthInput
          label="Location"
          placeholder="City, venue or address"
          value={location}
          onChangeText={setLocation}
          leftIcon={Location24Regular}
        />

        <TextArea
          label="Message (optional)"
          value={message}
          onChangeText={setMessage}
          placeholder="Additional details about the program"
        />

        <Button
          label="Submit booking"
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
