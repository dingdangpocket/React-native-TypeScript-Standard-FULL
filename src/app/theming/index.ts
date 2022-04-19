/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { ColorMode } from '@euler/app/theming/color-mode';
import darkTheme from './dark';
import lightTheme from './light';

export const getColorTheme = (colorMode: ColorMode) => {
  return colorMode === 'dark' ? darkTheme : lightTheme;
};
