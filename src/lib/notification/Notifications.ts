/**
 * @file: Notifications.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { PermissionStatus } from 'expo-modules-core';
import { Platform } from 'react-native';
import { BehaviorSubject } from 'rxjs';
import { CloudPush } from './CloudPush';

export const Notifications = CloudPush;

export const notificationState$ = new BehaviorSubject<
  | { status: 'pending' }
  | { status: 'rejected' }
  | { status: 'granted'; deviceId: string; apnsDeviceToken?: string }
>({
  status: 'pending',
});

export async function requestNotificationUserPermissions() {
  try {
    let authorizationStatus = await CloudPush.getPermissionsAsync();
    if (authorizationStatus.status !== PermissionStatus.GRANTED) {
      authorizationStatus = await CloudPush.requestPermissionsAsync();
    }
    if (
      authorizationStatus.status === PermissionStatus.GRANTED ||
      Platform.OS === 'android'
    ) {
      await CloudPush.register();
      const deviceId = await CloudPush.getDeviceId();
      const apnsDeviceToken =
        Platform.OS === 'ios'
          ? await CloudPush.getApnsDeviceToken()
          : undefined;
      if (Platform.OS === 'ios') {
        console.log(
          `[cloudpush][${Platform.OS}] successfully registered with device id: `,
          deviceId,
          ', apns device token: ',
          apnsDeviceToken,
        );
      } else {
        console.log(
          `[cloudpush][${Platform.OS}] successfully registered with device id: `,
          deviceId,
        );
      }
      notificationState$.next({
        status: 'granted',
        deviceId,
        apnsDeviceToken,
      });
    } else {
      notificationState$.next({
        status: 'rejected',
      });
    }
  } catch (e) {
    console.error(e);
    notificationState$.next({
      status: 'rejected',
    });
  }
}
