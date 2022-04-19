/**
 * @file: hooks.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useAppLoading } from '@euler/app/components/loading';
import { useAuthContext } from '@euler/app/flows/auth';
import {
  kAuthProvider,
  kAuthResult,
  kIdentity,
} from '@euler/functions/constants';
import { AnalyticEvents } from '@euler/generated/AnalyticEvents';
import { getSessionId, pruneSession } from '@euler/lib/session';
import { AuthenticatedUserInfo } from '@euler/model';
import {
  AuthenticatorResult,
  AuthProvider,
  AuthProviderType,
} from '@euler/model/auth';
import { useServiceFactory } from '@euler/services/factory';
import { makeDebug, onErrorIgnore } from '@euler/utils';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

const debug = makeDebug('auth:context');

type LoginFunction = <T extends AuthProvider>(
  authProviderData: T,
) => Promise<AuthenticatorResult<T> | undefined>;

export const useLogin = (props?: { onError?: (e: Error) => void }) => {
  const { onError } = props ?? {};
  const authContext = useAuthContext();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { authService, defaultTokenService, defaultStorageService } =
    useServiceFactory();

  const login: LoginFunction = useCallback(
    async data => {
      try {
        setIsLoggingIn(true);

        const result = await authService.login(data);

        if (
          data.type === AuthProviderType.Weixin &&
          result.token === '__pending__'
        ) {
          return result;
        }

        try {
          await defaultTokenService.setToken(result.token);
        } catch (e) {}

        AnalyticEvents.default.userLoginSuccess({
          loginMethod: data.type,
          userId: result.user.uid,
        });

        const authenticatedUserInfo: AuthenticatedUserInfo = {
          user: result.user,
          org: result.org,
          store: result.store,
        };

        defaultStorageService
          .set(kAuthResult, authenticatedUserInfo)
          .catch(onErrorIgnore);

        defaultStorageService
          .set(kAuthProvider, data.type)
          .catch(onErrorIgnore);

        authContext.authState$.next({
          isAuthenticated: true,
          user: authenticatedUserInfo,
          provider: data.type,
        });

        return result;
      } catch (e) {
        if (onError) {
          onError(e as Error);
        } else {
          console.error(e);
          Alert.alert((e as Error).message);
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    [
      authContext.authState$,
      authService,
      defaultStorageService,
      defaultTokenService,
      onError,
    ],
  );
  return {
    isLoggingIn,
    login,
  };
};

export const useLogout = () => {
  const context = useAuthContext();
  const { userService, defaultTokenService, defaultStorageService } =
    useServiceFactory();
  const loading = useAppLoading();
  return useCallback(async () => {
    const { sessionId } = await getSessionId();
    if (!context.authState$.value.isAuthenticated) return;
    try {
      debug(
        'user presence logged off session: %s, uid: %s',
        sessionId,
        context.authState$.value.user.user.uid,
      );
      loading.show();
      await userService.presenceLogout(context.authState$.value.user.user.uid);
    } catch (e) {
      debug(e);
    }
    try {
      await pruneSession();
      await defaultTokenService.removeToken();
      await defaultStorageService.remove(kIdentity);
      await defaultStorageService.remove(kAuthResult);
    } catch (e) {
      debug(e);
    }
    context.authState$.next({ isAuthenticated: false });
    loading.hide();
  }, [
    context.authState$,
    defaultStorageService,
    defaultTokenService,
    loading,
    userService,
  ]);
};

export const useAuthenticatedUser = () => {
  const context = useAuthContext();
  if (!context) {
    throw new Error(
      'useAuthenticatedUser is expected to be called for a valid AuthContext only',
    );
  }
  if (!context.authState$.value.isAuthenticated) {
    throw new Error(
      'Try to get the currently authenticated user in an unauthenticated user context',
    );
  }
  return context.authState$.value.user;
};
