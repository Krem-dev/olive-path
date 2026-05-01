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
  Modal,
  Pressable,
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [counsellingType, setCounsellingType] = useState('');
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [concern, setConcern] = useState('');
  const [concernFocused, setConcernFocused] = useState(false);
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
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        'Missing details',
        'Please fill in your name and phone number.',
      );
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
            Your counselling request has been received. We'll contact you to
            confirm your appointment.
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
        <Text style={styles.topTitle}>Book Counselling</Text>
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
          <Text style={styles.title}>Counselling</Text>
          <Text style={styles.subtitle}>
            We'll meet you wherever you are.
          </Text>
        </View>

        <AuthInput
          label="Full name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
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
          label="Email (optional)"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />

        {/* Counselling Type picker */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Counselling type</Text>
          <TouchableOpacity
            style={styles.pickerInput}
            onPress={() => setShowTypeSheet(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={Colors.textSecondary}
              style={styles.pickerLeft}
            />
            <Text
              style={[
                styles.pickerText,
                !counsellingType && styles.pickerPlaceholder,
              ]}
            >
              {counsellingType || 'Select type'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Date picker */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Preferred date</Text>
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

        {/* Concern */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Brief concern</Text>
          <View
            style={[
              styles.textAreaWrap,
              concernFocused && styles.textAreaFocused,
            ]}
          >
            <TextInput
              style={styles.textArea}
              placeholder="What would you like to discuss?"
              placeholderTextColor={Colors.textSecondary}
              value={concern}
              onChangeText={setConcern}
              onFocus={() => setConcernFocused(true)}
              onBlur={() => setConcernFocused(false)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            submitting && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Submit request</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.textInverse}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ── Counselling type sheet ── */}
      <Modal
        visible={showTypeSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeSheet(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowTypeSheet(false)}
        >
          <Pressable
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Spacing.lg },
            ]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Counselling type</Text>
            {COUNSELLING_TYPES.map((type) => {
              const active = counsellingType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.sheetRow,
                    active && styles.sheetRowActive,
                  ]}
                  onPress={() => {
                    setCounsellingType(type);
                    setShowTypeSheet(false);
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.sheetRowText,
                      active && styles.sheetRowTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={Colors.accent}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Top bar ──
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

  // ── Container ──
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

  // ── Field ──
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

  // ── Text area ──
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

  // ── Primary button ──
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

  // ── Success ──
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

  // ── Sheet ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: Spacing.lg,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: 4,
  },
  sheetRowActive: {
    backgroundColor: Colors.surfaceBlue,
  },
  sheetRowText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  sheetRowTextActive: {
    fontWeight: '700',
    color: Colors.accent,
  },
});
