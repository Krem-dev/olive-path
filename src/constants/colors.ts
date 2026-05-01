/**
 * Olive Path — Design System Colors
 * "Olive & Brass" palette — warm, reverent, ministry-focused
 */

export const Colors = {
  // Brand — Deep olive (rooted, scripture, sanctuary)
  primary: '#3D4F2C',         // Deep olive — headings, primary actions
  primaryDark: '#2D3B20',     // Pressed olive
  primaryLight: '#556B3D',    // Lighter olive — gradients

  // Accent — Warm brass / antique gold (anointing, featured, scripture refs)
  accent: '#B8893E',          // Brass — CTAs, links, scripture badges
  accentDark: '#9A7232',      // Pressed brass
  accentLight: '#D4A85A',     // Lighter brass — tints

  // Backgrounds — Warm ground
  background: '#FAF7F0',      // Warm ivory — page background
  surface: '#FFFEFB',         // Off-white — card surfaces
  surfaceElevated: '#FFFFFF', // Pure white — modals, sheets
  surfaceBlue: '#F2EDE0',     // Warm cream wash — featured tints, badges

  // Text
  textPrimary: '#1F2419',     // Near-black with warm undertone
  textSecondary: '#6B6557',   // Warm gray — captions, muted
  textInverse: '#FFFEFB',     // Off-white on dark
  textLink: '#B8893E',        // Brass

  // Borders & Dividers
  border: '#E5DFD0',          // Warm border
  borderLight: '#EFEAD9',     // Subtle warm divider

  // Status (warm-toned)
  error: '#C44536',           // Warm red
  errorLight: '#F4D9D5',
  success: '#5C7A3D',         // Olive-green success
  successLight: '#DCE5CD',
  warning: '#C9924A',         // Brass warning
  warningLight: '#F4E5C8',

  // Overlays
  overlay: 'rgba(31, 36, 25, 0.55)',
  overlayLight: 'rgba(31, 36, 25, 0.3)',

  // Tab bar
  tabBarBackground: '#FFFEFB',
  tabBarActive: '#3D4F2C',
  tabBarInactive: '#A89F8B',
} as const;

export type ColorKey = keyof typeof Colors;
