export interface UserPresence {
  uid: string;
  status: 'online' | 'offline';
  lastActiveTime: string | Date;
}

export interface UserDeviceInfo {
  isDevice: boolean;
  deviceType?: string;
  brand?: string;
  manufacturer?: string;
  modelName?: string;
  modelId?: string;
  designName?: string;
  productName?: string;
  deviceYearClass?: number;
  totalMemory?: number;
  supportedCpuArchitectures?: string[];
  osName?: string;
  osBuildId?: string;
  osInternalBuildId?: string;
  osBuildFingerprint?: string;
  platformApiLevel?: number;
  deviceName?: string;
  platformFeatures?: string[];
}

export type UserSessionProps = {
  deviceId: string;
  authProvider?: string;
} & (
  | {
      platform: 'ios' | 'android';
      deviceInfo?: UserDeviceInfo;
      push: {
        authorized: boolean;
        deviceId?: string;
        apnsDeviceToken?: string;
      };
      appId: string;
      appVersion: string;
      jsbundleVersion: string;
      userAgent?: string;
    }
  | {
      platform: 'web';
      userAgent: string;
    }
);

export type UserSession = {
  sessionId: string;
  lastActiveTime: string | Date;
  lastLoginTime: string | Date;
  isLoggedIn: boolean;
  loggedOutAt?: string | Date | null;
} & UserSessionProps;
