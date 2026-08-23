/**
 * FilterPills — horizontal filter row, now built on Fluent's real `Chip`.
 *
 * Chip is implemented for iOS and Android only (its shared fallback renders
 * nothing on web/desktop), which is fine for this app.
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip, FluentSpacing } from '../fluent';

type FluentIcon = React.FC<any>;

interface FilterOption {
  key: string;
  label: string;
  /** A Fluent icon component. */
  icon?: FluentIcon;
}

interface FilterPillsProps {
  options: FilterOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function FilterPills({ options, activeKey, onSelect }: FilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => (
        <Chip
          key={opt.key}
          // `brand` gives a legible selected state (solid brand fill, white
          // label). The default `neutral` chip only shifts one grey step,
          // which reads as unselected in a filter row.
          chipColor="brand"
          selected={opt.key === activeKey}
          onPress={() => onSelect(opt.key)}
          icon={opt.icon ? { svgSource: { src: opt.icon } } : undefined}
          accessibilityLabel={opt.label}
        >
          {opt.label}
        </Chip>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: FluentSpacing.l,
    gap: FluentSpacing.s,
    paddingBottom: FluentSpacing.s,
  },
});
