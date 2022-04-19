/**
 * @file: svg.d.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
