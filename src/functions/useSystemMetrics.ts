/**
 * @file: useSystemMetrics.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useWindowDimensions } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export const useSystemMetrics = () => {
  const safeAreaFrame = useSafeAreaFrame();
  const safeAreaInsets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();
  const navBarHeight = getDefaultHeaderHeight(
    safeAreaFrame,
    false,
    safeAreaInsets.top,
  );
  return {
    navBarHeight,
    safeAreaFrame,
    safeAreaInsets,
    windowDimensions,
  };
};
