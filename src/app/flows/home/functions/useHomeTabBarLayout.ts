/**
 * @file: useHomeTabBarLayout.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type HomeTabBarLayout = {
  height: number;
  left: number;
  right: number;
  bottom: number;
};

export function useHomeTabBarLayout(): HomeTabBarLayout {
  const safeAreaInsets = useSafeAreaInsets();
  return {
    height: 65,
    left: 50,
    right: 50,
    bottom: Math.max(safeAreaInsets.bottom, 10),
  };
}
