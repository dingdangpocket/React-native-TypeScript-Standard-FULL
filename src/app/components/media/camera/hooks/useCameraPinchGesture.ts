/**
 * @file: useCameraPinchGesture.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Gesture } from 'react-native-gesture-handler';
import {
  Extrapolate,
  interpolate,
  SharedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { kScaleFullZoom } from '../constants';

export const useCameraPinchGesture = (options: {
  zoom: SharedValue<number>;
  enabled: boolean;
  minZoom: number;
  maxZoom: number;
}) => {
  const { enabled, zoom, minZoom, maxZoom } = options;
  const startZoom = useSharedValue<number | null>(null);
  return Gesture.Pinch()
    .enabled(enabled)
    .onStart(() => {
      startZoom.value = zoom.value;
    })
    .onUpdate(event => {
      // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential
      // curve since a camera's zoom, function does not appear linear to the user.
      // (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
      const value = startZoom.value ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / kScaleFullZoom, 1, kScaleFullZoom],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, value, maxZoom],
        Extrapolate.CLAMP,
      );
    });
};
