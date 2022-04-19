/**
 * @file: context.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { kAuthProvider, kAuthResult, kIdentity } from '@euler/functions';
import { integrations } from '@euler/lib/integration';
import { sentry } from '@euler/lib/integration/sentry';
import { AuthenticatedUserInfo, UserIdentity } from '@euler/model';
import { AuthProviderType } from '@euler/model/auth';
import { useServiceFactory } from '@euler/services/factory';
import { makeDebug, onErrorIgnore, onErrorReturn } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import AppLoading from 'expo-app-loading';
import React, {
  memo,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BehaviorSubject } from 'rxjs';

const debug = makeDebug('auth:context');

export type AuthState =
  | {
      isAuthenticated?: false;
    }
  | {
      isAuthenticated: true;
      user: AuthenticatedUserInfo;
      provider: AuthProviderType | undefined;
    };

export type AuthContextProps = {
  authState$: BehaviorSubject<AuthState>;
};

export const AuthContext = React.createContext<AuthContextProps>(null as any);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const useCurrentUser = () => {
  const context = useAuthContext();
  const [state] = useBehaviorSubject(context.authState$);
  if (!state.isAuthenticated) {
    return null;
  }
  return state.user;
};

export const useCurrentStore = () => {
  return useCurrentUser()!.store;
};

export const useCurrentStoreId = () => {
  return useCurrentUser()!.store.id;
};

export const AuthContextProvider = memo(
  ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);

    const authState$ = useMemo(() => new BehaviorSubject<AuthState>({}), []);

    const contextValue = useMemo(
      () => ({ isLoading, authState$ }),
      [authState$, isLoading],
    );

    const [authState] = useBehaviorSubject(authState$);

    const { defaultTokenService, defaultStorageService, authService } =
      useServiceFactory();

    useEffect(() => {
      // used to load the stored auth token and verify it against server
      // if the auth token exists in the storage.
      const loadAndCheckAuthToken = async () => {
        const [token, identity] = await Promise.all([
          defaultTokenService.getToken().catch(onErrorReturn(null)),
          defaultStorageService
            .get<UserIdentity>(kIdentity)
            .catch(onErrorReturn(null)),
        ]);

        if (!token) {
          setIsLoading(false);
          authState$.next({
            isAuthenticated: false,
          });
          return;
        }

        if (identity) {
          integrations.identifyUser(identity);
        }

        let authProvider: AuthProviderType | null | undefined = undefined;
        try {
          authProvider = await defaultStorageService.get<AuthProviderType>(
            kAuthProvider,
          );
        } catch (e) {
          sentry.captureException(e);
        }

        try {
          const result = await authService.getAuthenticatedUserInfo();
          if (!result) {
            authState$.next({
              isAuthenticated: false,
            });
          } else {
            try {
              // update cached authenticated user information.
              await defaultStorageService.set(kAuthResult, result);
            } catch (e) {
              sentry.captureException(e);
            }

            authState$.next({
              isAuthenticated: true,
              user: result,
              provider: authProvider ?? undefined,
            });
          }
        } catch (e) {
          sentry.captureException(e);
          // load existing auth result
          try {
            const result =
              await defaultStorageService.get<AuthenticatedUserInfo>(
                kAuthResult,
              );
            // check the token and redirect to login page if the token has expired.
            if (!result?.user || !defaultTokenService.isValidToken(token)) {
              authState$.next({
                isAuthenticated: false,
              });
            } else {
              authState$.next({
                isAuthenticated: true,
                user: result,
                provider: authProvider ?? undefined,
              });
            }
          } catch (err) {
            sentry.captureException(err);
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadAndCheckAuthToken().catch(e => {
        sentry.captureException(e);
      });
    }, [authState$, defaultStorageService, defaultTokenService, authService]);

    const { userId, uid, userName, nick, email } = authState.isAuthenticated
      ? authState.user
      : ({} as any);

    const identity = useMemo<UserIdentity | null>(
      () =>
        userId && uid && userName
          ? {
              uid,
              userIdLong: userId,
              userName: userName,
              nick: nick ?? userName ?? '',
              email: email ?? undefined,
            }
          : null,
      [userId, uid, userName, nick, email],
    );

    useEffect(() => {
      if (identity) {
        defaultStorageService.set(kIdentity, identity).catch(onErrorIgnore);
        debug('set contextural identity for integrations');
        integrations.identifyUser(identity);
      }
    }, [defaultStorageService, identity]);

    useEffect(() => {
      if (authState.isAuthenticated === false) {
        debug('clear contextural identity for integrations');
        integrations.resetUser();
      }
    }, [authState.isAuthenticated]);

    if (isLoading) {
      return <AppLoading />;
    }

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  },
);
