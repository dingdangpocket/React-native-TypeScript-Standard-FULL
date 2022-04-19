/**
 * @file: useCameraDoubleTapGesture.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export const useCameraDoubleTapGesture = (props: {
  enabled: boolean;
  onDoubleTap: () => void;
}) => {
  const { enabled, onDoubleTap } = props;
  const gesture = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(enabled)
    .onEnd(e => {
      if (e.numberOfPointers > 1) return;
      runOnJS(onDoubleTap)();
    });
  return gesture;
};
