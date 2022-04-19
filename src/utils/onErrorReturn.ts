/**
 * @file: onErrorReturn.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { sentry } from '@euler/lib/integration/sentry';

export function onErrorReturn<T>(value: T): (error: any) => T {
  return (error: any) => {
    sentry.captureException(error);
    return value;
  };
}
