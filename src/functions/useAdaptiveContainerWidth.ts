/**
 * @file: useAdaptiveContainerWidth.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { useIsMobileLayout } from '@euler/utils';
import { useWindowDimensions } from 'react-native';

export const useAdaptiveContainerWidth = () => {
  const dimens = useWindowDimensions();
  const isMobile = useIsMobileLayout();
  const containerSize = useContainerLayout();
  return isMobile || !containerSize?.width ? dimens.width : containerSize.width;
};
