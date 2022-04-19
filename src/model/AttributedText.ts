/**
 * @file: AttributedText.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DefaultTheme } from 'styled-components/native';

export type AttributedText = {
  text: string;
  color?: string | ((theme: DefaultTheme) => string);
  fontFamily?: string;
  fontSize?: number;
};
