/**
 * @file: session.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { versionText } from '@euler/components';
import { kPersistentKeyPrefix, kSessionId } from '@euler/lib/constants';
import {
  getDeviceId,
  getUserAgent,
  getUserDeviceInfo,
} from '@euler/lib/device';
import { notificationState$ } from '@euler/lib/notification/Notifications';
import { AsyncStorageProvider } from '@euler/lib/storage/impl/AsyncStorageProvider';
import { UserSessionProps } from '@euler/model/UserPresence';
import { isNotNull, makeDebug } from '@euler/utils';
import { useObservable } from '@euler/utils/hooks';
import * as Application from 'expo-application';
import { nanoid } from 'nanoid/non-secure';
import { Platform } from 'react-native';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  from,
  Observable,
  of,
  switchMap,
} from 'rxjs';

const debug = makeDebug('session');

const sessionId$ = new BehaviorSubject<string | undefined>(undefined);

export async function getSessionId(): Promise<{
  sessionId: string;
  isNew: boolean;
}> {
  if (sessionId$.value) {
    return { sessionId: sessionId$.value, isNew: false };
  }
  let isNew = false;
  let sessionId = await AsyncStorageProvider.shared.getItem(kSessionId);
  if (!sessionId) {
    isNew = true;
    sessionId = nanoid(32);
    await AsyncStorageProvider.shared.setItem(kSessionId, sessionId);
  }
  sessionId$.next(sessionId);
  return { sessionId, isNew };
}

export const clearSessionId = async () => {
  sessionId$.next(undefined);
  await AsyncStorageProvider.shared.removeItem(kSessionId);
};

export const useSessionId = () =>
  useObservable(
    () => sessionId$.pipe(filter(isNotNull), distinctUntilChanged()),
    kSessionId,
    undefined,
  );

export const pruneSession = async () => {
  try {
    debug('prune session %s: ', sessionId$.value);
    await clearSessionId();
    const keys = await AsyncStorageProvider.shared.getAllKeys();
    // storage keys starting with global persistent represents cross session items.
    await AsyncStorageProvider.shared.multiRemove(
      keys.filter(x => !x.startsWith(kPersistentKeyPrefix)),
    );
  } catch (e) {
    debug('error prune session: ', e);
  }
};

export function areUserSessionsSame(a: UserSessionInfo, b: UserSessionInfo) {
  if (a.sessionId !== b.sessionId) return false;

  // todo(eric): find a better way for compare session props
  return JSON.stringify(a.sessionProps) === JSON.stringify(b.sessionProps);
}

export type UserSessionInfo = {
  sessionId: string;
  sessionProps: UserSessionProps;
};

export const session$: () => Observable<UserSessionInfo> = () => {
  return combineLatest([
    sessionId$.pipe(filter(isNotNull), distinctUntilChanged()),
    from(getDeviceId()),
    notificationState$,
    from(getUserDeviceInfo()),
  ]).pipe(
    switchMap(([sessionId, deviceId, notificationState, deviceInfo]) => {
      const userAgent = getUserAgent();

      debug('session: %O', {
        sessionId,
        deviceId,
      });

      if (notificationState.status === 'pending') {
        return EMPTY;
      }

      let sessionProps: UserSessionProps | undefined = undefined;
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        sessionProps = {
          platform: Platform.OS,
          deviceId,
          deviceInfo,
          push:
            notificationState.status === 'granted'
              ? {
                  authorized: true,
                  deviceId: notificationState.deviceId,
                  apnsDeviceToken: notificationState.apnsDeviceToken,
                }
              : { authorized: false },
          appId: Application.applicationId!,
          appVersion: [
            Application.nativeApplicationVersion,
            Application.nativeBuildVersion,
          ].join('-'),
          jsbundleVersion: versionText(6),
          userAgent,
        };
      } else {
        sessionProps = {
          deviceId,
          platform: 'web',
          userAgent,
        };
      }
      return of({
        sessionId,
        sessionProps,
      });
    }),
  );
};
