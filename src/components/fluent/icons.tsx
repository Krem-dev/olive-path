/**
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
  /** Icon color. Alias for react-native-svg's `fill`. */
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

const Add24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 3.25c.41 0 .75.34.75.75v7.25H20a.75.75 0 0 1 0 1.5h-7.25V20a.75.75 0 0 1-1.5 0v-7.25H4a.75.75 0 0 1 0-1.5h7.25V4c0-.41.34-.75.75-.75"
  }));
  ;
};
export const Add24Regular = wrapIcon(Add24RegularIcon, 'Add24Regular');

const Alert24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a7.5 7.5 0 0 1 7.5 7.25v4.35l1.38 3.15a1.25 1.25 0 0 1-1.15 1.75H15a3 3 0 0 1-6 .18v-.18H4.27a1.25 1.25 0 0 1-1.14-1.75L4.5 13.6V9.5C4.5 5.35 7.85 2 12 2m1.5 16.5h-3a1.5 1.5 0 0 0 3 .15zM12 3.5c-3.32 0-6 2.67-6 6v4.4L4.66 17h14.7L18 13.9V9.29a6 6 0 0 0-6-5.78"
  }));
  ;
};
export const Alert24Regular = wrapIcon(Alert24RegularIcon, 'Alert24Regular');

const AlertOff24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "m5.22 6.28-3-3a.75.75 0 0 1 1.06-1.06l18.5 18.5a.75.75 0 1 1-1.06 1.06l-3.28-3.28H15a3 3 0 0 1-6 .18v-.18H4.27a1.25 1.25 0 0 1-1.14-1.75L4.5 13.6V9.5q.01-1.74.72-3.21M15.94 17 6.36 7.43A6 6 0 0 0 6 9.5v4.4L4.66 17zm-2.44 1.5h-3a1.5 1.5 0 0 0 3 .15zm4.5-4.6.7 1.63 2.2 2.18a1.3 1.3 0 0 0-.02-.96l-1.38-3.16V9.25A7.5 7.5 0 0 0 7.04 3.86l1.07 1.06A5.99 5.99 0 0 1 18 9.28v4.63"
  }));
  ;
};
export const AlertOff24Regular = wrapIcon(AlertOff24RegularIcon, 'AlertOff24Regular');

const ArrowDownload24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M13 3a1 1 0 1 0-2 0v12.09l-3.3-3.3a1 1 0 0 0-1.4 1.42l5 5a1 1 0 0 0 1.4 0l5-5a1 1 0 0 0-1.4-1.42L13 15.1zM5 20a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z"
  }));
  ;
};
export const ArrowDownload24Filled = wrapIcon(ArrowDownload24FilledIcon, 'ArrowDownload24Filled');

const ArrowDownload24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M18.25 20.5a.75.75 0 1 1 0 1.5h-13a.75.75 0 1 1 0-1.5zm-6.6-18.49h.1c.38 0 .7.28.74.64l.01.1v13.7l3.72-3.73a.75.75 0 0 1 .98-.07l.08.07c.27.27.3.68.07.98l-.07.08-5 5a.75.75 0 0 1-.97.07l-.09-.07-5-5a.75.75 0 0 1 .98-1.13l.08.07L11 16.43V2.76c0-.38.28-.7.65-.75h.1z"
  }));
  ;
};
export const ArrowDownload24Regular = wrapIcon(ArrowDownload24RegularIcon, 'ArrowDownload24Regular');

const ArrowLeft24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M10.73 19.8a.75.75 0 0 0 1.04-1.1l-6.25-5.95h14.73a.75.75 0 0 0 0-1.5H5.52l6.25-5.95a.75.75 0 0 0-1.04-1.1l-7.42 7.08a1 1 0 0 0 0 1.44z"
  }));
  ;
};
export const ArrowLeft24Regular = wrapIcon(ArrowLeft24RegularIcon, 'ArrowLeft24Regular');

const ArrowRight24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M13.27 4.2a.75.75 0 0 0-1.04 1.1l6.25 5.95H3.75a.75.75 0 0 0 0 1.5h14.73l-6.25 5.95a.75.75 0 0 0 1.04 1.1l7.42-7.08a1 1 0 0 0 0-1.44z"
  }));
  ;
};
export const ArrowRight24Regular = wrapIcon(ArrowRight24RegularIcon, 'ArrowRight24Regular');

const BookOpen16RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2.5 2C1.67 2 1 2.67 1 3.5v9c0 .83.67 1.5 1.5 1.5H6c.82 0 1.54-.4 2-1 .46.6 1.18 1 2 1h3.5c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5H10c-.82 0-1.54.4-2 1a2.5 2.5 0 0 0-2-1zm5 2.5v7c0 .83-.67 1.5-1.5 1.5H2.5a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5H6c.83 0 1.5.67 1.5 1.5m1 7v-7c0-.83.67-1.5 1.5-1.5h3.5c.28 0 .5.22.5.5v9a.5.5 0 0 1-.5.5H10a1.5 1.5 0 0 1-1.5-1.5"
  }));
  ;
};
export const BookOpen16Regular = wrapIcon(BookOpen16RegularIcon, 'BookOpen16Regular');

const BookOpen24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M4 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h6c.77 0 1.47-.29 2-.76.53.47 1.23.76 2 .76h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6c-.77 0-1.47.29-2 .76A3 3 0 0 0 10 4zm7 3v10a1 1 0 0 1-1 1H4V6h6a1 1 0 0 1 1 1m2 10V7a1 1 0 0 1 1-1h6v12h-6a1 1 0 0 1-1-1"
  }));
  ;
};
export const BookOpen24Filled = wrapIcon(BookOpen24FilledIcon, 'BookOpen24Filled');

const BookOpen24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 19.14c-.5.53-1.21.86-2 .86H3.75C2.78 20 2 19.22 2 18.25V5.75C2 4.78 2.78 4 3.75 4H10c.79 0 1.5.33 2 .86.5-.53 1.21-.86 2-.86h6.25c.97 0 1.75.78 1.75 1.75v12.5c0 .97-.78 1.75-1.75 1.75H14c-.79 0-1.5-.33-2-.86M3.5 5.75v12.5c0 .14.11.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25m9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25q.23-.02.25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25z"
  }));
  ;
};
export const BookOpen24Regular = wrapIcon(BookOpen24RegularIcon, 'BookOpen24Regular');

const BookOpen48RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 48,
    height: 48,
    viewBox: "0 0 48 48"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M20 8c1.6 0 3.04.72 4 1.85A5.2 5.2 0 0 1 28 8h13.25A2.75 2.75 0 0 1 44 10.75v26.5A2.75 2.75 0 0 1 41.25 40H28c-1.6 0-3.04-.72-4-1.85A5.2 5.2 0 0 1 20 40H6.75A2.75 2.75 0 0 1 4 37.25v-26.5A2.75 2.75 0 0 1 6.75 8zm2.75 26.75v-21.5A2.75 2.75 0 0 0 20 10.5H6.75a.25.25 0 0 0-.25.25v26.5c0 .14.11.25.25.25H20a2.75 2.75 0 0 0 2.75-2.75m2.5-21.5v21.5A2.75 2.75 0 0 0 28 37.5h13.25q.23-.02.25-.25v-26.5a.25.25 0 0 0-.25-.25H28a2.75 2.75 0 0 0-2.75 2.75"
  }));
  ;
};
export const BookOpen48Regular = wrapIcon(BookOpen48RegularIcon, 'BookOpen48Regular');

const Bookmark24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M6.2 21.85a.75.75 0 0 1-1.2-.6v-15C5 4.45 6.46 3 8.25 3h7.5C17.55 3 19 4.46 19 6.25v15c0 .6-.7.96-1.19.6l-5.8-4.18z"
  }));
  ;
};
export const Bookmark24Filled = wrapIcon(Bookmark24FilledIcon, 'Bookmark24Filled');

