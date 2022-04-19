/**
 * @file: CloudPush.web.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  CloudPushModule,
  NotificationEventListener,
  NotificationPermissionsStatus,
} from '@euler/lib/notification/CloudPush.shared';
import { PermissionStatus } from 'expo-modules-core';
import { EmitterSubscription } from 'react-native';

export const CloudPush: CloudPushModule = {
  async register() {},

  async getPermissionsAsync(): Promise<NotificationPermissionsStatus> {
    return { status: PermissionStatus.UNDETERMINED } as any;
  },

  async requestPermissionsAsync(): Promise<NotificationPermissionsStatus> {
    return { status: PermissionStatus.UNDETERMINED } as any;
  },

  async getDeviceId(): Promise<string> {
    return '';
  },

  async getApnsDeviceToken(): Promise<string> {
    throw new Error('getApnsDeviceToken only available for iOS');
  },

  async bindAccount(_account: string): Promise<void> {},

  async unbindAccount(): Promise<void> {},

  onNotificationOpenedApp(
    _listener: NotificationEventListener,
  ): EmitterSubscription {
    return { remove: () => null } as any;
  },

  onMessage(_listener: NotificationEventListener): EmitterSubscription {
    return { remove: () => null } as any;
  },

  async getInitialNotification(): Promise<any> {},
};
