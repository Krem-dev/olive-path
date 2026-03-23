/**
 * Olive Path — Typography System
 * Uses Inter for UI and system serif for scripture quotes
 */

import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const FontFamilies = {
  heading: 'Inter-Bold',
  headingSemiBold: 'Inter-SemiBold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  scripture: 'serif', // System serif — elegant for scripture quotes
} as const;

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
} as const;

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

/**
 * Pre-composed text styles for consistent usage across screens
 */
export const Typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes['3xl'],
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes['2xl'],
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: FontSizes.xl,
    lineHeight: FontSizes.xl * LineHeights.tight,
    color: Colors.textPrimary,
  },
  h4: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * LineHeights.tight,
    color: Colors.textPrimary,
  },

  // Body
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
    color: Colors.textSecondary,
  },

  // Captions
  caption: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * LineHeights.normal,
    color: Colors.textSecondary,
  },
  captionMedium: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * LineHeights.normal,
    color: Colors.textSecondary,
  },

  // Scripture — italic serif for biblical quotes
  scripture: {
    fontFamily: FontFamilies.scripture,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.relaxed,
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  scriptureSmall: {
    fontFamily: FontFamilies.scripture,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.relaxed,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },

  // Labels
  label: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Button text
  button: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
    color: Colors.textInverse,
  },
  buttonSmall: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
    color: Colors.textInverse,
  },
};
