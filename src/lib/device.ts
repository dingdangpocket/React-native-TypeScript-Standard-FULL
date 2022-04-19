/**
 * @file: device.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { kInstallationId } from '@euler/lib/constants';
import { getDefaultSecureStorageProviderOrFallback } from '@euler/lib/storage';
import { UserDeviceInfo } from '@euler/model/UserPresence';
import { maybe } from '@euler/utils';
import { useObservable } from '@euler/utils/hooks';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { nanoid } from 'nanoid/non-secure';
import { Platform } from 'react-native';
import UserAgent from 'react-native-user-agent';
import { from } from 'rxjs';

export async function getDeviceId(): Promise<string> {
  if (Platform.OS === 'android') {
    return Application.androidId ?? (await getLocalInstallationId());
  }

  return await getLocalInstallationId();
}

export const useDeviceId = () =>
  useObservable(() => from(getDeviceId()), kInstallationId);

async function getLocalInstallationId(): Promise<string> {
  const storageProvider = await getDefaultSecureStorageProviderOrFallback();
  let installationId = await storageProvider.getItem(kInstallationId);
  if (!installationId) {
    installationId = nanoid(32);
    await storageProvider.setItem(kInstallationId, installationId);
  }
  return installationId;
}

export function getUserAgent() {
  return UserAgent.getUserAgent();
}

const deviceTypeMap = {
  [Device.DeviceType.PHONE]: 'phone',
  [Device.DeviceType.TABLET]: 'tablet',
  [Device.DeviceType.TV]: 'tv',
  [Device.DeviceType.DESKTOP]: 'desktop',
  [Device.DeviceType.UNKNOWN]: 'unknown',
};

async function getDeviceTypeString(): Promise<string | undefined> {
  const deviceType = await Device.getDeviceTypeAsync();
  return deviceTypeMap[deviceType];
}

export async function getUserDeviceInfo(): Promise<UserDeviceInfo> {
  return {
    isDevice: Device.isDevice,
    deviceType: await getDeviceTypeString(),
    brand: maybe(Device.brand),
    manufacturer: maybe(Device.manufacturer),
    modelName: maybe(Device.modelName),
    modelId: maybe(Device.modelId),
    designName: maybe(Device.designName),
    productName: maybe(Device.productName),
    deviceYearClass: maybe(Device.deviceYearClass),
    totalMemory: maybe(Device.totalMemory),
    supportedCpuArchitectures: maybe(Device.supportedCpuArchitectures),
    osName: maybe(Device.osName),
    osBuildId: maybe(Device.osBuildId),
    osInternalBuildId: maybe(Device.osInternalBuildId),
    osBuildFingerprint: maybe(Device.osBuildFingerprint),
    platformApiLevel: maybe(Device.platformApiLevel),
    deviceName: maybe(Device.deviceName),
    platformFeatures: maybe(await Device.getPlatformFeaturesAsync()),
  };
}