const Bookmark24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M6.2 21.85a.75.75 0 0 1-1.2-.6v-15C5 4.45 6.46 3 8.25 3h7.5C17.55 3 19 4.46 19 6.25v15c0 .6-.7.96-1.19.6l-5.8-4.18zm11.3-15.6c0-.97-.78-1.75-1.75-1.75h-7.5c-.96 0-1.75.78-1.75 1.75v13.53l5.06-3.64a.75.75 0 0 1 .88 0l5.06 3.64z"
  }));
  ;
};
export const Bookmark24Regular = wrapIcon(Bookmark24RegularIcon, 'Bookmark24Regular');

const Building24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M6.25 3.5a.75.75 0 0 0-.75.75V20.5h2v-2.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v2.75h2v-8.75a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 0-.75-.75zM9 18v2.5h2.25V18zm3.75 0v2.5H15V18zm6.5 4H4.75a.75.75 0 0 1-.75-.75v-17C4 3.01 5 2 6.25 2h8c1.24 0 2.25 1 2.25 2.25V9.5h1.25c1.24 0 2.25 1 2.25 2.25v9.5c0 .41-.34.75-.75.75M7.5 6.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0m1 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0-3.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 5.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m3.5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
  }));
  ;
};
export const Building24Regular = wrapIcon(Building24RegularIcon, 'Building24Regular');

const Calendar12RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 12,
    height: 12,
    viewBox: "0 0 12 12"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3 5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M3.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M5 5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M5.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M7 5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m-6-2A2.5 2.5 0 0 1 3.5 1h5A2.5 2.5 0 0 1 11 3.5v5A2.5 2.5 0 0 1 8.5 11h-5A2.5 2.5 0 0 1 1 8.5zM3.5 2c-.65 0-1.2.42-1.41 1H9.9c-.2-.58-.76-1-1.41-1zM10 4H2v4.5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5z"
  }));
  ;
};
export const Calendar12Regular = wrapIcon(Calendar12RegularIcon, 'Calendar12Regular');

const Calendar24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M17.75 3C19.55 3 21 4.46 21 6.25v11.5c0 1.8-1.46 3.25-3.25 3.25H6.25A3.25 3.25 0 0 1 3 17.75V6.25C3 4.45 4.46 3 6.25 3zm1.75 5.5h-15v9.25c0 .97.78 1.75 1.75 1.75h11.5c.97 0 1.75-.78 1.75-1.75zm-11.75 6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.25 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m-4.25-4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.25 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.25 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m1.5-6H6.25c-.97 0-1.75.78-1.75 1.75V7h15v-.75c0-.97-.78-1.75-1.75-1.75"
  }));
  ;
};
export const Calendar24Regular = wrapIcon(Calendar24RegularIcon, 'Calendar24Regular');

const Call24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "m7.06 2.42 1.16-.35c1.33-.4 2.74.24 3.3 1.5l.9 2a2.75 2.75 0 0 1-.63 3.15L10.3 10.1a.3.3 0 0 0-.08.16q-.07.62.85 2.24.68 1.17 1.2 1.64c.25.21.38.26.44.24l2-.61a2.75 2.75 0 0 1 3.04 1.02l1.28 1.77c.8 1.12.66 2.66-.34 3.6l-.88.85a3.8 3.8 0 0 1-3.59.89q-4.12-1.17-7.44-6.93T4.51 5.07a3.8 3.8 0 0 1 2.55-2.65m.43 1.43c-.75.23-1.33.83-1.53 1.6q-.91 3.5 2.12 8.78 3.07 5.28 6.54 6.23c.76.21 1.58.01 2.15-.53l.9-.84c.45-.43.51-1.13.15-1.64l-1.29-1.77a1.25 1.25 0 0 0-1.37-.47l-2.02.62c-1.17.35-2.23-.6-3.37-2.57Q8.6 11.28 8.73 10.1q.08-.64.55-1.09l1.5-1.39c.38-.37.5-.94.28-1.43l-.9-2c-.26-.58-.9-.87-1.5-.69z"
  }));
  ;
};
export const Call24Regular = wrapIcon(Call24RegularIcon, 'Call24Regular');

const Cart24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2.5 4.25c0-.41.34-.75.75-.75h.56c.95 0 1.52.64 1.84 1.23.22.4.38.86.5 1.27h12.6c.83 0 1.43.8 1.2 1.6L18.12 14a2.75 2.75 0 0 1-2.64 2H9.53a2.75 2.75 0 0 1-2.65-2.02l-.76-2.78-1.26-4.24v-.01c-.16-.57-.3-1.1-.52-1.5C4.13 5.07 3.96 5 3.8 5h-.56a.75.75 0 0 1-.75-.75m5.07 6.59.75 2.74c.15.54.65.92 1.21.92h5.95c.56 0 1.05-.37 1.2-.9l1.74-6.1H6.59l.97 3.29zM11 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-1.5 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0m8.5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-1.5 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"
  }));
  ;
};
export const Cart24Regular = wrapIcon(Cart24RegularIcon, 'Cart24Regular');

const ChatMultiple24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M9.5 3a7.5 7.5 0 0 0-6.8 10.67 68 68 0 0 0-.68 3.15 1 1 0 0 0 1.15 1.17c.63-.11 1.98-.36 3.24-.65q1.43.64 3.09.66a7.5 7.5 0 0 0 0-15m-.04 16a7.5 7.5 0 0 0 8.19 1.34c1.04.24 2.19.48 2.91.64.9.18 1.67-.62 1.47-1.5-.16-.7-.42-1.8-.67-2.8q.69-1.47.7-3.18a7.5 7.5 0 0 0-5.04-7.09q.53.96.8 2.05a6 6 0 0 1 2.08 7.79l-.13.25.07.28c.23.9.46 1.9.64 2.65l-2.74-.61-.26-.07-.25.13a6 6 0 0 1-5.59-.14 9 9 0 0 1-2.18.26"
  }));
  ;
};
export const ChatMultiple24Filled = wrapIcon(ChatMultiple24FilledIcon, 'ChatMultiple24Filled');

const ChatMultiple24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M9.56 3a7.5 7.5 0 0 0-6.8 10.67l-.72 2.84c-.23.92.59 1.75 1.5 1.53l2.93-.7q1.44.64 3.1.66a7.5 7.5 0 0 0 0-15m-6 7.5a6 6 0 1 1 3.33 5.37l-.24-.12-.27.07-2.78.66.69-2.7.07-.28-.13-.25a6 6 0 0 1-.67-2.75m11 10.5a7.5 7.5 0 0 1-5.1-2 8 8 0 0 0 2.18-.26 6 6 0 0 0 5.6.13l.24-.12.26.07c.92.22 1.96.44 2.74.6-.18-.74-.41-1.75-.64-2.64l-.07-.28.13-.25a5.97 5.97 0 0 0-2.09-7.8 8 8 0 0 0-.8-2.04 7.5 7.5 0 0 1 4.35 10.26l.67 2.8c.2.9-.57 1.7-1.47 1.5-.72-.15-1.87-.39-2.91-.63q-1.43.64-3.09.66"
  }));
  ;
};
export const ChatMultiple24Regular = wrapIcon(ChatMultiple24RegularIcon, 'ChatMultiple24Regular');

const Checkmark12FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 12,
    height: 12,
    viewBox: "0 0 12 12"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M9.76 3.2c.3.29.32.76.04 1.06l-4.25 4.5a.75.75 0 0 1-1.08.02L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.7 1.7L8.7 3.24a.75.75 0 0 1 1.06-.04"
  }));
  ;
};
export const Checkmark12Filled = wrapIcon(Checkmark12FilledIcon, 'Checkmark12Filled');

