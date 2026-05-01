import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import AuthInput from '../../components/common/AuthInput';
import { bookingsApi } from '../../api/bookings';
import { ApiError } from '../../api/client';
import { ActivityIndicator } from 'react-native';

export default function BookEricScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [church, setChurch] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [messageFocused, setMessageFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const formattedDate = date
    ? date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

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
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <View style={{ width: 40 }} />
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={36} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Booking submitted</Text>
          <Text style={styles.successMessage}>
            Your booking request for Rev. Ing. Eric Ofori Broni has been
            received. Our team will review and contact you to confirm.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.topTitle}>Book Pastor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Invite Pastor Eric</Text>
          <Text style={styles.subtitle}>
            For programs, conferences, and church gatherings.
          </Text>
        </View>

        <AuthInput
          label="Your name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />
        <AuthInput
          label="Church / organization"
          placeholder="e.g. Grace Chapel International"
          value={church}
          onChangeText={setChurch}
          leftIcon="business-outline"
        />
        <AuthInput
          label="Phone number"
          placeholder="0XX XXX XXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />
        <AuthInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />

        {/* Date picker */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Program date</Text>
          <TouchableOpacity
            style={styles.pickerInput}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.textSecondary}
              style={styles.pickerLeft}
            />
            <Text
              style={[
                styles.pickerText,
                !date && styles.pickerPlaceholder,
              ]}
            >
              {date ? formattedDate : 'Select a date'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <AuthInput
          label="Location"
          placeholder="City, venue or address"
          value={location}
          onChangeText={setLocation}
          leftIcon="location-outline"
        />

        {/* Message */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Message (optional)</Text>
          <View
            style={[
              styles.textAreaWrap,
              messageFocused && styles.textAreaFocused,
            ]}
          >
            <TextInput
              style={styles.textArea}
              placeholder="Additional details about the program"
              placeholderTextColor={Colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setMessageFocused(true)}
              onBlur={() => setMessageFocused(false)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Submit booking</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.textInverse}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
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
  topTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  field: {
    marginBottom: Spacing.base,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerLeft: {
    marginRight: Spacing.sm,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  pickerPlaceholder: {
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  textAreaWrap: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textAreaFocused: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  textArea: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 22,
    minHeight: 80,
  },
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(92, 122, 61, 0.3)',
  },
  successTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
