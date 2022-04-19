/**
 * @file: useBottomSheetModal.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { SafeHaptics, useIsMobileLayout } from '@euler/utils';
import { useWatchValue } from '@euler/utils/hooks';
import {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { FC, RefObject, useCallback, useMemo, useRef } from 'react';
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const toSnapPoint = (value: number) => Math.round(value * 100) + '%';

export const useGeneralBottomSheetModal = ({
  topMargin,
  minHeight,
  mediumHeight,
  show,
  index,
  handleHeight,
  handleComponent,
  handleStyle,
  handleIndicatorStyle,
  enablePanDownToClose = true,
  enableDismissOnClose = true,
  dismissWhenPressBackdrop,
  onDismiss,
  ...rest
}: {
  show?: boolean;
  topMargin?: number;
  minHeight?: number;
  minSnapPoint?: string;
  mediumHeight?: number;
  mediumSnapPoint?: string;
  index?: number;
  handleHeight?: number;
  dismissWhenPressBackdrop?: boolean;
  handleComponent?: FC<BottomSheetHandleProps> | null;
  handleStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  enablePanDownToClose?: boolean;
  enableDismissOnClose?: boolean;
  onDismiss?: () => void;
}): Omit<BottomSheetModalProps, 'children'> & {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
} => {
  const { top } = useSafeAreaInsets();
  const dimens = useWindowDimensions();
  const isMobile = useIsMobileLayout();
  const containerSize = useContainerLayout();
  const height =
    isMobile || !containerSize?.height ? dimens.height : containerSize.height;
  const maxHeight = height - (topMargin ?? top);
  const minSnapPoint =
    rest.minSnapPoint ?? (minHeight ? toSnapPoint(minHeight / height) : '25%');
  const mediumSnapPoint =
    rest.mediumSnapPoint ??
    (mediumHeight ? toSnapPoint(mediumHeight / height) : '50%');
  const maxSnapPoint = toSnapPoint(maxHeight / height);
  const snapPoints = useMemo(
    () => [minSnapPoint, mediumSnapPoint, maxSnapPoint],
    [maxSnapPoint, mediumSnapPoint, minSnapPoint],
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  useWatchValue(show, (prev, curr) => {
    if (!prev && curr) {
      bottomSheetModalRef.current?.present();
    } else if (prev && !curr) {
      bottomSheetModalRef.current?.dismiss();
    }
  });
  const onChange = useCallback(() => {
    SafeHaptics.selection();
  }, []);
  const backdropComponent = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={dismissWhenPressBackdrop !== false ? 'close' : 'none'}
      />
    ),
    [dismissWhenPressBackdrop],
  );
  return {
    bottomSheetModalRef,
    snapPoints,
    index: index ?? 1,
    onChange,
    backdropComponent,
    enablePanDownToClose,
    enableDismissOnClose,
    handleHeight,
    handleComponent,
    handleStyle,
    handleIndicatorStyle,
    onDismiss,
  };
};