const Checkmark20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3.37 10.17a.5.5 0 0 0-.74.66l4 4.5c.19.22.52.23.72.02l10.5-10.5a.5.5 0 0 0-.7-.7L7.02 14.27z"
  }));
  ;
};
export const Checkmark20Regular = wrapIcon(Checkmark20RegularIcon, 'Checkmark20Regular');

const Checkmark24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5c.3.3.77.3 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94z"
  }));
  ;
};
export const Checkmark24Regular = wrapIcon(Checkmark24RegularIcon, 'Checkmark24Regular');

const CheckmarkCircle16FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m9.85-1.15a.5.5 0 0 0-.7-.7l-2.9 2.9-1.4-1.4a.5.5 0 1 0-.7.7L6.9 10.1c.2.2.5.2.7 0z"
  }));
  ;
};
export const CheckmarkCircle16Filled = wrapIcon(CheckmarkCircle16FilledIcon, 'CheckmarkCircle16Filled');

const CheckmarkCircle24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m3.22 6.97-4.47 4.47-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5c.3.3.77.3 1.06 0l5-5a.75.75 0 1 0-1.06-1.06"
  }));
  ;
};
export const CheckmarkCircle24Filled = wrapIcon(CheckmarkCircle24FilledIcon, 'CheckmarkCircle24Filled');

const CheckmarkCircle24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m-1.25 9.94 4.47-4.47a.75.75 0 0 1 1.13.98l-.07.08-5 5a.75.75 0 0 1-.98.07l-.08-.07-2.5-2.5a.75.75 0 0 1 .98-1.13l.08.07zl4.47-4.47z"
  }));
  ;
};
export const CheckmarkCircle24Regular = wrapIcon(CheckmarkCircle24RegularIcon, 'CheckmarkCircle24Regular');

const CheckmarkCircle48FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 48,
    height: 48,
    viewBox: "0 0 48 48"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M24 4a20 20 0 1 1 0 40 20 20 0 0 1 0-40m8.63 13.62a1.25 1.25 0 0 0-1.66-.1l-.1.1-10.12 10.11-3.62-3.61a1.25 1.25 0 0 0-1.85 1.66l.09.1 4.5 4.5c.45.46 1.17.49 1.66.1l.1-.1 11-11c.5-.48.5-1.28 0-1.76"
  }));
  ;
};
export const CheckmarkCircle48Filled = wrapIcon(CheckmarkCircle48FilledIcon, 'CheckmarkCircle48Filled');

const ChevronDown20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0"
  }));
  ;
};
export const ChevronDown20Regular = wrapIcon(ChevronDown20RegularIcon, 'ChevronDown20Regular');

const ChevronLeft20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12.35 15.85a.5.5 0 0 1-.7 0L6.16 10.4a.55.55 0 0 1 0-.78l5.49-5.46a.5.5 0 1 1 .7.7L7.2 10l5.16 5.15c.2.2.2.5 0 .7"
  }));
  ;
};
export const ChevronLeft20Regular = wrapIcon(ChevronLeft20RegularIcon, 'ChevronLeft20Regular');

const ChevronLeft24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M15.53 4.22c.3.3.3.77 0 1.06L8.81 12l6.72 6.72a.75.75 0 1 1-1.06 1.06l-7.25-7.25a.75.75 0 0 1 0-1.06l7.25-7.25c.3-.3.77-.3 1.06 0"
  }));
  ;
};
export const ChevronLeft24Regular = wrapIcon(ChevronLeft24RegularIcon, 'ChevronLeft24Regular');

const ChevronRight20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.47a.5.5 0 0 1-.7-.71L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7"
  }));
  ;
};
export const ChevronRight20Regular = wrapIcon(ChevronRight20RegularIcon, 'ChevronRight20Regular');

const Clock16RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1m0 3.5a.5.5 0 0 0-1 0v4c0 .28.22.5.5.5h3a.5.5 0 0 0 0-1H8z"
  }));
  ;
};
export const Clock16Regular = wrapIcon(Clock16RegularIcon, 'Clock16Regular');

const Clock24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 4.65a.75.75 0 0 0-1.5.1v6.1c.06.37.37.65.75.65h4.1a.75.75 0 0 0-.1-1.5H12V6.65"
  }));
  ;
};
export const Clock24Regular = wrapIcon(Clock24RegularIcon, 'Clock24Regular');

const CompassNorthwest24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20M8.56 7.43a.88.88 0 0 0-1.13 1.13l1.5 3.97a4.4 4.4 0 0 0 2.54 2.53l3.97 1.5a.88.88 0 0 0 1.13-1.12l-1.51-3.96a4.4 4.4 0 0 0-2.53-2.54z"
  }));
  ;
};
export const CompassNorthwest24Filled = wrapIcon(CompassNorthwest24FilledIcon, 'CompassNorthwest24Filled');

const CompassNorthwest24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M7.08 8.7c-.4-1.01.6-2.02 1.63-1.62l.2.09 3.75 1.42a4.8 4.8 0 0 1 2.75 2.75l.16.43 1.63 3.79a1.25 1.25 0 0 1-1.64 1.64l-3.76-1.61-.46-.18a4.8 4.8 0 0 1-2.75-2.75L7.21 9.03zm3 3.48c.32.8.95 1.44 1.74 1.78l.52.23 2.98 1.13-1.14-3-.22-.5a3.3 3.3 0 0 0-1.78-1.74L8.7 8.7z"
  }));
  ;
};
export const CompassNorthwest24Regular = wrapIcon(CompassNorthwest24RegularIcon, 'CompassNorthwest24Regular');

const Dismiss20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "m4.09 4.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07z"
  }));
  ;
};
export const Dismiss20Regular = wrapIcon(Dismiss20RegularIcon, 'Dismiss20Regular');

const Dismiss24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "m4.4 4.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 0 1-.07-.98l.07-.08z"
  }));
  ;
};
export const Dismiss24Regular = wrapIcon(Dismiss24RegularIcon, 'Dismiss24Regular');

const ErrorCircle24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m0 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2M12 7c.37 0 .69.28.74.65v4.6a.75.75 0 0 1-1.48.1l-.01-.1v-4.5c0-.41.33-.75.74-.75"
  }));
  ;
};
export const ErrorCircle24Regular = wrapIcon(ErrorCircle24RegularIcon, 'ErrorCircle24Regular');

const Eye20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3.26 11.6A7 7 0 0 1 10 6c3.2 0 6.06 2.33 6.74 5.6a.5.5 0 0 0 .98-.2A8 8 0 0 0 10 5a8 8 0 0 0-7.72 6.4.5.5 0 0 0 .98.2M10 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7m-2.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0"
  }));
  ;
};
export const Eye20Regular = wrapIcon(Eye20RegularIcon, 'Eye20Regular');

const Eye24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0-5a10 10 0 0 1 9.7 7.56.75.75 0 1 1-1.45.37 8.5 8.5 0 0 0-16.5 0 .75.75 0 0 1-1.45-.36A10 10 0 0 1 12 5.5"
  }));
  ;
};
export const Eye24Regular = wrapIcon(Eye24RegularIcon, 'Eye24Regular');

const EyeOff20RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2.85 2.15a.5.5 0 1 0-.7.7l3.5 3.5a8 8 0 0 0-3.37 5.05.5.5 0 1 0 .98.2 7 7 0 0 1 3.1-4.53l1.6 1.59a3.5 3.5 0 1 0 4.88 4.89l4.3 4.3a.5.5 0 0 0 .71-.7zm9.27 10.68a2.5 2.5 0 1 1-3.45-3.45zm-2-4.83 3.38 3.38A3.5 3.5 0 0 0 10.12 8M10 6q-.86 0-1.67.21l-.8-.8A8 8 0 0 1 10 5c3.7 0 6.94 2.67 7.72 6.4a.5.5 0 0 1-.98.2A7 7 0 0 0 10 6"
  }));
  ;
};
export const EyeOff20Regular = wrapIcon(EyeOff20RegularIcon, 'EyeOff20Regular');

