/**
 * @file: CloudPush.android.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  CloudPushModule,
  IosNotificationPermissionsRequest,
  NotificationEventListener,
  NotificationPermissionsStatus,
} from '@euler/lib/notification/CloudPush.shared';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
const { CloudPushModule: CloudPushModuleAndroid } = NativeModules;

const eventEmitter = new NativeEventEmitter(CloudPushModuleAndroid);

export const CloudPush: CloudPushModule = {
  async register() {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.registerAsync();
  },

  async getPermissionsAsync(): Promise<NotificationPermissionsStatus> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.getPermissionsAsync();
  },

  async requestPermissionsAsync(
    _permissions?: IosNotificationPermissionsRequest,
  ): Promise<NotificationPermissionsStatus> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.requestPermissionsAsync();
  },

  async getDeviceId(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.getDeviceIdAsync();
  },

  async getApnsDeviceToken(): Promise<string> {
    throw new Error('getApnsDeviceToken only available for iOS');
  },

  async bindAccount(account: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.bindAccountAsync(account);
  },

  async unbindAccount(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleAndroid.unbindAccountAsync();
  },

  onNotificationOpenedApp(
    listener: NotificationEventListener,
  ): EmitterSubscription {
    return eventEmitter.addListener('onNotificationOpenedApp', listener);
  },

  onMessage(listener: NotificationEventListener): EmitterSubscription {
    return eventEmitter.addListener('onMessage', listener);
  },

  async getInitialNotification(): Promise<any> {
    return null;
  },
};
