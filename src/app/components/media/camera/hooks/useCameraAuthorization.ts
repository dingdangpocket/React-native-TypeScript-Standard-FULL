/**
 * @file: useCameraAuthorization.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { makeDebug, onErrorReturn } from '@euler/utils';
import { useAsyncResource } from '@euler/utils/hooks';
import { Linking } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

const debug = makeDebug('camera:authorization');

type AuthorizationStatus = {
  cameraAuthStatus: CameraPermissionStatus;
  microphoneAuthStatus: CameraPermissionStatus;
};

const getAuthorizationStatus = async (): Promise<AuthorizationStatus> => {
  return await Promise.all([
    Camera.getCameraPermissionStatus(),
    Camera.getMicrophonePermissionStatus(),
  ])
    .then(async ([cameraAuthStatus, microphoneAuthStatus]) => {
      const authorizationStatus: AuthorizationStatus = {
        cameraAuthStatus,
        microphoneAuthStatus,
      };
      debug('current camera authorization status: ', authorizationStatus);
      if (cameraAuthStatus === 'not-determined') {
        debug('requesting camera permission... ');
        const result = await Camera.requestCameraPermission();
        authorizationStatus.cameraAuthStatus = result;
        debug('camera authorization result: ', result);
      }
      if (microphoneAuthStatus === 'not-determined') {
        debug('requesting microphone permission... ');
        const result = await Camera.requestMicrophonePermission();
        debug('microphone authorization result: ', result);
      }
      if (cameraAuthStatus === 'denied' || microphoneAuthStatus === 'denied') {
        await Linking.openSettings();
      }
      return authorizationStatus;
    })
    .catch(
      onErrorReturn<AuthorizationStatus>({
        cameraAuthStatus: 'denied',
        microphoneAuthStatus: 'denied',
      }),
    );
};

export const useCameraAuthorization = () => {
  return useAsyncResource(
    getAuthorizationStatus,
    'camera-authorization-status',
  );
};
