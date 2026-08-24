/**
 * SelectField — labelled picker that opens a Fluent-styled bottom sheet.
 *
 * Fluent ships no picker/select for React Native (its Menu is an anchored
 * popover, not a mobile sheet), so this is built from Fluent tokens and icons.
 * Shared by the booking screens.
 */

import React, { useState } from 'react';
import { View, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import {
  ChevronDown20Regular,
  Checkmark20Regular,
  TextBulletListLtr24Regular,
} from '../fluent/icons';

type FluentIcon = React.FC<any>;

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  /** Leading icon on the closed field. Defaults to a list glyph. */
  icon?: FluentIcon;
  /** Title shown at the top of the sheet. Defaults to `label`. */
  sheetTitle?: string;
}

export default function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select an option',
  icon: Icon = TextBulletListLtr24Regular,
  sheetTitle,
}: SelectFieldProps) {
  const insets = useSafeAreaInsets();
  const colors = useFluentColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text variant="body2" color={colors.neutralForeground2 as string} style={styles.label}>
        {label}
      </Text>

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value || placeholder}`}
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
        <Icon color={colors.neutralForeground3 as string} />
        <Text
          variant="body1"
          style={styles.value}
          numberOfLines={1}
          color={
            value
              ? (colors.neutralForeground1 as string)
              : (colors.neutralForeground3 as string)
          }
        >
          {value || placeholder}
        </Text>
        <ChevronDown20Regular color={colors.neutralForeground3 as string} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* Swallows taps so they don't dismiss the sheet. */}
          <Pressable
            onPress={() => {}}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.neutralBackground1 as string,
                paddingBottom: insets.bottom + FluentSpacing.l,
              },
            ]}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.neutralStroke1 as string }]}
            />
            <Text variant="subtitle2" style={styles.sheetTitle}>
              {sheetTitle ?? label}
            </Text>

            <ScrollView bounces={false}>
              {options.map((opt) => {
                const active = opt === value;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={({ pressed }) => [
                      styles.row,
                      {
                        backgroundColor: pressed
                          ? (colors.neutralBackground1Pressed as string)
                          : active
                            ? (colors.neutralBackground1Selected as string)
                            : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      variant={active ? 'body1Strong' : 'body1'}
                      style={styles.rowText}
                      color={
                        active
                          ? (colors.brandForeground1 as string)
                          : (colors.neutralForeground1 as string)
                      }
                    >
                      {opt}
                    </Text>
                    {active && <Checkmark20Regular color={colors.brandForeground1 as string} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: FluentSpacing.l },
  label: { marginBottom: FluentSpacing.s },
  // Matches Fluent Input: filled surface, bottom stroke only, no corner radius.
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
    paddingHorizontal: FluentSpacing.l,
    height: 48,
    borderBottomWidth: 1,
  },
  value: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: FluentCorner.xxLarge,
    borderTopRightRadius: FluentCorner.xxLarge,
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.m,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: FluentCorner.circular,
    marginBottom: FluentSpacing.m,
  },
  sheetTitle: { marginBottom: FluentSpacing.s },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: FluentSpacing.m,
    paddingHorizontal: FluentSpacing.s,
    borderRadius: FluentCorner.medium,
  },
  rowText: { flex: 1 },
});
