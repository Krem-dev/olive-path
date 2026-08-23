/**
 * Olive App — Design System Colors
 * Extracted from brand logo + warm gold accent
 */

export const Colors = {
  // Brand — Deep navy (from logo "olive" text + dark hills)
  primary: '#0B1D3A',
  primaryDark: '#060F1F',
  primaryLight: '#132D54',

  // Accent — Medium blue (from logo "path" text)
  accent: '#0F8FCF',
  accentDark: '#0C74A8',
  accentLight: '#4BC4E0',    // Sky blue from logo circle

  // Warm — Gold (CTA buttons, featured, energy)
  warm: '#D4A04C',
  warmDark: '#B8873A',
  warmLight: '#F5E6CC',

  // Backgrounds
  background: '#F5F7FA',     // Cool light gray
  surface: '#FFFFFF',         // White cards
  surfaceElevated: '#FFFFFF',
  surfaceBlue: '#EBF5FB',    // Light blue wash
  surfaceWarm: '#FDF8F0',    // Light gold wash

  // Text
  textPrimary: '#1C2536',    // Near-black, neutral
  textSecondary: '#6B7A8D',  // Gray
  textInverse: '#FFFFFF',
  textLink: '#0F8FCF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#EDF2F7',

  // Status
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  // Overlays
  overlay: 'rgba(11, 29, 58, 0.55)',
  overlayLight: 'rgba(11, 29, 58, 0.3)',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#0B1D3A',
  tabBarInactive: '#9CA3AF',
} as const;

export type ColorKey = keyof typeof Colors;
