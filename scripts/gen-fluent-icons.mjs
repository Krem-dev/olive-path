/**
 * Generates src/components/fluent/icons.tsx containing ONLY the Fluent icons
 * this app actually uses.
 *
 * WHY THIS EXISTS
 * ---------------
 * `@fluentui/react-native-icons` exposes a single barrel entry point (its
 * package.json `exports` map has only "."), and Metro does not tree-shake.
 * Importing even one icon from it therefore pulls in all ~10,000 icon
 * components — measured at +27MB of Hermes bytecode (32MB vs 5.2MB).
 *
 * This script copies the handful of icon components we need out of the
 * package's chunk files into a local, self-contained module, so the barrel is
 * never imported and the bundle stays small.
 *
 * USAGE
 *   node scripts/gen-fluent-icons.mjs
 *
 * To add an icon: add its name to icons.manifest.json, re-run, commit both.
 * Names follow Fluent's convention: {Name}{Size}{Regular|Filled}
 * e.g. Play24Filled, ChevronRight20Regular. Browse names at
 * https://github.com/microsoft/fluentui-system-icons
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'node_modules', '@fluentui', 'react-native-icons', 'lib');
const MANIFEST = join(ROOT, 'src', 'components', 'fluent', 'icons.manifest.json');
const OUT = join(ROOT, 'src', 'components', 'fluent', 'icons.tsx');

const wanted = JSON.parse(readFileSync(MANIFEST, 'utf8')).icons;

// Gather every chunk file that could hold an icon definition.
const sources = [];
for (const sub of ['sizedIcons', 'icons']) {
  const dir = join(PKG, sub);
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.js') && !f.endsWith('.map')) {
      sources.push(readFileSync(join(dir, f), 'utf8'));
    }
  }
}

/** Pulls `const <name>Icon = props => { ... };` out of a chunk. */
function extractComponent(src, iconName) {
  const marker = `const ${iconName}Icon = props => {`;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  // Walk braces from the opening `{` of the arrow body to find its end.
  let i = src.indexOf('{', start + marker.length - 1);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        return src.slice(start, i + 1) + ';';
      }
    }
  }
  return null;
}

const found = [];
const missing = [];

for (const name of wanted) {
  let hit = null;
  for (const src of sources) {
    const body = extractComponent(src, name);
    if (body) {
      hit = body;
      break;
    }
  }
  if (hit) found.push({ name, body: hit });
  else missing.push(name);
}

if (missing.length) {
  console.error(`\n✖ Not found in @fluentui/react-native-icons:\n   ${missing.join('\n   ')}`);
  console.error('  Check the exact spelling, including size and Regular/Filled.\n');
  process.exit(1);
}

const header = `/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Regenerate with:  node scripts/gen-fluent-icons.mjs
 * Add icons in:     src/components/fluent/icons.manifest.json
 *
 * Contains only the Fluent icons this app uses. Importing from
 * '@fluentui/react-native-icons' directly would add ~27MB to the bundle,
 * because that package is one barrel and Metro does not tree-shake.
 * See scripts/gen-fluent-icons.mjs for the full explanation.
 */

/* eslint-disable */
import * as React from 'react';
import { Svg, Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export type FluentIconProps = SvgProps & {
  /** Icon color. Alias for react-native-svg's \`fill\`. */
  color?: string;
  title?: string;
  primaryFill?: string;
};

/** Local copy of the package's wrapIcon + useIconState. */
function wrapIcon(
  Icon: (props: any) => React.JSX.Element,
  displayName: string,
): React.FC<FluentIconProps> {
  const Wrapped: React.FC<FluentIconProps> = (props) => {
    const { title, primaryFill, color, ...rest } = props;
    const state: Record<string, unknown> = {
      ...rest,
      fill: color ?? primaryFill ?? 'currentColor',
    };
    if (title) {
      state['aria-label'] = title;
      state['role'] = 'img';
    } else {
      state['aria-hidden'] = true;
    }
    return <Icon {...state} />;
  };
  Wrapped.displayName = displayName;
  return Wrapped;
}

`;

const bodies = found
  .map(({ name, body }) => {
    const typed = body.replace(
      `const ${name}Icon = props => {`,
      `const ${name}Icon = (props: any): React.JSX.Element => {`,
    );
    return `${typed}\nexport const ${name} = wrapIcon(${name}Icon, '${name}');`;
  })
  .join('\n\n');

writeFileSync(OUT, header + bodies + '\n');

console.log(`✔ Generated ${found.length} icons → src/components/fluent/icons.tsx`);
