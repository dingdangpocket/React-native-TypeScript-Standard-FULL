/**
 * @file: debugging.native.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import * as Sentry from '@sentry/react-native';

export const fakeCrash = () => {
  Sentry.nativeCrash();
};
