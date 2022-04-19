/**
 * @file: onErrorIgnore.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { sentry } from '@euler/lib/integration/sentry';

export function onErrorIgnore(error: any): void {
  sentry.captureException(error);
}
