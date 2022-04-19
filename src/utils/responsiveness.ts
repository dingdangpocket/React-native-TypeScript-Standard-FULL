/**
 * @file: responsiveness.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useMediaQuery } from 'react-responsive';

export const useIsMobileLayout = () => {
  return useMediaQuery({ maxWidth: 600 });
};

export const isMobileLayout = () => {
  return matchMedia('(max-width: 600px)').matches;
};

export const useIsWideDesktopLayout = () => {
  return useMediaQuery({ minWidth: 1366 });
};
