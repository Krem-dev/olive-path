/**
 * Olive Path — Spacing & Layout Constants
 * 4px base grid system
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const IconSize = {
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
} as const;

/**
 * Standard horizontal padding for screen content
 */
export const SCREEN_PADDING = Spacing.base;

/**
 * Bottom tab bar height (used for mini player offset)
 */
export const TAB_BAR_HEIGHT = 60;

/**
 * Mini player bar height
 */
export const MINI_PLAYER_HEIGHT = 64;