const EyeOff24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2.22 2.22a.75.75 0 0 0-.07.98l.07.08 4.03 4.03a10 10 0 0 0-3.95 5.75.75.75 0 0 0 1.45.37 8.5 8.5 0 0 1 3.58-5.04l1.81 1.81A3.99 3.99 0 0 0 12 17c1.09 0 2.08-.43 2.8-1.14l5.92 5.92a.75.75 0 0 0 1.13-.98l-.07-.08-6.11-6.11-1.2-1.2-2.87-2.87-2.88-2.88-1.13-1.13-4.31-4.31a.75.75 0 0 0-1.06 0m7.98 9.05 3.54 3.53A2.5 2.5 0 0 1 9.5 13c0-.67.27-1.28.7-1.73M12 5.5a10 10 0 0 0-2.89.42l1.24 1.24a8.5 8.5 0 0 1 9.9 6.27.75.75 0 0 0 1.45-.36A10 10 0 0 0 12 5.5m.2 3.5 3.8 3.81a4 4 0 0 0-3.8-3.8"
  }));
  ;
};
export const EyeOff24Regular = wrapIcon(EyeOff24RegularIcon, 'EyeOff24Regular');

const Flash16FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.87 1a1 1 0 0 0-.96.71L3.03 8.04c-.14.48.22.96.72.96h1.58l-1.28 4.39c-.38 1.31 1.33 2.2 2.18 1.13l6.6-8.3A.75.75 0 0 0 12.26 5h-2.03l1-2.65A1 1 0 0 0 10.27 1z"
  }));
  ;
};
export const Flash16Filled = wrapIcon(Flash16FilledIcon, 'Flash16Filled');

const Flash24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M7.43 2.83C7.6 2.33 8.07 2 8.6 2h6.46c.85 0 1.45.84 1.18 1.65L14.8 8h3.96c1.1 0 1.67 1.33.9 2.12L8.59 21.54c-1.06 1.08-2.88.1-2.55-1.38l1.27-5.66-1.56-.01c-1.21 0-2.05-1.2-1.65-2.34z"
  }));
  ;
};
export const Flash24Filled = wrapIcon(Flash24FilledIcon, 'Flash24Filled');

const Globe24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m2.94 14.5H9.06c.65 2.41 1.79 4 2.94 4s2.29-1.59 2.94-4m-7.43 0H4.79a8.5 8.5 0 0 0 4.09 3.41q-.79-1.25-1.27-3.02zm11.7 0H16.5c-.32 1.33-.79 2.5-1.37 3.41a8.5 8.5 0 0 0 3.9-3.13zM7.1 10H3.74v.02a8.5 8.5 0 0 0 .3 4.98h3.18a20 20 0 0 1-.13-5m8.3 0H8.6a19 19 0 0 0 .14 5h6.52a19 19 0 0 0 .14-5m4.87 0h-3.35a21 21 0 0 1-.13 5h3.18a8.5 8.5 0 0 0 .3-5M8.88 4.09h-.02a8.5 8.5 0 0 0-4.61 4.4l3.05.01c.31-1.75.86-3.28 1.58-4.41m3.12-.6-.12.01c-1.26.12-2.48 2.12-3.05 5h6.34c-.56-2.87-1.78-4.87-3.04-5zm3.12.6.1.17A13 13 0 0 1 16.7 8.5h3.05a8.5 8.5 0 0 0-4.34-4.29z"
  }));
  ;
};
export const Globe24Regular = wrapIcon(Globe24RegularIcon, 'Globe24Regular');

const Headphones24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 0 1 10 10v7a3 3 0 0 1-3 3h-3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h4.5v-2a8.5 8.5 0 0 0-17 0v2H8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3v-7A10 10 0 0 1 12 2"
  }));
  ;
};
export const Headphones24Filled = wrapIcon(Headphones24FilledIcon, 'Headphones24Filled');

const Headphones48RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 48,
    height: 48,
    viewBox: "0 0 48 48"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M24 6.5A17.5 17.5 0 0 0 6.5 24v4h9.25c.69 0 1.25.56 1.25 1.25v13.5c0 .69-.56 1.25-1.25 1.25h-6A5.75 5.75 0 0 1 4 38.25V24a20 20 0 1 1 40 0v14.25A5.75 5.75 0 0 1 38.25 44h-6c-.69 0-1.25-.56-1.25-1.25v-13.5c0-.69.56-1.25 1.25-1.25h9.25v-4A17.5 17.5 0 0 0 24 6.5m17.5 24h-8v11h4.75c1.8 0 3.25-1.46 3.25-3.25zm-35 0v7.75c0 1.8 1.46 3.25 3.25 3.25h4.75v-11z"
  }));
  ;
};
export const Headphones48Regular = wrapIcon(Headphones48RegularIcon, 'Headphones48Regular');

const Heart24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12.82 5.58 12 6.4l-.82-.82a5.37 5.37 0 1 0-7.6 7.6l7.89 7.9c.3.29.77.29 1.06 0l7.9-7.9a5.38 5.38 0 1 0-7.61-7.6"
  }));
  ;
};
export const Heart24Filled = wrapIcon(Heart24FilledIcon, 'Heart24Filled');

const Heart24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12.82 5.58 12 6.4l-.82-.82a5.37 5.37 0 1 0-7.6 7.6l7.89 7.9c.3.29.77.29 1.06 0l7.9-7.9a5.38 5.38 0 1 0-7.61-7.6m6.55 6.54L12 19.48l-7.36-7.36a3.87 3.87 0 1 1 5.48-5.48L11.47 8c.3.3.79.29 1.08-.02l1.33-1.34a3.88 3.88 0 0 1 5.49 5.48"
  }));
  ;
};
export const Heart24Regular = wrapIcon(Heart24RegularIcon, 'Heart24Regular');

const Home24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M13.45 2.53c-.84-.7-2.06-.7-2.9 0L3.8 8.23c-.5.43-.8 1.05-.8 1.72v9.3c0 .97.78 1.75 1.75 1.75h3c.97 0 1.75-.78 1.75-1.75v-4c0-.68.54-1.23 1.22-1.25h2.56c.68.02 1.22.57 1.22 1.25v4c0 .97.78 1.75 1.75 1.75h3c.97 0 1.75-.78 1.75-1.75v-9.3c0-.67-.3-1.3-.8-1.72z"
  }));
  ;
};
export const Home24Filled = wrapIcon(Home24FilledIcon, 'Home24Filled');

const Home24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M10.55 2.53c.84-.7 2.06-.7 2.9 0l6.75 5.7c.5.42.8 1.05.8 1.71v9.31c0 .97-.78 1.75-1.75 1.75h-3.5c-.97 0-1.75-.78-1.75-1.75v-5a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25v5c0 .97-.78 1.75-1.75 1.75h-3.5C3.78 21 3 20.22 3 19.25v-9.3c0-.67.3-1.3.8-1.73zm1.93 1.15a.75.75 0 0 0-.96 0l-6.75 5.7a.8.8 0 0 0-.27.56v9.31c0 .14.11.25.25.25h3.5q.23-.01.25-.25v-5c0-.97.78-1.75 1.75-1.75h3.5c.97 0 1.75.78 1.75 1.75v5q.02.23.25.25h3.5q.23-.01.25-.25v-9.3q0-.36-.27-.58z"
  }));
  ;
};
export const Home24Regular = wrapIcon(Home24RegularIcon, 'Home24Regular');

