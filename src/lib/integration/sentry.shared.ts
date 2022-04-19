/**
 * @file: sentry.shared.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { code, current } from '@euler/config/version.json';
import packageJson from '../../../package.json';

export function getSentryRelease() {
  const { name, version } = packageJson;
  const suffix = `${current.substr(0, 6)}-${code}`;
  if (__DEV__) {
    return `${name}@${version}-dev.${suffix}`;
  }
  return `${name}@${version}.${suffix}`;
}
