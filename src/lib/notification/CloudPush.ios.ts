/**
 * @file: CloudPush.ios.ts
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
const { CloudPushModule: CloudPushModuleIOS } = NativeModules;

const eventEmitter = new NativeEventEmitter(CloudPushModuleIOS);

export const CloudPush: CloudPushModule = {
  async register() {},

  async getPermissionsAsync(): Promise<NotificationPermissionsStatus> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.getPermissionsAsync();
  },

  async requestPermissionsAsync(
    permissions?: IosNotificationPermissionsRequest,
  ): Promise<NotificationPermissionsStatus> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.requestPermissionsAsync(permissions);
  },

  async getDeviceId(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.getDeviceIdAsync();
  },

  async getApnsDeviceToken(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.getApnsDeviceTokenAsync();
  },

  async bindAccount(account: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.bindAccountAsync(account);
  },

  async unbindAccount(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.unbindAccountAsync();
  },

  onNotificationOpenedApp(
    listener: NotificationEventListener,
  ): EmitterSubscription {
    return eventEmitter.addListener('remoteNotificationReceived', listener);
  },

  onMessage(listener: NotificationEventListener): EmitterSubscription {
    return eventEmitter.addListener('remoteMessageReceived', listener);
  },

  async getInitialNotification(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await CloudPushModuleIOS.getInitialNotificationAsync();
  },
};
