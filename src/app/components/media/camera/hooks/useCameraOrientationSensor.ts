/**
 * @file: useCameraOrientationSensor.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { makeDebug, onErrorIgnore, onErrorReturn } from '@euler/utils';
import { isSimulator } from '@euler/utils/device';
import { Subscription } from 'expo-modules-core';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
export type Orientation = 'portrait' | 'landscape';

const debug = makeDebug('camera:orientation');
const kVerbose = false;

export const useCameraOrientationSensor = () => {
  const lastOrientation = useRef<Orientation>();
  const [orientation, setOrientation] = useState<Orientation | undefined>(
    isSimulator() ? 'portrait' : undefined,
  );
  useEffect(() => {
    let listener: Subscription | null = null;
    DeviceMotion.isAvailableAsync()
      .then(async available => {
        if (!available) {
          debug('device motion is unavailable');
          return;
        }

        const status = await DeviceMotion.requestPermissionsAsync().catch(
          onErrorReturn({ granted: false }),
        );
        if (!status.granted) {
          debug('device motion permission denied');
          return;
        }

        DeviceMotion.setUpdateInterval(100);
        listener = DeviceMotion.addListener(e => {
          // https://levelup.gitconnected.com/tower-a-react-native-device-motion-example-app-8a8e81d333c3
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
          // https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/accelerationIncludingGravity
          // https://docs.expo.dev/versions/v44.0.0/sdk/devicemotion/
          // https://nshipster.com/cmdevicemotion/
          // get the force of gravity (G) of x and y axises
          const [ax, ay] = [e.acceleration?.x ?? 0, e.acceleration?.y ?? 0];
          const gx = e.accelerationIncludingGravity.x - ax;
          const gy = e.accelerationIncludingGravity.y - ay;
          const angle = Math.atan2(Math.abs(gx), Math.abs(gy));
          kVerbose &&
            debug(
              'motion g-force: (%s,%s), atan2(x, y): %s',
              gx,
              gy,
              (angle * 180) / Math.PI,
            );

          const current: Orientation =
            angle <= Math.PI / 4 ? 'portrait' : 'landscape';
          if (lastOrientation.current !== current) {
            lastOrientation.current = current;
            setOrientation(current);
          }
        });
        debug('subscribed to device motion updaters');
      })
      .catch(onErrorIgnore);
    return () => listener?.remove();
  }, []);

  return orientation;
};
