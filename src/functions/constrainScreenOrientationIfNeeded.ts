/**
 * @file: constrainScreenOrientationIfNeeded.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';

export async function constrainScreenOrientationIfNeeded() {
  if (Platform.isTV) {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
    return;
  }

  if (
    Platform.OS !== 'web' &&
    (await Device.getDeviceTypeAsync()) === Device.DeviceType.PHONE
  ) {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  }
}
