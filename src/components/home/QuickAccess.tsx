import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface QuickItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bgColor: string;
  onPress?: () => void;
}

const items: QuickItem[] = [
  { icon: 'mic-outline', label: 'Preaching', color: '#028FD6', bgColor: '#E8F4FD' },
  { icon: 'flame-outline', label: 'Motivation', color: '#D97706', bgColor: '#FEF3C7' },
  { icon: 'chatbubbles-outline', label: 'Q & A', color: '#059669', bgColor: '#D1FAE5' },
  { icon: 'heart-outline', label: 'Prayer', color: '#DC2626', bgColor: '#FEE2E2' },
];

export default function QuickAccess() {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity key={item.label} style={styles.item} activeOpacity={0.7} onPress={item.onPress}>
          <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  item: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
