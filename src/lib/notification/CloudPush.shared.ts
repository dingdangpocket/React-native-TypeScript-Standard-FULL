/**
 * @file: CloudPush.shared.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { RemoteMessage } from '@euler/lib/notification/types';
import { PermissionResponse } from 'expo-modules-core';
import { EmitterSubscription } from 'react-native';

export enum IosAlertStyle {
  NONE = 0,
  BANNER = 1,
  ALERT = 2,
}

export enum IosAllowsPreviews {
  NEVER = 0,
  ALWAYS = 1,
  WHEN_AUTHENTICATED = 2,
}

export enum IosAuthorizationStatus {
  NOT_DETERMINED = 0,
  DENIED = 1,
  AUTHORIZED = 2,
  PROVISIONAL = 3,
  EPHEMERAL = 4,
}

export interface NotificationPermissionsStatus extends PermissionResponse {
  android?: {
    importance: number;
    interruptionFilter?: number;
  };
  ios?: {
    status: IosAuthorizationStatus;
    allowsDisplayInNotificationCenter: boolean | null;
    allowsDisplayOnLockScreen: boolean | null;
    allowsDisplayInCarPlay: boolean | null;
    allowsAlert: boolean | null;
    allowsBadge: boolean | null;
    allowsSound: boolean | null;
    allowsCriticalAlerts?: boolean | null;
    alertStyle: IosAlertStyle;
    allowsPreviews?: IosAllowsPreviews;
    providesAppNotificationSettings?: boolean;
    allowsAnnouncements?: boolean | null;
  };
}

export interface IosNotificationPermissionsRequest {
  allowAlert?: boolean;
  allowBadge?: boolean;
  allowSound?: boolean;
  allowDisplayInCarPlay?: boolean;
  allowCriticalAlerts?: boolean;
  provideAppNotificationSettings?: boolean;
  allowProvisional?: boolean;
  allowAnnouncements?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type AndroidNotificationPermissionRequest = {};

export type NotificationEventListener = (message: RemoteMessage) => void;

export interface CloudPushModule {
  register(): Promise<void>;
  getPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  requestPermissionsAsync(
    permissions?: IosNotificationPermissionsRequest,
  ): Promise<NotificationPermissionsStatus>;
  getDeviceId(): Promise<string>;
  getApnsDeviceToken(): Promise<string>;
  bindAccount(account: string): Promise<void>;
  unbindAccount(): Promise<void>;
  onNotificationOpenedApp(
    listener: NotificationEventListener,
  ): EmitterSubscription;
  onMessage(listener: NotificationEventListener): EmitterSubscription;
  getInitialNotification(): Promise<any>;
}
