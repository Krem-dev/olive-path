/**
 * DatePickerField — date field, migrated to Fluent.
 *
 * Fluent's Input cannot host a native date picker, so this stays a pressable
 * field, styled from Fluent tokens with the Fluent calendar icon.
 */

import React, { useState } from 'react';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import { Calendar24Regular } from '../fluent/icons';

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
}

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  minimumDate,
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const colors = useFluentColors();

  const formatted = value
    ? value.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleChange = (_event: any, selected?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selected) onChange(selected);
  };

  return (
    <View style={styles.container}>
      <Text variant="body2" color={colors.neutralForeground2 as string} style={styles.label}>
        {label}
      </Text>

      <Pressable
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value ? formatted : placeholder}`}
        style={({ pressed }) => [
          styles.input,
          {
            backgroundColor: pressed
              ? (colors.neutralBackground1Pressed as string)
              : (colors.neutralBackground1 as string),
            borderBottomColor: colors.neutralStroke1 as string,
          },
        ]}
      >
        <Text
          variant="body1"
          color={
            value
              ? (colors.neutralForeground1 as string)
              : (colors.neutralForeground3 as string)
          }
        >
          {value ? formatted : placeholder}
        </Text>
        <Calendar24Regular color={colors.neutralForeground3 as string} />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate || new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: FluentSpacing.l,
  },
  label: {
    marginBottom: FluentSpacing.s,
  },
  // Matches Fluent Input: filled surface, bottom stroke only.
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FluentSpacing.l,
    height: 48,
    borderBottomWidth: 1,
  },
});