const Info24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m0 7c.41 0 .75.34.75.75v5a.75.75 0 0 1-1.5 0v-5c0-.41.34-.75.75-.75M12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
  }));
  ;
};
export const Info24Regular = wrapIcon(Info24RegularIcon, 'Info24Regular');

const LeafTwo16RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M1 3.17v3a4.17 4.17 0 0 0 5.33 4q.25.63.66 1.14L5.2 13.09a.5.5 0 0 0 .7.71l1.8-1.79A4.5 4.5 0 0 0 15 8.5V5.23C15 4.55 14.45 4 13.77 4H10.5q-.85 0-1.6.3A4.2 4.2 0 0 0 5.17 2h-3C1.52 2 1 2.52 1 3.17m7.4 8.13 2.46-2.45a.5.5 0 0 0-.71-.7L7.7 10.58A3.5 3.5 0 0 1 10.5 5h3.27q.21.02.23.23V8.5a3.5 3.5 0 0 1-5.6 2.8M5.18 3c1.24 0 2.32.72 2.84 1.76a4.5 4.5 0 0 0-1.62 1.92L4.85 5.15a.5.5 0 1 0-.7.7l1.91 1.92a5 5 0 0 0 0 1.44A3.17 3.17 0 0 1 2 6.17v-3Q2.01 3 2.17 3z"
  }));
  ;
};
export const LeafTwo16Regular = wrapIcon(LeafTwo16RegularIcon, 'LeafTwo16Regular');

const LeafTwo24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2 4.7V9a6 6 0 0 0 6.3 6q.4 1.33 1.25 2.39l-2.33 2.33a.75.75 0 0 0 1.06 1.06l2.33-2.33A7 7 0 0 0 22 13V7.75C22 6.78 21.22 6 20.25 6H15q-.87 0-1.69.2A6 6 0 0 0 8.01 3H3.7C2.77 3 2 3.76 2 4.7m9.68 12.68 4.1-4.1a.75.75 0 0 0-1.06-1.06l-4.1 4.1A5.5 5.5 0 0 1 15 7.5h5.25q.23.01.25.25V13a5.5 5.5 0 0 1-8.82 4.38M8 4.5c1.66 0 3.1.9 3.89 2.23a7 7 0 0 0-2.71 2.39l-1.9-1.9a.75.75 0 0 0-1.06 1.06l2.24 2.24a7 7 0 0 0-.44 2.98H8A4.5 4.5 0 0 1 3.5 9V4.7c0-.1.1-.2.2-.2z"
  }));
  ;
};
export const LeafTwo24Regular = wrapIcon(LeafTwo24RegularIcon, 'LeafTwo24Regular');

const LeafTwo48RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 48,
    height: 48,
    viewBox: "0 0 48 48"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M16.5 6a12.5 12.5 0 0 1 11.35 7.26Q29.14 13 30.5 13h9.25C42.1 13 44 14.9 44 17.25v9.25a13.5 13.5 0 0 1-22.12 10.39l-4.75 4.74a1.25 1.25 0 0 1-1.76-1.76l4.74-4.75a14 14 0 0 1-2.36-4.18q-.62.06-1.25.06C9.6 31 4 25.4 4 18.5v-8.25C4 7.9 5.9 6 8.25 6zm7.16 29.11A11 11 0 0 0 41.5 26.5v-9.25c0-.97-.78-1.75-1.75-1.75H30.5a11 11 0 0 0-8.61 17.84l8.98-8.98a1.25 1.25 0 0 1 1.77 1.77zM16.5 28.5q.33 0 .64-.02a13.6 13.6 0 0 1 .75-6.82l-6.52-6.53a1.25 1.25 0 0 1 1.76-1.77l5.95 5.94A13.6 13.6 0 0 1 25.43 14 10 10 0 0 0 16.5 8.5H8.25c-.97 0-1.75.78-1.75 1.75v8.25a10 10 0 0 0 10 10"
  }));
  ;
};
export const LeafTwo48Regular = wrapIcon(LeafTwo48RegularIcon, 'LeafTwo48Regular');

const Library24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.5 3C6.33 3 7 3.67 7 4.5v15c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 2 19.5v-15C2 3.67 2.67 3 3.5 3zm6 0c.83 0 1.5.67 1.5 1.5v15c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 8 19.5v-15C8 3.67 8.67 3 9.5 3zm7.28 3.12L22 18.64c.2.8-.28 1.62-1.09 1.83l-1.87.48a1.5 1.5 0 0 1-1.83-1.08L14 7.35a1.5 1.5 0 0 1 1.08-1.82l1.87-.49c.8-.2 1.63.28 1.83 1.08"
  }));
  ;
};
export const Library24Filled = wrapIcon(Library24FilledIcon, 'Library24Filled');

const Library24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M4 3h1a2 2 0 0 1 2 1.85V19a2 2 0 0 1-1.85 2H4a2 2 0 0 1-2-1.85V5a2 2 0 0 1 1.85-2zh1zm6 0h1a2 2 0 0 1 2 1.85V19a2 2 0 0 1-1.85 2H10a2 2 0 0 1-2-1.85V5a2 2 0 0 1 1.85-2zh1zm6.97 2a2 2 0 0 1 1.9 1.35l.04.15 3.02 11.75a2 2 0 0 1-1.3 2.39l-.14.04-.97.25q-.26.06-.5.06a2 2 0 0 1-1.89-1.34l-.05-.16-3.01-11.74a2 2 0 0 1 1.3-2.4l.14-.04.97-.25q.24-.06.5-.06M5 4.5H4a.5.5 0 0 0-.5.41V19c0 .24.18.45.41.5H5a.5.5 0 0 0 .5-.41V5a.5.5 0 0 0-.41-.5zm6 0h-1a.5.5 0 0 0-.5.41V19c0 .24.18.45.41.5H11a.5.5 0 0 0 .5-.41V5a.5.5 0 0 0-.41-.5zm5.98 2h-.07l-.06.02-.97.24a.5.5 0 0 0-.38.51l.02.1 3.02 11.75c.06.26.3.37.48.37h.06l.06-.01.97-.25a.5.5 0 0 0 .38-.52l-.02-.09-3.01-11.74a.5.5 0 0 0-.48-.38"
  }));
  ;
};
export const Library24Regular = wrapIcon(Library24RegularIcon, 'Library24Regular');

const Location24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.84 4.57a8.7 8.7 0 0 1 12.32 12.31l-1.19 1.18q-1.31 1.29-3.4 3.3c-.88.85-2.26.85-3.13 0l-3.5-3.39-1.1-1.09a8.7 8.7 0 0 1 0-12.31M17.1 5.63a7.2 7.2 0 1 0-10.2 10.2l1.5 1.46 3.08 3c.29.28.75.28 1.04 0l3.4-3.3 1.18-1.17a7.2 7.2 0 0 0 0-10.19M12 7.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7M12 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
  }));
  ;
};
export const Location24Regular = wrapIcon(Location24RegularIcon, 'Location24Regular');

const LockClosed24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 1a5 5 0 0 1 5 5v2.01c1.68.13 3 1.53 3 3.24v7.5c0 1.8-1.46 3.25-3.25 3.25h-9.5A3.25 3.25 0 0 1 4 18.75v-7.5a3.25 3.25 0 0 1 3-3.24V6a5 5 0 0 1 5-5M7.25 9.5c-.97 0-1.75.78-1.75 1.75v7.5c0 .97.78 1.75 1.75 1.75h9.5c.97 0 1.75-.78 1.75-1.75v-7.5c0-.97-.78-1.75-1.75-1.75zM12 13.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 2.5A3.5 3.5 0 0 0 8.5 6v2h7V6A3.5 3.5 0 0 0 12 2.5"
  }));
  ;
};
export const LockClosed24Regular = wrapIcon(LockClosed24RegularIcon, 'LockClosed24Regular');

