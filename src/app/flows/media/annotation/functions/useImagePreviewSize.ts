/**
 * @file: useImagePreviewSize.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useIsMobileLayout } from '@euler/utils';
import { useWindowDimensions } from 'react-native';

export const useImagePreviewSize = (options?: {
  mask?: { width: number; height: number };
}) => {
  const mask = options?.mask;
  const dimens = useWindowDimensions();
  const isMobileLayout = useIsMobileLayout();
  let width = 0;
  let height = 0;
  if (isMobileLayout) {
    width = dimens.width;
    height = mask ? (mask.height / mask.width) * width : dimens.height;
  } else {
    height = dimens.height;
    width = mask ? (mask.width / mask.height) * height : 375;
  }
  return [width, height];
};
