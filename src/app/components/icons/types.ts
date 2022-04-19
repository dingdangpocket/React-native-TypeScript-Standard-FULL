/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

export type IconProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
} & SvgProps;
