/**
 * @file: useCameraViewLayout.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCallback, useMemo, useRef } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraViewLayout } from '../CameraView.shared';

export const useCameraViewLayout = ({
  onLayoutChange,
}: {
  onLayoutChange?: (layout: CameraViewLayout) => void;
}) => {
  const insets = useSafeAreaInsets();

  const cameraLayout = useRef<CameraViewLayout>({});

  const controlsStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      right: insets.right + 15,
      top: insets.top + 15,
    }),
    [insets.right, insets.top],
  );

  const updateCameraLayout = useCallback(
    (update: { [p in keyof CameraViewLayout]?: LayoutRectangle }) => {
      cameraLayout.current = {
        ...cameraLayout.current,
        ...update,
      };
      onLayoutChange?.(cameraLayout.current);
    },
    [onLayoutChange],
  );

  const bottomStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: insets.bottom + 15,
    }),
    [insets.bottom],
  );

  const onPreviewLayout = useCallback(
    (e: LayoutChangeEvent) => {
      updateCameraLayout({
        preview: e.nativeEvent.layout,
      });
    },
    [updateCameraLayout],
  );

  const onControlsLayout = useCallback(
    (e: LayoutChangeEvent) => {
      updateCameraLayout({
        controls: e.nativeEvent.layout,
      });
    },
    [updateCameraLayout],
  );

  const onMaskLayout = useCallback(
    (e: LayoutChangeEvent) => {
      updateCameraLayout({
        mask: e.nativeEvent.layout,
      });
    },
    [updateCameraLayout],
  );

  const onBottomLayout = useCallback(
    (e: LayoutChangeEvent) => {
      updateCameraLayout({
        bottom: e.nativeEvent.layout,
      });
    },
    [updateCameraLayout],
  );

  return {
    onPreviewLayout,
    onControlsLayout,
    onMaskLayout,
    onBottomLayout,
    layout: {
      controls: {
        style: controlsStyle,
      },
      bottomControls: {
        style: bottomStyle,
      },
    },
  };
};