const Mail24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.25 4h13.5a3.25 3.25 0 0 1 3.24 3.07l.01.18v9.5a3.25 3.25 0 0 1-3.07 3.24l-.18.01H5.25a3.25 3.25 0 0 1-3.24-3.07L2 16.75v-9.5a3.25 3.25 0 0 1 3.07-3.24zh13.5zM20.5 9.37l-8.15 4.3q-.3.14-.6.04l-.1-.05L3.5 9.37v7.38c0 .92.7 1.67 1.6 1.74l.15.01h13.5c.92 0 1.67-.7 1.74-1.6l.01-.15zM18.75 5.5H5.25c-.92 0-1.67.7-1.74 1.6l-.01.15v.43l8.5 4.47 8.5-4.47v-.43c0-.92-.7-1.67-1.6-1.74z"
  }));
  ;
};
export const Mail24Regular = wrapIcon(Mail24RegularIcon, 'Mail24Regular');

const MailRead48RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 48,
    height: 48,
    viewBox: "0 0 48 48"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M22.3 6.92a3.8 3.8 0 0 1 3.4 0l13.76 7.04c.65.33 1.18.84 1.53 1.45L24 24.35l-16.96-9q.55-.89 1.5-1.4zM6.5 17.89l16.91 8.98c.37.2.8.2 1.17 0l16.92-8.9v15.78a3.75 3.75 0 0 1-3.75 3.75h-27.5a3.75 3.75 0 0 1-3.75-3.75zM26.85 4.7a6.3 6.3 0 0 0-5.7 0L7.4 11.73A6.3 6.3 0 0 0 4 17.3v16.45C4 37.2 6.8 40 10.25 40h27.5C41.2 40 44 37.2 44 33.75V17.3c0-2.35-1.31-4.5-3.4-5.57z"
  }));
  ;
};
export const MailRead48Regular = wrapIcon(MailRead48RegularIcon, 'MailRead48Regular');

const Mic24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M18.25 11c.38 0 .7.28.74.65l.01.1v.5a6.75 6.75 0 0 1-6.25 6.73v2.27a.75.75 0 0 1-1.5.1v-2.37A6.75 6.75 0 0 1 5 12.48v-.73a.75.75 0 0 1 1.5-.1v.6a5.25 5.25 0 0 0 5.03 5.25h.72a5.25 5.25 0 0 0 5.25-5.03v-.72c0-.41.34-.75.75-.75M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4m0 1.5A2.5 2.5 0 0 0 9.5 6v6a2.5 2.5 0 0 0 5 0V6A2.5 2.5 0 0 0 12 3.5"
  }));
  ;
};
export const Mic24Regular = wrapIcon(Mic24RegularIcon, 'Mic24Regular');

const MoreVertical24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 7.75a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m0 6a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5M10.25 18a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0"
  }));
  ;
};
export const MoreVertical24Regular = wrapIcon(MoreVertical24RegularIcon, 'MoreVertical24Regular');

const MusicNote224RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M19.7 2.15q.3.23.3.6V16.5a3.5 3.5 0 1 1-1.5-2.87V7.76L10 10.3v8.19a3.5 3.5 0 1 1-1.5-2.87V5.75c0-.33.22-.62.53-.72l10-3a.8.8 0 0 1 .67.12M10 8.75l8.5-2.56V3.76L10 6.3zM6.5 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
  }));
  ;
};
export const MusicNote224Regular = wrapIcon(MusicNote224RegularIcon, 'MusicNote224Regular');

const Pause24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.75 3C4.78 3 4 3.78 4 4.75v14.5c0 .97.78 1.75 1.75 1.75h3.5c.96 0 1.75-.78 1.75-1.75V4.75C11 3.78 10.2 3 9.25 3zm9 0C13.78 3 13 3.78 13 4.75v14.5c0 .97.78 1.75 1.75 1.75h3.5c.96 0 1.75-.78 1.75-1.75V4.75C20 3.78 19.2 3 18.25 3z"
  }));
  ;
};
export const Pause24Filled = wrapIcon(Pause24FilledIcon, 'Pause24Filled');

const Person24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M17.75 14C19 14 20 15 20 16.25v.92q-.01.88-.5 1.6Q17.13 22 12 22q-5.15 0-7.49-3.24a2.8 2.8 0 0 1-.5-1.6v-.91C4 15 5 14 6.24 14zM12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10"
  }));
  ;
};
export const Person24Filled = wrapIcon(Person24FilledIcon, 'Person24Filled');

const Person24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M17.75 14C19 14 20 15 20 16.25v.57c0 .9-.32 1.76-.9 2.44Q16.74 22.01 12 22q-4.74.01-7.1-2.74a3.8 3.8 0 0 1-.9-2.43v-.58C4 15 5.01 14 6.25 14zm0 1.5H6.25a.75.75 0 0 0-.75.75v.58c0 .53.2 1.05.54 1.46C7.3 19.76 9.26 20.5 12 20.5q4.09 0 5.96-2.21c.35-.41.54-.93.54-1.47v-.57a.75.75 0 0 0-.75-.75M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7"
  }));
  ;
};
export const Person24Regular = wrapIcon(Person24RegularIcon, 'Person24Regular');

const Play20FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M17.22 8.68a1.5 1.5 0 0 1 0 2.63l-10 5.5A1.5 1.5 0 0 1 5 15.5v-11A1.5 1.5 0 0 1 7.22 3.2z"
  }));
  ;
};
export const Play20Filled = wrapIcon(Play20FilledIcon, 'Play20Filled');

const Play24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5 5.27c0-1.7 1.83-2.79 3.33-1.97l12.36 6.72a2.25 2.25 0 0 1 0 3.96L8.33 20.7A2.25 2.25 0 0 1 5 18.73z"
  }));
  ;
};
export const Play24Filled = wrapIcon(Play24FilledIcon, 'Play24Filled');

const QuestionCircle24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.67a8.34 8.34 0 0 0 0 16.66 8.34 8.34 0 0 0 0-16.66m0 11.83a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-8.75a2.75 2.75 0 0 1 2.75 2.75c0 1.01-.3 1.57-1.05 2.36l-.17.17c-.62.62-.78.89-.78 1.47a.75.75 0 0 1-1.5 0c0-1.01.3-1.57 1.05-2.36l.17-.17c.62-.62.78-.89.78-1.47a1.25 1.25 0 0 0-2.5-.13v.13a.75.75 0 0 1-1.5 0A2.75 2.75 0 0 1 12 6.75"
  }));
  ;
};
export const QuestionCircle24Regular = wrapIcon(QuestionCircle24RegularIcon, 'QuestionCircle24Regular');

const Search24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M15.84 17.37a8 8 0 1 1 1.43-1.4l4.43 4.31a1 1 0 1 1-1.4 1.44zM17 11a6 6 0 1 0-12 0 6 6 0 0 0 12 0"
  }));
  ;
};
export const Search24Filled = wrapIcon(Search24FilledIcon, 'Search24Filled');

const Search24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M16.1 17.16a8 8 0 1 1 1.06-1.06l4.62 4.62a.75.75 0 1 1-1.06 1.06zM17.5 11a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0"
  }));
  ;
};
export const Search24Regular = wrapIcon(Search24RegularIcon, 'Search24Regular');

