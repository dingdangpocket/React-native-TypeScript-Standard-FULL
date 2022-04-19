import { AuthContext } from '@euler/app/flows/auth';
import { Colors } from '@euler/components';
import { useTrackNavigator } from '@euler/functions';
import { linkingFactory } from '@euler/lib/linking';
import { makeDebug, onErrorIgnore, useIsMobileLayout } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import {
  useFlipper,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import {
  DefaultTheme,
  getActionFromState,
  getStateFromPath,
  NavigationContainer,
  NavigationState,
  PartialState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Linking from 'expo-linking';
import qs from 'qs';
import React, {
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';

const debug = makeDebug('linking', true);

// the linking configuration defines how to map state to paths and vice versa.
const linking = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  normal: linkingFactory<{}>({
    screens: {
      Root: {
        screens: {
          Drawer: {
            initialRouteName: 'Home',
            screens: {
              Home: {
                initialRouteName: 'Dashboard',
                screens: {
                  Dashboard: '',
                },
              } as any,
              TaskDetail: {
                path: 'tasks/:taskNo',
                exact: true,
              },
              PreInspectionReport: {
                path: 'tasks/:taskNo/reports/pre-inspection',
                exact: true,
              },
              InspectionReport: {
                path: 'tasks/:taskNo/reports/inspection',
                exact: true,
              },
              ConstructionReport: {
                path: 'tasks/:taskNo/reports/construction',
                exact: true,
              },
              DeliveryCheckReport: {
                path: 'tasks/:taskNo/reports/delivery-check',
                exact: true,
              },
              Report: {
                path: 'tasks/:taskNo/report',
                exact: true,
              },
              NotFound: '*',
            },
          },
        },
      },
    },
    // ensure home will always be the first route
  }),
  // eslint-disable-next-line @typescript-eslint/ban-types
  auth: linkingFactory<{}>({
    screens: {
      Auth: {
        path: '',
        screens: {
          Login: 'login',
        },
      },
    },
  }),
};

// eslint-disable-next-line @typescript-eslint/init-declarations
let __globalNavigationRef: ReturnType<typeof useNavigationContainerRef>;

export function getGlobalNavigationRef() {
  return __globalNavigationRef;
}

export const RoutesContainer = memo((props: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);
  const [{ isAuthenticated }] = useBehaviorSubject(authContext.authState$);

  const navigationRef = useNavigationContainerRef();
  __globalNavigationRef = navigationRef;

  const { onStateChange, onReady, ref } = useTrackNavigator('', navigationRef);

  const isMobile = useIsMobileLayout();
  const [isReady, setIsReady] = useState(false);
  const [initialStateHandled, setInitialStateHandled] = useState(false);
  const [initialState, setInitialState] =
    useState<PartialState<NavigationState>>();

  if (Platform.OS === 'ios') {
    // eslint-disable-next-line
    useFlipper(navigationRef);
  } else if (Platform.OS === 'web') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReduxDevToolsExtension(navigationRef);
  }

  const onUrlOpen = useCallback(
    ({ url }: { url: string }) => {
      debug('url opened: %s', url);

      if (!url || url.includes('/wechat/') || isAuthenticated) {
        return;
      }

      const { path, queryParams } = Linking.parse(url);
      const query = qs.stringify(queryParams);
      const originalUrl = path + (query ? `?${query}` : '');
      const state = getStateFromPath(originalUrl, linking.normal.config);
      const route = state?.routes[state.index ?? 0]?.name;
      if (state && route !== 'NotFound' && !initialState) {
        // remember the initial state and will transition to it when
        // the authentication is successfully done.
        debug(
          'saved initial state: %O, for initial url opened: %s',
          state,
          originalUrl,
        );
        setInitialState(state);
      }
    },
    [isAuthenticated, initialState],
  );

  useEffect(() => {
    Linking.addEventListener('url', onUrlOpen);
    return () => {
      Linking.removeEventListener('url', onUrlOpen);
    };
  }, [onUrlOpen]);

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    if (isAuthenticated) {
      // if the user has been authenticated, just let it go
      // the react navigation will handle the linking automatically.
      if (Platform.OS !== 'web') {
        setInitialStateHandled(true);
      }

      setIsReady(true);

      return;
    }

    // otherwise, we have to determine the continuation logic according
    // to the initial url passed to the app.
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          debug('initial url loaded: %s', url);
        }
        url && onUrlOpen({ url });
      })
      .catch(onErrorIgnore)
      .finally(() => {
        setIsReady(true);
      });
  }, [isAuthenticated, navigationRef, onUrlOpen]);

  useEffect(() => {
    if (!isReady || !navigationRef.isReady() || initialStateHandled) return;

    setInitialStateHandled(true);

    debug(
      'handle initial url state: %O, initialStateHandled: %s',
      initialState,
      initialStateHandled,
    );

    if (!isAuthenticated) {
      // force to the login screen.
      const route = navigationRef.getCurrentRoute();
      if (route?.name !== 'Login' && initialState) {
        const state = getStateFromPath('login', linking.auth.config);
        if (state) {
          const action = getActionFromState(
            state as PartialState<NavigationState>,
            linking.auth.config,
          );
          if (action) {
            navigationRef.dispatch(action);
          }
        }
      }
    } else {
      debug('authenticated, initial state: %O', initialState);
      if (!initialState) {
        const state = getStateFromPath('/', linking.normal.config);
        const action = getActionFromState(
          state as PartialState<NavigationState>,
          linking.normal.config,
        );
        if (action) {
          setTimeout(() => {
            navigationRef.dispatch(action);
            setInitialState(undefined);
          }, 300);
        }
      } else {
        const action = getActionFromState(
          initialState as PartialState<NavigationState>,
          linking.normal.config,
        );
        if (action) {
          setTimeout(() => {
            navigationRef.dispatch(action);
            setInitialState(undefined);
          }, 300);
        }
      }
    }
  }, [
    initialState,
    isAuthenticated,
    isReady,
    navigationRef,
    initialStateHandled,
  ]);

  // wait until authentication status is successfully resolved.
  if (isAuthenticated === undefined) return null;

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          ...DefaultTheme.colors,
          primary: Colors.Gray2,
          background: isMobile ? '#f5f6f8' : DefaultTheme.colors.background,
        },
      }}
      ref={ref}
      linking={isAuthenticated ? linking.normal : linking.auth}
      onReady={onReady}
      onStateChange={onStateChange}
      documentTitle={{
        enabled: false,
      }}
      fallback={<AppLoading />}
    >
      {props.children}
    </NavigationContainer>
  );
});
