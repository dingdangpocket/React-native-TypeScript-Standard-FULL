/**
 * @file: isSimulator.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function isSimulator() {
  return isIosSimulator() || isAndroidEmulator();
}

export function isIosSimulator() {
  return Platform.OS === 'ios' && !Device.isDevice;
}

export function isAndroidEmulator() {
  return (
    Platform.OS === 'android' &&
    (!Device.isDevice || Device.productName?.includes('emulator'))
  );
}
