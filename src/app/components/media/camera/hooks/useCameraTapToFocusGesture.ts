/**
 * @file: useCameraTapToFocusGesture.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useVector } from 'react-native-redash';

export const useCameraTapToFocusGesture = (props: { enabled: boolean }) => {
  const { enabled } = props;

  const focusPoint = useVector();
  const isFocusRequested = useSharedValue(false);

  const gesture = Gesture.Tap()
    .numberOfTaps(1)
    .enabled(enabled)
    .onEnd(e => {
      // request focusing on real device takes some time, thus if a previous
      // focus request is still in progress, just ignore this tap.
      if (isFocusRequested.value) return;

      focusPoint.x.value = e.x;
      focusPoint.y.value = e.y;

      isFocusRequested.value = true;
    });

  return {
    gesture,
    focusPoint,
    isFocusRequested,
  };
};
