/**
 * Olive Path — Fluent UI theme
 *
 * Uses Fluent's stock "Communication Blue" brand ramp (brand80 = #0F6CBD).
 *
 * ────────────────────────────────────────────────────────────────────────
 * TO SWITCH TO THE OLIVE PATH BRAND COLORS (navy #0B1D3A / blue #0F8FCF /
 * gold #D4A04C from src/constants/colors.ts), change BRAND_RAMP below to
 * OLIVE_BRAND_RAMP. Nothing else in the app needs to change — every Fluent
 * component reads its color from this ramp.
 * ────────────────────────────────────────────────────────────────────────
 */

import { createDefaultTheme } from '@fluentui-react-native/default-theme';
import { useTheme } from '@fluentui-react-native/framework';
import type { Theme, ThemeColorDefinition } from '@fluentui-react-native/framework';
import { globalTokens } from '@fluentui-react-native/theme-tokens';

/**
 * The Fluent theme instance handed to <ThemeProvider>.
 *
 * `createDefaultTheme` returns a ThemeReference — a live object that Fluent
 * components subscribe to, not a plain value. Create it exactly once at module
 * scope; recreating it per render remounts every themed component.
 */
export const fluentTheme = createDefaultTheme({
  appearance: 'light',
  defaultAppearance: 'light',
});

/**
 * Fluent's raw global tokens (color ramps, corner radii, size scale).
 * Prefer `useFluentColors()` for colors — those are the semantic alias tokens
 * that respond to light/dark. Reach for globals only for corner/size values.
 */
export const FluentTokens = globalTokens;

/** Fluent 2 corner radii, in px. */
export const FluentCorner = {
  none: 0,
  small: 2, // radius20
  medium: 4, // radius40
  large: 6, // radius60
  xLarge: 8, // radius80
  xxLarge: 12, // radius120
  circular: 9999,
} as const;

/**
 * Fluent 2 spacing ramp, in px. Fluent's own scale — deliberately kept
 * separate from `Spacing` in src/constants/spacing.ts so the two systems
 * don't silently drift into each other.
 */
export const FluentSpacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sNudge: 6,
  s: 8,
  mNudge: 10,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Light ends of Fluent's brand ramp, for tinted surfaces (icon tiles, date
 * chips, empty-state circles).
 *
 * These are NOT available as semantic alias tokens — `brandBackground2` is a
 * saturated blue, not a tint, so using it behind a brand-coloured icon gives
 * blue-on-blue. The ramp is read from the global tokens, whose shape differs
 * per platform bundle (`color.brand['160']` here), hence this wrapper.
 */
const brandRamp = (globalTokens as any)?.color?.brand ?? {};

export const FluentTint = {
  /** Faintest brand wash — icon tiles, chips. */
  subtle: (brandRamp['160'] as string) ?? '#EBF3FC',
  /** Slightly stronger wash — hover/selected tints. */
  muted: (brandRamp['150'] as string) ?? '#CFE4FA',
} as const;

/**
 * Semantic Fluent color tokens for the current theme.
 *
 * Gives you the full 155-token alias set — `neutralBackground1`,
 * `neutralForeground2`, `brandBackground`, `neutralStroke1`,
 * `dangerForeground1`, and every interaction variant (`...Pressed`,
 * `...Hover`, `...Disabled`, `...Selected`).
 *
 * Always prefer these over hardcoded hex: they are what makes a hand-built
 * component visually indistinguishable from a real Fluent one.
 */
export function useFluentColors(): ThemeColorDefinition {
  const colors = useTheme().colors;

  // The platform token bundles do not all define the same tokens. Android, for
  // example, ships 77 alias tokens while the theme's type surface exposes ~155
  // — `dangerBackground3`, `brandForeground2` and others are simply absent.
  // Reading a missing one yields `undefined`, React Native then drops the style
  // silently, and the component renders with the wrong colour and no warning.
  //
  // In development, surface that instead of letting it pass.
  if (__DEV__) {
    return new Proxy(colors, {
      get(target, prop: string) {
        const value = (target as Record<string, unknown>)[prop];
        if (value === undefined && typeof prop === 'string' && !prop.startsWith('_')) {
          console.warn(
            `[fluent] colors.${prop} is not defined in this platform's token ` +
              `bundle — the style using it will be dropped. Pick a token that exists ` +
              `(see node_modules/@fluentui-react-native/design-tokens-<platform>/light/tokens-aliases.json).`,
          );
        }
        return value;
      },
    }) as ThemeColorDefinition;
  }

  return colors;
}

export { useTheme as useFluentTheme };
export type { Theme, ThemeColorDefinition };
