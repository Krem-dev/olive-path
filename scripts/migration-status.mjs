/**
 * Reports how far the Fluent UI migration has progressed.
 *
 * A file counts as migrated when it no longer imports Ionicons
 * (@expo/vector-icons) and no longer imports the legacy design constants
 * (src/constants), which together are what the Fluent layer replaces.
 *
 * Usage: node scripts/migration-status.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const files = walk(SRC)
  // The generated icon module and the Fluent layer itself are not migration targets.
  .filter((f) => !f.includes('components/fluent/'))
  .sort();

const rows = files.map((f) => {
  const src = readFileSync(f, 'utf8');
  // A file may keep Ionicons for something Fluent genuinely does not provide
  // (third-party brand logos). Such files opt out explicitly.
  const exempt = /fluent-migration-exempt/.test(src);
  const ionicons = /@expo\/vector-icons/.test(src) && !exempt;
  const legacy = /from '(\.\.\/)+constants'/.test(src);
  return { file: relative(SRC, f), ionicons, legacy, exempt, done: !ionicons && !legacy };
});

const done = rows.filter((r) => r.done);
const todo = rows.filter((r) => !r.done);

console.log(`\nFluent migration: ${done.length}/${rows.length} files\n`);

const exemptions = rows.filter((r) => r.exempt);
if (exemptions.length) {
  console.log('Partial by design (Fluent has no equivalent):');
  for (const r of exemptions) console.log(`  ${r.file}  — brand logos`);
  console.log('');
}

if (todo.length) {
  console.log('Remaining:');
  for (const r of todo) {
    const flags = [r.ionicons && 'ionicons', r.legacy && 'legacy-constants']
      .filter(Boolean)
      .join(', ');
    console.log(`  ${r.file.padEnd(48)} ${flags}`);
  }
} else {
  console.log('All files migrated.');
}
console.log('');
