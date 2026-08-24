# Fluent UI layer

Fluent UI components for Olive Path. Import everything from this folder:

```tsx
import { Button, Input, FluentCard, FluentDialog } from '../components/fluent';
```

## Gotchas (read before writing a screen)

**1. Fluent uses `onClick`, not `onPress`.**

```tsx
<Button appearance="primary" onClick={handleSave}>Save</Button>  // ✅
<Button appearance="primary" onPress={handleSave}>Save</Button>  // ❌ silently does nothing
```

This applies to `Button`, `ToggleButton` and `FAB`. `Chip` is the exception — it takes `onPress`.
The four components built here (`FluentCard`, `FluentDialog`, `FluentSlider`,
`FluentListItem`) use `onPress`, matching React Native.

**2. Never import Button/Checkbox/Link from the Fluent packages directly.**

The umbrella package exports both a legacy **V0** and a Fluent 2 **V1** of
`Button`, `Checkbox`, `Text` and `Link`. The bare names are the *legacy* ones —
they have no `appearance` / `size` / `shape` props and look nothing like Fluent 2.

Worse, the legacy ones can crash at runtime. Legacy `Link` renders its children
straight into a `View`:

```jsx
<Slots.root>{children}</Slots.root>   // root is a View, children is a string
```

which throws **"Text strings must be rendered within a `<Text>` component"** —
a runtime error TypeScript cannot catch, since both versions type-check.

`index.ts` re-exports `ButtonV1 as Button`, `CheckboxV1 as Checkbox` and
`LinkV1 as Link`, so importing from this folder always gets you the right one.

**2b. `CompoundButton` does not exist on mobile.**

Its Android/iOS implementation is literally:

```tsx
useRender: () => () => {
  console.warn('Compound Button is not implemented on Android/iOS');
  return null;
}
```

It renders **nothing**. It is deliberately not re-exported from `index.ts`.
For a two-line button, use a `FluentCard` with `onPress` and two `Text`s.

**3. Every Fluent package is 0.x and pinned to an exact version.**

`package.json` pins them without `^` on purpose — these ship from Microsoft's
Office monorepo and change props between minor versions. Bump them deliberately,
one at a time, not via `npm update`.

**4. Dev builds need the JSX runtime shim — don't delete metro.config.js.**

Fluent's packages resolve to their **TypeScript source** under Metro (their
`exports` maps carry a `"react-native"` condition pointing at `./src`, not the
precompiled `./lib`). That source declares
`@jsxImportSource @fluentui-react-native/framework-base`, and in development
Babel requests `<source>/jsx-dev-runtime` — which framework-base does not list
in its `exports` map. Result: **production bundles fine, `expo start` fails**
with `Unable to resolve "@fluentui-react-native/framework-base/jsx-dev-runtime"`.

`metro.config.js` redirects that specifier to `shims/fluent-jsx-dev-runtime.js`,
which supplies the missing `jsxDEV` on top of Fluent's real `jsx`/`jsxs`.
Both files must stay. Remove them only once framework-base ships a
`"./jsx-dev-runtime"` export.

Because of this asymmetry, **always smoke-test in dev mode** — a green
`expo export` does not prove the dev server works.

**4b. A Fluent Button cannot be stretched full-width on Android.**

Its Android implementation wraps itself in a ripple container whose style is
hardcoded to `alignSelf: 'baseline'`, so it always shrinks to its content.
Neither the `width` token nor `style` escapes it — `extractOuterStylePropsAndroid`
routes only margins/positioning to that outer view, so everything else lands on
the inner root *inside* the content-sized wrapper.

`components/ui/Button.tsx` solves this once: it measures its own container with
`onLayout` and passes a concrete pixel `width`. Use that wrapper (`<Button
label=… fullWidth />`) for full-width CTAs rather than the raw Fluent Button.

**4c. Fluent icons need explicit width/height when a caller may omit a size.**