const Settings24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M12.01 2.25q1.11.01 2.18.25c.32.07.55.33.59.65l.17 1.53a1.38 1.38 0 0 0 1.92 1.11l1.4-.61c.3-.13.64-.06.85.17a10 10 0 0 1 2.2 3.8c.1.3 0 .63-.26.82l-1.25.92a1.38 1.38 0 0 0 0 2.22l1.25.92c.26.19.36.52.27.82a10 10 0 0 1-2.2 3.8.75.75 0 0 1-.85.17l-1.4-.62a1.38 1.38 0 0 0-1.93 1.12l-.17 1.52a.75.75 0 0 1-.58.65 9.5 9.5 0 0 1-4.4 0 .75.75 0 0 1-.57-.65l-.17-1.52a1.38 1.38 0 0 0-1.93-1.11l-1.4.62a.75.75 0 0 1-.85-.18 10 10 0 0 1-2.2-3.8c-.1-.3 0-.63.26-.82l1.25-.92a1.38 1.38 0 0 0 0-2.22l-1.24-.92a.75.75 0 0 1-.28-.82 10 10 0 0 1 2.2-3.8c.23-.23.57-.3.86-.17l1.4.62c.4.17.86.15 1.25-.08.38-.22.63-.6.68-1.04l.17-1.53a.75.75 0 0 1 .58-.65q1.08-.24 2.2-.25m0 1.5q-.67 0-1.35.12l-.11.97a2.9 2.9 0 0 1-4.03 2.33l-.9-.4A8 8 0 0 0 4.29 9.1l.8.59a2.88 2.88 0 0 1 0 4.64l-.8.59a8 8 0 0 0 1.35 2.32l.9-.4a2.88 2.88 0 0 1 4.02 2.32l.1.99q1.35.22 2.7 0l.1-.99a2.88 2.88 0 0 1 4.02-2.32l.9.4a8 8 0 0 0 1.35-2.32l-.8-.59a2.88 2.88 0 0 1 0-4.64l.8-.59a8 8 0 0 0-1.35-2.32l-.9.4q-.55.24-1.15.24c-1.47 0-2.7-1.1-2.86-2.57l-.11-.97q-.68-.11-1.34-.12M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5m0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5"
  }));
  ;
};
export const Settings24Regular = wrapIcon(Settings24RegularIcon, 'Settings24Regular');

const Share24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M10.25 3a.75.75 0 0 1 0 1.5h-3.5c-1.24 0-2.25 1-2.25 2.25v10.5l.01.23a2.25 2.25 0 0 0 2.24 2.02h10.5c1.24 0 2.25-1 2.25-2.25v-2a.75.75 0 0 1 1.5 0v2A3.75 3.75 0 0 1 17.25 21H6.75c-2 0-3.64-1.58-3.75-3.56V6.75A3.75 3.75 0 0 1 6.75 3zm4.69-.93a.8.8 0 0 1 .8.11l7 6a.75.75 0 0 1 .03 1.11l-7 6.75a.75.75 0 0 1-1.27-.54v-2.98a7 7 0 0 0-2.94.77 11.4 11.4 0 0 0-3.69 3.3l-.27.36a.75.75 0 0 1-1.35-.45c0-2.86.69-5.59 2.17-7.63a8 8 0 0 1 6.08-3.34V2.65q.07-.4.44-.58M16 6.25c0 .41-.34.75-.75.75a6.6 6.6 0 0 0-5.62 2.75 10 10 0 0 0-1.72 4.5q1.5-1.56 2.97-2.3a9 9 0 0 1 4.37-.95.75.75 0 0 1 .75.75v1.98l5.13-4.95L16 4.38z"
  }));
  ;
};
export const Share24Regular = wrapIcon(Share24RegularIcon, 'Share24Regular');

const ShareAndroid24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M17 2.5a3.5 3.5 0 1 1-2.6 5.85l-4.56 2.6a3.5 3.5 0 0 1 0 2.1l4.56 2.6A3.5 3.5 0 0 1 20.5 18a3.5 3.5 0 1 1-6.84-1.05l-4.56-2.6A3.5 3.5 0 0 1 3 12a3.5 3.5 0 0 1 6.1-2.35l4.56-2.6A3.5 3.5 0 0 1 17 2.5M17 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4M6.5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4M17 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
  }));
  ;
};
export const ShareAndroid24Regular = wrapIcon(ShareAndroid24RegularIcon, 'ShareAndroid24Regular');

const SignOut24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M8.5 11.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2M12 4.35V11h7.44l-1.72-1.72a.75.75 0 0 1-.07-.98l.07-.08a.75.75 0 0 1 .98-.07l.08.07 3 3c.26.26.29.68.07.97l-.07.09-3 3a.75.75 0 0 1-1.13-.97l.07-.09 1.71-1.72H12v6.75c0 .47-.42.82-.88.74l-8.5-1.5a.75.75 0 0 1-.62-.74v-12c0-.37.27-.68.63-.74l8.5-1.4c.46-.07.87.28.87.74m-1.5.89-7 1.15v10.73l7 1.24zM13 18.5h.87a.75.75 0 0 0 .65-.75l-.01-4.25H13zm0-8.5V5h.75c.37 0 .69.28.74.65v.1L14.5 10z"
  }));
  ;
};
export const SignOut24Regular = wrapIcon(SignOut24RegularIcon, 'SignOut24Regular');

const SkipBack1024RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2.75 2.5a.75.75 0 0 0-.75.75v5.5c0 .41.34.75.75.75h5.5a.75.75 0 0 0 0-1.5h-3.9a8.3 8.3 0 0 1 4.12-3.06A9.7 9.7 0 0 1 19.6 9.1a.75.75 0 0 0 1.32-.72A11.19 11.19 0 0 0 8.03 3.51 9.6 9.6 0 0 0 3.5 6.65v-3.4a.75.75 0 0 0-.75-.75m6.2 8.53c.33.09.55.38.55.72v8.5a.75.75 0 0 1-1.5 0v-6.42q-.57.58-1.36 1.06a.75.75 0 1 1-.78-1.28 7 7 0 0 0 2.24-2.24l.01-.01a.75.75 0 0 1 .84-.33m4.25 1.6c.55-1 1.48-1.63 2.8-1.63s2.25.64 2.8 1.63c.53.93.7 2.15.7 3.37s-.17 2.44-.7 3.37A3 3 0 0 1 16 21a3 3 0 0 1-2.8-1.63 7 7 0 0 1-.7-3.37c0-1.22.18-2.44.7-3.37m1.3.73A5.6 5.6 0 0 0 14 16c0 1.12.17 2.03.5 2.64.31.55.76.86 1.5.86s1.19-.31 1.5-.86c.33-.6.5-1.52.5-2.64a5.6 5.6 0 0 0-.5-2.64c-.31-.55-.76-.86-1.5-.86s-1.19.31-1.5.86"
  }));
  ;
};
export const SkipBack1024Regular = wrapIcon(SkipBack1024RegularIcon, 'SkipBack1024Regular');

