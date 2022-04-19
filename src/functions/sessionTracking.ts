/**
 * @file: sessionTracking.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

/* eslint-disable @typescript-eslint/promise-function-async */

import { useAuthContext } from '@euler/app/flows/auth';
import { useLogout } from '@euler/app/flows/auth/hooks';
import { CloudPush } from '@euler/lib/notification/CloudPush';
import {
  areUserSessionsSame,
  session$,
  UserSessionInfo,
} from '@euler/lib/session';
import { AuthProviderType } from '@euler/model/auth';
import { useServiceFactory } from '@euler/services/factory';
import { isNotNull, makeDebug, onErrorIgnore, showAlert } from '@euler/utils';
import { useEffect, useRef } from 'react';
import {
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  from,
  map,
  scan,
  Subject,
  switchMap,
} from 'rxjs';

type AuthStateInfo = { uid: string; provider?: AuthProviderType };
type AuthStateChange = [AuthStateInfo, AuthStateInfo?];
type SessionChange = [UserSessionInfo, UserSessionInfo?];

const debug = makeDebug('session:tracker', false);

export const sessionExpired$ = new Subject<void>();

export function useSessionTracker() {
  const authContext = useAuthContext();
  const { userService } = useServiceFactory();
  const isSessionExpiring = useRef(false);
  const logout = useLogout();
  useEffect(() => {
    const subscription = sessionExpired$.subscribe(async () => {
      if (isSessionExpiring.current) return;
      isSessionExpiring.current = true;
      await showAlert('提示', '当然会话已过期，请重新登录!');
      await logout();
      isSessionExpiring.current = false;
    });
    return () => subscription.unsubscribe();
  }, [logout]);

  useEffect(() => {
    const subscription = combineLatest([
      authContext.authState$.pipe(
        map(x =>
          x.isAuthenticated
            ? { uid: x.user.user.uid, provider: x.provider }
            : x.isAuthenticated === undefined
            ? undefined
            : { uid: '' },
        ),
        filter(isNotNull),
        distinctUntilChanged((x, y) => x.uid === y.uid),
        scan<AuthStateChange['0'], AuthStateChange>(
          ([prev], curr) => [curr, prev],
          [] as any,
        ),
      ),
      session$().pipe(
        filter(isNotNull),
        distinctUntilChanged(areUserSessionsSame),
        scan<UserSessionInfo, SessionChange>(
          ([prev], curr) => [curr, prev],
          [] as any,
        ),
      ),
    ])
      .pipe(
        switchMap(
          ([[currAuthState, prevAuthState], [currSession, prevSession]]) => {
            if (!currSession) {
              debug('current session is nil');
              return EMPTY;
            }

            debug('auth.curr: %O, auth.prev: %O', currAuthState, prevAuthState);

            const sessionProps = {
              ...currSession.sessionProps,
              authProvider: currAuthState.provider,
            };
            if (prevAuthState === undefined) {
              if (currAuthState.uid) {
                if (prevSession) {
                  // user session props has been updated, for example,
                  // the user has changed notification authorizataion state
                  debug(
                    'user presence login for previous authenticated session: %s',
                    currSession.sessionId,
                  );
                  return from(
                    userService
                      .presenceLogin(sessionProps)
                      .then(() => CloudPush.bindAccount(currAuthState.uid))
                      .catch(onErrorIgnore),
                  );
                } else {
                  debug(
                    'user presence active for previous authenticated session: %s',
                    currSession.sessionId,
                  );
                  // user entered app in authenticated state
                  return from(
                    userService
                      .presenceActive()
                      .then(() => CloudPush.bindAccount(currAuthState.uid))
                      .catch(onErrorIgnore),
                  );
                }
              }
              return EMPTY;
            } else if (currAuthState.uid) {
              debug(
                'user presence login for new authenticated session: %s',
                currSession.sessionId,
              );
              // after user has successfully logged in
              return from(
                userService
                  .presenceLogin(sessionProps)
                  .then(() => CloudPush.bindAccount(currAuthState.uid))
                  .catch(onErrorIgnore),
              );
            } else {
              // after user has logged out
              return from(CloudPush.unbindAccount());
            }
          },
        ),
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [authContext.authState$, userService]);
}