React Navigation's `tabBarIcon` does not always supply `size`; `size - 2` then
becomes `NaN` and the icon silently renders nothing. Always default it —
see `TAB_ICON_MAP` usage in `navigation/TabNavigator.tsx`.

**4d. `Chip` is iOS/Android only.**

`Chip.tsx` (the shared fallback used on web/desktop) logs *"Chip is only
implemented for Android"* and returns null; the real implementations live in
`Chip.android.tsx` / `Chip.ios.tsx`. Fine for this app, which ships mobile only.
Note `Chip` takes **`onPress`**, not `onClick` — unlike Button.

**4e. `title2` is a valid TYPE but not a real variant.**

`Text`'s `variant` prop accepts more names than `defaultTheme` actually defines.
`title2` type-checks and then silently renders at default body size. The
variants the theme really provides are:

`caption1`, `caption1Strong`, `body1`, `body1Strong`, `body2`, `body2Strong`,
`subtitle1`, `subtitle1Strong`, `subtitle2`, `subtitle2Strong`, `title1`,
`title1Strong`, `largeTitle`, `display`

(plus legacy `captionStandard`…`heroLargeSemibold`). Anything else is a silent
no-op — check against this list, not against TypeScript.

**4f. Platform token bundles are NOT the same size — check before using a token.**

The theme's type surface exposes ~155 alias tokens, but the Android bundle
defines only 77. Reading a missing one returns `undefined`, React Native drops
the style silently, and you get the wrong colour with no error. Confirmed
missing on Android: `dangerBackground3`, `brandForeground2`,
`neutralForegroundOnBrand`, `dangerBorder1`.

Android equivalents: `dangerBackground2` (solid red), `brandBackgroundTint` /
`brandForegroundTint`, `neutralForegroundOnColor`, `dangerStroke1`.

`useFluentColors()` wraps the palette in a dev-only Proxy that warns on any
undefined token, so this now surfaces instead of hiding. Ground truth is
`node_modules/@fluentui-react-native/design-tokens-<platform>/light/tokens-aliases.json`.

**4g. A Fluent Button cannot be recoloured. At all.**

Three routes, all dead ends on Android:
* token props (`backgroundColor`) — ignored when passed as component props
* `style` — loses to the styled slot
* `customize()` — renders the uncompressed slot tree, which mounts `FocusZone`,
  a native view manager that exists only on macOS/Windows. Crashes with
  *"Can't find ViewManager 'FocusZone'"*.

`components/ui/Button.tsx` therefore draws its `danger` variant itself, from
Fluent's danger tokens, matching Fluent's button geometry and type ramp. Every
other variant delegates to the real Fluent Button.

**4h. Two different `Button`s exist. Importing the wrong one fails SILENTLY.**

```tsx
import { Button } from '../components/fluent';  // Fluent: children + onClick
import { Button } from '../components/ui';      // app wrapper: label + onPress
```

Call the Fluent one with the wrapper's API and you get an **empty button** —
`label` is ignored, there are no children to render, and `onPress` never fires.
TypeScript does not catch it: Fluent's props are permissive enough to accept the
extra keys. It cost a real debugging session on SermonDetailScreen.

Rule of thumb: if you are writing `label=` / `onPress=`, import from
`components/ui`. Reach for the raw Fluent Button only when passing children and
`onClick` directly.

**4i. `TabList` / `Tab` CRASH the app on Android — do not use them.**

TabList renders a `FocusZone` as its container slot, and `@fluentui-react-native/focus-zone`
ships native code for **macOS only** (`focus-zone/macos`, `RCTFocusZone.podspec`
— there is no android/ or ios/ directory). Mounting it produces a red-box:

```
Can't find ViewManager 'FocusZone' nor 'RCTFocusZone' in ViewManagerRegistry
```

It is not exported from `index.ts`. Use `FilterPills` (Fluent Chips) for
segmented switches — see LibraryScreen.

