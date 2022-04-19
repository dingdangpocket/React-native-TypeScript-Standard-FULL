/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Platform } from 'react-native';
import configRaw from './config.json';

export type EnvType = 'dev' | 'production' | 'staging';
export type EnvTagType = 'd' | 'p' | 's' | 't';

const EnvTagMap = new Map<EnvType, EnvTagType>([
  ['dev', 'd'],
  ['production', 'p'],
  ['staging', 't'],
]);

export type AppConfig = {
  bundleId: string;
  apiEndpoint: string;
  requestTimeout?: number;
  environment: EnvType;
  linking: {
    url: string;
    scheme: string;
  };
  sentry: {
    dsn: string;
    tracesSampleRate: number;
  };
  mixpanel: {
    token: string;
  };
  weixinOpen: {
    appId: string;
    linking: string;
  };
};

export function envTypeToTag(envType: EnvType): EnvTagType {
  return EnvTagMap.get(envType)!;
}

export const config = { ...configRaw } as Omit<AppConfig, 'environment'> & {
  environment: EnvType;
};

if (__DEV__ && Platform.OS === 'android') {
  config.apiEndpoint = config.apiEndpoint?.replace('https://', 'http://');
}

if (!__DEV__ && Platform.OS === 'web') {
  // use the same domain as the api endpoint for non development build
  // the backend will provide the reverse proxy setup for the api requests.
  config.apiEndpoint = '/';
}
