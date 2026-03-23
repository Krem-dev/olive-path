/**
 * Olive Path — Design System Colors
 * From client brand assets
 */

export const Colors = {
  // Brand
  primary: '#011838',        // Deep navy — headings, primary elements
  primaryDark: '#000D1F',    // Darker navy — pressed states
  primaryLight: '#0A2E5C',   // Lighter navy

  // Tertiary / Accent
  accent: '#028FD6',         // Bright blue — buttons, links, active states
  accentDark: '#0278B5',     // Pressed accent
  accentLight: '#3AA8E8',    // Lighter accent

  // Backgrounds
  background: '#FDFDFD',     // Main background
  surface: '#F5F7FA',        // Card backgrounds, sections
  surfaceBlue: '#E8F2FA',    // Soft blue wash — featured cards, tints

  // Text
  textPrimary: '#011838',    // Headings, body
  textSecondary: '#5A6B7F',  // Captions, timestamps, muted text
  textInverse: '#FFFFFF',    // Text on dark backgrounds
  textLink: '#028FD6',       // Links, tappable text

  // Borders & Dividers
  border: '#E2E8F0',         // Card borders, dividers
  borderLight: '#EDF2F7',    // Subtle dividers

  // Status
  error: '#E53E3E',
  errorLight: '#FED7D7',
  success: '#38A169',
  successLight: '#C6F6D5',
  warning: '#D69E2E',
  warningLight: '#FEFCBF',

  // Overlays
  overlay: 'rgba(1, 24, 56, 0.5)',
  overlayLight: 'rgba(1, 24, 56, 0.3)',

  // Tab bar
  tabBarBackground: '#FDFDFD',
  tabBarActive: '#028FD6',
  tabBarInactive: '#A0AEC0',
} as const;

export type ColorKey = keyof typeof Colors;
