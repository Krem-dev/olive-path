/**
 * TopBar — screen header, migrated to Fluent.
 *
 * Icons are now Fluent icon components rather than Ionicons name strings,
 * and every colour comes from Fluent's alias tokens.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, useFluentColors, FluentSpacing, FluentCorner } from '../fluent';
import { ChevronLeft24Regular } from '../fluent/icons';

type FluentIcon = React.FC<any>;

interface TopBarProps {
  title: string;
  /** A Fluent icon component. Defaults to the back chevron. */
  backIcon?: FluentIcon;
  /** A Fluent icon component for the trailing action. */
  rightIcon?: FluentIcon;
  onRightPress?: () => void;
  onBackPress?: () => void;
  rightAccessibilityLabel?: string;
}

export default function TopBar({
  title,
  backIcon: BackIcon = ChevronLeft24Regular,
  rightIcon: RightIcon,
  onRightPress,
  onBackPress,
  rightAccessibilityLabel,
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colors = useFluentColors();

  const iconBtnStyle = ({ pressed }: { pressed: boolean }) => [
    styles.iconBtn,
    {
      backgroundColor: pressed
        ? (colors.neutralBackground1Pressed as string)
        : (colors.neutralBackground1 as string),
      borderColor: colors.neutralStroke1 as string,
    },
  ];

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={onBackPress ?? (() => navigation.goBack())}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={iconBtnStyle}
      >
        <BackIcon color={colors.neutralForeground1 as string} />
      </Pressable>

      <Text variant="body1Strong" numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {RightIcon ? (
        <Pressable
          onPress={onRightPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={rightAccessibilityLabel}
          style={iconBtnStyle}
        >
          <RightIcon color={colors.neutralForeground1 as string} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.s,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: FluentCorner.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: FluentSpacing.s,
  },
  spacer: { width: 40 },
});
