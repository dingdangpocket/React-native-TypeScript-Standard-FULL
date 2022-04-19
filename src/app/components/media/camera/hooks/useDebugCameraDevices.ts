/**
 * @file: useDebugCameraDevices.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { makeDebug, onErrorIgnore } from '@euler/utils';
import { useEffect } from 'react';
import { Camera } from 'react-native-vision-camera';

const debug = makeDebug('camera', true);

export const useDebugCameraDevices = () => {
  useEffect(() => {
    Camera.getAvailableCameraDevices()
      .then(availableDevices => {
        for (const availableDevice of availableDevices) {
          debug('%s', availableDevice.name);
        }
      })
      .catch(onErrorIgnore);
  }, []);
};
