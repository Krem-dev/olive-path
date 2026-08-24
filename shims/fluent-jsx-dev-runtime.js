/**
 * Dev-mode JSX runtime shim for Fluent UI.
 *
 * WHY THIS EXISTS
 * ---------------
 * Fluent's packages resolve to their TypeScript *source* under Metro — their
 * `exports` maps carry a "react-native" condition pointing at `./src/index.ts`
 * rather than the precompiled `./lib`. Those source files open with:
 *
 *     /** @jsxImportSource @fluentui-react-native/framework-base *\/
 *
 * Babel's automatic JSX runtime turns that into an import of
 * `<source>/jsx-runtime` in production, but `<source>/jsx-dev-runtime` in
 * development. `@fluentui-react-native/framework-base` only lists
 * "./jsx-runtime" in its `exports` map — there is no "./jsx-dev-runtime" — so
 * dev builds fail to resolve while production builds work fine.
 *
 * Aliasing straight to their `jsx-runtime` is not enough: it exports only
 * `jsx`, `jsxs` and `Fragment`, while the dev transform calls `jsxDEV()`.
 * This shim adds that missing entry point, delegating to Fluent's real
 * implementations so their slot/composition system still runs.
 *
 * Wired up in metro.config.js. Remove both once framework-base ships a
 * "./jsx-dev-runtime" entry in its exports map.
 */

const { jsx, jsxs, Fragment } = require('@fluentui-react-native/framework-base/jsx-runtime');

/**
 * React's dev-runtime signature is
 *   jsxDEV(type, props, key, isStaticChildren, source, self)
 * The trailing debug args carry no runtime behaviour, so they are dropped.
 */
function jsxDEV(type, props, key, isStaticChildren) {
  return isStaticChildren ? jsxs(type, props, key) : jsx(type, props, key);
}

module.exports = { jsx, jsxs, jsxDEV, Fragment };
