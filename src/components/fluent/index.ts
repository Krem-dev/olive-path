/**
 * Olive Path — Fluent UI component layer.
 *
 * Two kinds of export live here:
 *
 *  1. Re-exports of Microsoft's real Fluent components, wrapped in this barrel
 *     so every screen imports from one place. If a Fluent package changes its
 *     API in a 0.x bump, this file is the only thing that needs fixing.
 *
 *  2. Four components Microsoft does not ship for React Native — Card, Dialog,
 *     Slider and ListItem — built here against Fluent's own design tokens.
 *
 * Usage:  import { Button, FluentCard, Input } from '../components/fluent';
 *
 * GOTCHA: Fluent's Button/Checkbox/etc. use `onClick`, NOT `onPress`.
 */

// ── Built here: the gaps in Microsoft's RN coverage ──────────────────────
export { default as FluentCard } from './FluentCard';
export type { FluentCardProps, FluentCardAppearance, FluentCardSize } from './FluentCard';

export { default as FluentDialog } from './FluentDialog';
export type { FluentDialogProps, FluentDialogAction } from './FluentDialog';

export { default as FluentSlider, formatTime } from './FluentSlider';
export type { FluentSliderProps } from './FluentSlider';

export { default as FluentListItem } from './FluentListItem';
export type { FluentListItemProps } from './FluentListItem';

// ── Microsoft's real Fluent components ───────────────────────────────────
// NOTE: the umbrella package exports BOTH a legacy V0 and a Fluent 2 "V1" of
// Button/Checkbox/Text/Link. Only the V1s implement the Fluent 2 spec
// (`appearance`, `size`, `shape`). Always re-export the V1s under the plain
// name so screens can never accidentally pick up the legacy control.
//
// The legacy versions are not merely styled differently — legacy Link renders
// its children straight into a View, which throws "Text strings must be
// rendered within a <Text> component" at runtime.
//
// CompoundButton is deliberately NOT exported: its mobile implementation
// returns null and logs a warning, so it renders nothing on Android/iOS.
//
// ContextualMenu / ContextualMenuItem are NOT exported: ContextualMenu renders
// `focusZone: FocusZone` as a slot with no platform guard, so it crashes on
// Android exactly like TabList. Use Menu (which guards FocusZone to win32) or
// FluentDialog instead.
//
// TabList / Tab are NOT exported either: TabList renders a FocusZone container,
// and focus-zone ships native code for macOS only — mounting it on Android
// crashes with "Can't find ViewManager 'FocusZone'". Use FilterPills instead.
export {
  ButtonV1 as Button,
  ToggleButton,
  FAB,
  Text,
  LinkV1 as Link,
  CheckboxV1 as Checkbox,
  RadioGroup,
  RadioButton,
  Separator,
  Callout,
  MenuButton,
  Persona,
  PersonaCoin,
  Pressable as FluentPressable,
} from '@fluentui/react-native';

export { Input } from '@fluentui-react-native/input';
export { Avatar } from '@fluentui-react-native/avatar';
export { Badge } from '@fluentui-react-native/badge';
export { Chip } from '@fluentui-react-native/chip';
export { Divider } from '@fluentui-react-native/divider';
export { Spinner } from '@fluentui-react-native/spinner';
export { Switch } from '@fluentui-react-native/switch';
export { Drawer } from '@fluentui-react-native/drawer';
export { Notification } from '@fluentui-react-native/notification';
export { Tooltip } from '@fluentui-react-native/tooltip';
export { Shimmer } from '@fluentui-react-native/experimental-shimmer';
export {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui-react-native/menu';
export { Popover } from '@fluentui-react-native/popover';

// ── Icons ────────────────────────────────────────────────────────────────
// Generated locally by scripts/gen-fluent-icons.mjs. Never import from
// '@fluentui/react-native-icons' directly — that barrel adds ~27MB to the
// bundle. Add icons to icons.manifest.json and run `npm run gen:icons`.
export * from './icons';

// ── Theme ────────────────────────────────────────────────────────────────
export {
  fluentTheme,
  useFluentColors,
  useFluentTheme,
  FluentCorner,
  FluentSpacing,
  FluentTokens,
  FluentTint,
} from '../../theme/fluent';
