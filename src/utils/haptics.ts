/**
 * @file: haptics.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// note(eric): Expo's Haptics implementation will crash the app on iOS
// in the following deivce models:
const iOSDeviceModelBlackList: string[] = [
  'iPhone 7', // first device that supports `Taptic Engine`
];

export function isHapticsAvailable() {
  return (
    (Platform.OS === 'ios' &&
      !iOSDeviceModelBlackList.some(x => Constants.deviceName?.includes(x))) ||
    Platform.OS === 'android'
  );
}

export namespace SafeHaptics {
  export function selection() {
    if (isHapticsAvailable()) {
      Haptics.selectionAsync().catch(() => null);
    }
  }

  export function impact(style?: Haptics.ImpactFeedbackStyle) {
    if (isHapticsAvailable()) {
      Haptics.impactAsync(style).catch(() => null);
    }
  }

  export function notification(style?: Haptics.NotificationFeedbackType) {
    if (isHapticsAvailable()) {
      Haptics.notificationAsync(style).catch(() => null);
    }
  }
}