**Which components touch FocusZone** (checked against the installed sources):

| Component | Mounts FocusZone on Android? | Safe to use? |
|---|---|---|
| `TabList` / `Tab` | Yes — unguarded container slot | **No** — not exported |
| `ContextualMenu` | Yes — unguarded `focusZone` slot | **No** — not exported |
| `Menu` / `MenuGroup` | No — guarded to `win32`, falls back to `Fragment` | Yes |
| `RadioGroup` | No — guarded to `macos`/`win32` | Yes |

If you add a Fluent component later, grep its `src/` for `FocusZone` before
using it, and check whether the usage is platform-guarded.

This is the same failure `Button.customize()` triggers (gotcha 4g): anything
that pulls in the uncompressed slot tree can reach FocusZone.

**5. Fluent's peer deps understate what it supports.**

The packages declare `react-native: ^0.81.6`; this app runs RN 0.83.2, so they
were installed with `--legacy-peer-deps`. This is safe here because the
components are **pure JavaScript** — no iOS/Android native code, and no deep
`react-native/Libraries/*` imports in shipped code (only in test files, which
Metro never bundles). Re-check that if you add more Fluent packages.

Use `npm install --legacy-peer-deps` for any future install in this project.

## What is real Fluent vs. built here

Microsoft ships no Card, Dialog, Slider or list-row for React Native. Those four
are implemented in this folder against Fluent's own alias tokens, so they restyle
themselves along with everything else if the brand ramp changes.

Everything else — Button, Input, Menu, Popover, Tooltip, Avatar, Badge, Chip,
Switch, Checkbox, RadioGroup, Drawer, Notification, TabList, Spinner, Shimmer,
Persona, Divider — is Microsoft's code.

## Colors

The theme lives in `src/theme/fluent.ts` and currently uses Fluent's stock
Communication Blue ramp (`#0F6CBD`). The app's original brand palette
(navy `#0B1D3A`, blue `#0F8FCF`, gold `#D4A04C`) still lives in
`src/constants/colors.ts` and is untouched — switching to it is a change in one
file. See the comment at the top of `src/theme/fluent.ts`.

Inside a component, read colors from the theme, never as hex:

```tsx
const colors = useFluentColors();
<View style={{ backgroundColor: colors.neutralBackground1 }} />
```

There are ~155 alias tokens (`neutralForeground1`, `brandBackground`,
`dangerForeground1`, plus `...Hover` / `...Pressed` / `...Disabled` variants).

## Icons — never import the upstream package

**Do not** `import ... from '@fluentui/react-native-icons'`. That package has a
single barrel entry point and Metro does not tree-shake, so importing one icon
pulls in all ~10,000. Measured on this app: **32MB vs 5.2MB** of Hermes
bytecode — a 27MB penalty for five icons.

Import from the local generated module instead:

```tsx
import { Play24Filled, ChevronRight20Regular } from '../components/fluent';

<Play24Filled color={colors.brandForeground1} />
```

These are the real Fluent icons — the generator copies their SVG source out of
the package — just limited to the ones this app uses (see icons.manifest.json).

**To add an icon:**

1. Add its name to `icons.manifest.json` (`{Name}{Size}{Regular|Filled}`, e.g.
   `Bookmark24Filled`; sizes 12/16/20/24/28/32/48).
2. Run `npm run gen:icons`.
3. Commit both the manifest and the regenerated `icons.tsx`.

The generator fails loudly on a name that doesn't exist, so a typo won't slip
through. Browse names at <https://github.com/microsoft/fluentui-system-icons>.

`@fluentui/react-native-icons` stays in **devDependencies** — it's the source
the generator reads, never a runtime import.

## Gallery

`src/screens/dev/FluentGalleryScreen.tsx` renders every component on one page.
It is registered under `__DEV__` only, so it never ships in a release build.
Navigate to it with `navigation.navigate('FluentGallery')`.
