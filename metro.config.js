// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

/**
 * Fluent UI dev-build fix.
 *
 * Fluent's packages resolve to their TypeScript source under Metro, and that
 * source declares `@jsxImportSource @fluentui-react-native/framework-base`.
 * In development Babel requests `<source>/jsx-dev-runtime`, which
 * framework-base does not expose in its `exports` map — only "./jsx-runtime".
 * Production builds work; `expo start` fails to resolve.
 *
 * Point that one specifier at a local shim that supplies `jsxDEV`.
 * See shims/fluent-jsx-dev-runtime.js for the full explanation.
 */
const FLUENT_JSX_DEV_RUNTIME = '@fluentui-react-native/framework-base/jsx-dev-runtime';
const FLUENT_JSX_DEV_SHIM = path.resolve(__dirname, 'shims/fluent-jsx-dev-runtime.js');

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === FLUENT_JSX_DEV_RUNTIME) {
    return { type: 'sourceFile', filePath: FLUENT_JSX_DEV_SHIM };
  }
  const next = defaultResolveRequest ?? context.resolveRequest;
  return next(context, moduleName, platform);
};

module.exports = config;
