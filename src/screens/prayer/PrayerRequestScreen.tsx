import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../../components/fluent';
import { TopBar, Button, SuccessState } from '../../components/ui';
import { prayersApi } from '../../api/prayers';
import { ApiError } from '../../api/client';
import { ArrowRight24Regular, Dismiss24Regular, Heart24Filled } from '../../components/fluent/icons';

const MAX_LENGTH = 2000;

export default function PrayerRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);
  const colors = useFluentColors();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (message.trim().length < 5) {
      Alert.alert(
        'Please write your prayer request',
        'Your message should be at least a few words.',
      );
      return;
    }
    setSubmitting(true);
    try {
      await prayersApi.submit(message.trim());
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
        <TopBar title="Prayer Request" backIcon={Dismiss24Regular} />
        <SuccessState
          icon={Heart24Filled}
          title="Prayer submitted"
          message="Thank you for sharing. Our team will be praying with you and believing God for His perfect will."
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
      <TopBar title="Prayer Request" />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + FluentSpacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text variant="body1Strong" style={styles.fieldLabel}>
            Your prayer request
          </Text>
          <View
            style={[
              styles.textAreaWrap,
              {
                backgroundColor: colors.neutralBackground1 as string,
                borderColor: focused
                  ? (colors.brandStroke1 as string)
                  : (colors.neutralStroke1 as string),
              },
            ]}
          >
            <TextInput
              style={[styles.textArea, { color: colors.neutralForeground1 as string }]}
              placeholder="Write what's on your heart..."
              placeholderTextColor={colors.neutralForeground3 as string}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={MAX_LENGTH}
            />
          </View>
          <Text
            variant="caption1"
            color={colors.neutralForeground3 as string}
            style={styles.charCount}
          >
            {`${message.length} / ${MAX_LENGTH}`}
          </Text>
        </View>

        <Button
          label="Submit prayer request"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!message.trim()}
          iconRight={ArrowRight24Regular}
          size="lg"
        />
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
    paddingTop: FluentSpacing.l,
  },
  field: {
    marginBottom: FluentSpacing.l,
  },
  fieldLabel: {
    marginBottom: FluentSpacing.s,
  },
  textAreaWrap: {
    borderRadius: FluentCorner.medium,
    paddingHorizontal: FluentSpacing.l,
    paddingVertical: FluentSpacing.m,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 160,
    fontSize: 15,
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    marginTop: FluentSpacing.xs,
  },
});