const SkipForward3024RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M21.25 2.5c.41 0 .75.34.75.75v5.5c0 .41-.34.75-.75.75h-5.5a.75.75 0 0 1 0-1.5h3.9a8.3 8.3 0 0 0-4.12-3.06A9.7 9.7 0 0 0 4.4 9.1a.75.75 0 1 1-1.32-.72A11.19 11.19 0 0 1 15.97 3.5a9.6 9.6 0 0 1 4.53 3.14v-3.4c0-.41.34-.75.75-.75M8.75 15.25c.76 0 1.25-.22 1.54-.47.28-.26.4-.58.4-.88-.03-.55-.55-1.4-2.19-1.4a3.4 3.4 0 0 0-2.2.83.75.75 0 0 1-1.1-1.03l.01-.01.02-.02.23-.2q.22-.2.64-.44A5 5 0 0 1 8.5 11c2.2 0 3.63 1.27 3.68 2.85A2.6 2.6 0 0 1 11.16 16l.13.1c.6.55.92 1.3.9 2.05C12.12 19.73 10.7 21 8.5 21a4.9 4.9 0 0 1-3.27-1.27l-.02-.02s-.47-.6.03-1.07a.75.75 0 0 1 1.05.03l.02.02.1.08q.15.13.43.3c.38.21.94.43 1.66.43 1.64 0 2.16-.85 2.18-1.4q.03-.47-.4-.88c-.28-.25-.77-.47-1.53-.47a.75.75 0 1 1 0-1.5m5.45-2.62c.55-1 1.48-1.63 2.8-1.63s2.25.64 2.8 1.63c.53.93.7 2.15.7 3.37s-.17 2.44-.7 3.37A3 3 0 0 1 17 21a3 3 0 0 1-2.8-1.63 7 7 0 0 1-.7-3.37c0-1.22.18-2.44.7-3.37m1.3.73A5.6 5.6 0 0 0 15 16c0 1.12.17 2.03.5 2.64.31.55.76.86 1.5.86s1.19-.31 1.5-.86c.33-.6.5-1.52.5-2.64a5.6 5.6 0 0 0-.5-2.64c-.31-.55-.76-.86-1.5-.86s-1.19.31-1.5.86"
  }));
  ;
};
export const SkipForward3024Regular = wrapIcon(SkipForward3024RegularIcon, 'SkipForward3024Regular');

const Sparkle24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M8.67 15.73q.37.27.83.27a1.4 1.4 0 0 0 1.33-.88l.61-1.86a2.9 2.9 0 0 1 1.82-1.81l1.78-.58a1.44 1.44 0 0 0-.06-2.74l-1.75-.57a2.9 2.9 0 0 1-1.82-1.82l-.58-1.78a1.45 1.45 0 0 0-2.73.02l-.59 1.8a2.9 2.9 0 0 1-1.77 1.78l-1.77.57a1.44 1.44 0 0 0 .01 2.73l1.76.57a2.9 2.9 0 0 1 1.82 1.83l.58 1.77q.15.44.53.7m-.38-4.25-.36-.4A4.4 4.4 0 0 0 6.21 10l-1.6-.5 1.61-.53A4.4 4.4 0 0 0 8.95 6.2l.52-1.58.51 1.59a4.4 4.4 0 0 0 2.79 2.77l1.61.52-1.58.52a4.4 4.4 0 0 0-2.78 2.77l-.51 1.59-.52-1.59q-.25-.71-.7-1.3m8.04 9.3q-.29-.2-.4-.55l-.34-1a1.3 1.3 0 0 0-.82-.83l-.99-.32A1.15 1.15 0 0 1 13 17a1.1 1.1 0 0 1 .77-1.08l1-.33a1.3 1.3 0 0 0 .8-.82l.33-.99a1.14 1.14 0 0 1 2.16-.02l.33 1.01a1.3 1.3 0 0 0 .82.82l.99.32a1.14 1.14 0 0 1 .04 2.17l-1.01.33a1.3 1.3 0 0 0-.82.82l-.32.99a1.14 1.14 0 0 1-1.76.56M15.3 17a2.8 2.8 0 0 1 1.7 1.7 2.8 2.8 0 0 1 1.7-1.7 2.8 2.8 0 0 1-1.72-1.7A2.8 2.8 0 0 1 15.3 17"
  }));
  ;
};
export const Sparkle24Regular = wrapIcon(Sparkle24RegularIcon, 'Sparkle24Regular');

const Subtract24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3.75 12.5h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5"
  }));
  ;
};
export const Subtract24Regular = wrapIcon(Subtract24RegularIcon, 'Subtract24Regular');

const TextBulletListLtr24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M3.25 17.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m3.5.5h14.5a.75.75 0 0 1 .1 1.5H6.75a.75.75 0 0 1-.1-1.5zh14.5zm-3.5-7a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m3.5.5h14.5a.75.75 0 0 1 .1 1.5H6.75a.75.75 0 0 1-.1-1.5zh14.5zm-3.5-7a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m3.5.5h14.5a.75.75 0 0 1 .1 1.5H6.75a.75.75 0 0 1-.1-1.5zh14.5z"
  }));
  ;
};
export const TextBulletListLtr24Regular = wrapIcon(TextBulletListLtr24RegularIcon, 'TextBulletListLtr24Regular');

const TextFont24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M7 2c.31 0 .6.2.7.49l2.96 7.98v.04l.23.6-.83 2.09-.62-1.7H4.56l-1.1 3.01a.75.75 0 0 1-1.42-.52l1.3-3.48v-.04L6.3 2.5c.1-.3.39-.49.7-.49m-1.88 8h3.76L7 4.91zm8.69-3.53a.75.75 0 0 1 1.4 0l5.55 14.03h.49a.75.75 0 1 1 0 1.5h-2.5a.75.75 0 1 1 0-1.5h.4l-1.2-3h-6.9l-1.2 3h.4a.75.75 0 1 1 0 1.5h-2.5a.75.75 0 1 1 0-1.5h.49zM17.36 16 14.5 8.79 11.64 16z"
  }));
  ;
};
export const TextFont24Regular = wrapIcon(TextFont24RegularIcon, 'TextFont24Regular');

const Video24FilledIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M2 8.25C2 6.45 3.46 5 5.25 5h6.5C13.55 5 15 6.46 15 8.25v7.5c0 1.8-1.46 3.25-3.25 3.25h-6.5A3.25 3.25 0 0 1 2 15.75zm17.26 9.44L16 15.44V8.56l3.26-2.25c1.16-.8 2.74.03 2.74 1.44v8.5a1.75 1.75 0 0 1-2.74 1.44"
  }));
  ;
};
export const Video24Filled = wrapIcon(Video24FilledIcon, 'Video24Filled');

const Video24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M5.25 5A3.25 3.25 0 0 0 2 8.25v7.5C2 17.55 3.46 19 5.25 19h7.5c1.8 0 3.25-1.46 3.25-3.25v-.31l3.26 2.25c1.16.8 2.74-.03 2.74-1.44v-8.5a1.75 1.75 0 0 0-2.74-1.44L16 8.56v-.31C16 6.45 14.54 5 12.75 5zM16 10.38l4.11-2.83c.17-.12.4 0 .4.2v8.5c0 .2-.23.32-.4.2L16 13.62zM3.5 8.25c0-.97.78-1.75 1.75-1.75h7.5c.97 0 1.75.78 1.75 1.75v7.5c0 .97-.78 1.75-1.75 1.75h-7.5c-.97 0-1.75-.78-1.75-1.75z"
  }));
  ;
};
export const Video24Regular = wrapIcon(Video24RegularIcon, 'Video24Regular');

const Warning24RegularIcon = (props: any): React.JSX.Element => {
  const {
    fill: primaryFill = 'currentColor'
  } = props;
  return /*#__PURE__*/React.createElement(Svg, Object.assign({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement(Path, {
    fill: primaryFill,
    d: "M9.14 3.7a3.25 3.25 0 0 1 5.72 0l6.74 12.5a3.25 3.25 0 0 1-2.86 4.8H5.25a3.25 3.25 0 0 1-2.86-4.8zm4.4.72a1.75 1.75 0 0 0-3.08 0L3.7 16.92a1.75 1.75 0 0 0 1.54 2.58h13.5a1.75 1.75 0 0 0 1.53-2.58zM12 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-7.5c.41 0 .75.34.75.75v4.5a.75.75 0 0 1-1.5 0v-4.5c0-.41.34-.75.75-.75"
  }));
  ;
};
export const Warning24Regular = wrapIcon(Warning24RegularIcon, 'Warning24Regular');
