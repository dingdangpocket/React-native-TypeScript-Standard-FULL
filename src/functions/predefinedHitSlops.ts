/**
 * @file: predefinedHitSlops.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Insets } from 'react-native';

export function makeHitSlop(x: number, y = x): Insets {
  return {
    left: x,
    top: y,
    right: x,
    bottom: y,
  };
}

export const PredefinedHitSlops = {
  small: makeHitSlop(4),
  medium: makeHitSlop(8),
  large: makeHitSlop(12),
};
