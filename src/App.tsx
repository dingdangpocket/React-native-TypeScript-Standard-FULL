// organize-imports-ignore
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RoutesContainer, Tracking } from '@euler/app/components';
import { LoadingProvider } from '@euler/app/components/loading/Provider';
import '@euler/app/components/reset';
import { SessionTracker } from '@euler/app/components/SessionTracker';
import { AuthContextProvider } from '@euler/app/flows/auth';
import { Routes } from '@euler/app/Routes';
import { store } from '@euler/app/store';
import { getColorTheme } from '@euler/app/theming';
import { useColorMode } from '@euler/app/theming/color-mode';
import { Fonts, VersionText } from '@euler/components';
import { ErrorFallback } from '@euler/components/error';
import { constrainScreenOrientationIfNeeded } from '@euler/functions';
import {
  sentry,
  TouchEventBoundary,
  withErrorBoundary,
} from '@euler/lib/integration/sentry';
import { useWeixinIntegration } from '@euler/lib/integration/weixin';
import { CloudPush } from '@euler/lib/notification/CloudPush';
import { requestNotificationUserPermissions } from '@euler/lib/notification/Notifications';
import { ServiceFactoryProvider } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { Platform } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Provider as SlotFillProvider, Slot } from 'react-slot-fill';
import { ThemeProvider } from 'styled-components/native';
import { AutomaticKeyboardMonitor } from '@euler/lib/keyboard';
import { WiredSnackbar } from '@euler/app/components/snackbar/Snackbar';

export const App = () => {
  useWeixinIntegration();

  useEffect(() => {
    constrainScreenOrientationIfNeeded().catch(error => {
      sentry.captureException(error);
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    requestNotificationUserPermissions().catch(onErrorIgnore);

    CloudPush.getInitialNotification()
      .then(initialNotification => {
        if (initialNotification) {
          console.log(
            '[cloudpush] initial notification: ',
            initialNotification,
          );
        }
      })
      .catch(onErrorIgnore);

    const listener1 = CloudPush.onNotificationOpenedApp(notification => {
      console.log(
        `[cloudpush][${Platform.OS}] notification opened app: `,
        notification,
      );
    });

    const listener2 = CloudPush.onMessage(notification => {
      console.log(
        `[cloudpush][${Platform.OS}] received message: `,
        notification,
      );
    });

    return () => {
      listener1.remove();
      listener2.remove();
    };
  }, []);

  const colorMode = useColorMode();
  if (!colorMode) return null;

  return (
    // Note(eric): for `react-native-gesture-handler@2.3.0+`:
    // If you use props such as shouldCancelWhenOutside, simultaneousHandlers,
    // waitFor etc. with gesture handlers, the handlers need to be mounted under
    // a single GestureHandlerRootView. So it's important to keep the
    // GestureHandlerRootView as close to the actual root view as possible.
    // Note that GestureHandlerRootView acts like a normal View. So if you want
    // it to fill the screen, you will need to pass { flex: 1 } like you'll need
    // to do with a normal View. By default, it'll take the size of the content
    // nested inside, see the following links for more information:
    // - https://docs.swmansion.com/react-native-gesture-handler/docs/#js
    // - https://blog.expo.dev/expo-sdk-44-4c4b8306584a

    <GestureHandlerRootView style={{ flex: 1 }}>
      <AutomaticKeyboardMonitor />
      <RootSiblingParent>
        <ThemeProvider theme={getColorTheme(colorMode)}>
          <Suspense fallback={null}>
            <Tracking />
          </Suspense>
          <ServiceFactoryProvider>
            <AuthContextProvider>
              <Provider store={store}>
                <Fonts />
                <TouchEventBoundary>
                  <Suspense fallback={null}>
                    <SafeAreaProvider>
                      <SlotFillProvider>
                        <ActionSheetProvider>
                          <LoadingProvider>
                            <RoutesContainer>
                              <Routes />
                              <VersionText />
                              <StatusBar style="dark" />
                              <SessionTracker />
                              <WiredSnackbar />
                            </RoutesContainer>
                          </LoadingProvider>
                        </ActionSheetProvider>
                        <Slot name="portal" />
                      </SlotFillProvider>
                    </SafeAreaProvider>
                  </Suspense>
                </TouchEventBoundary>
              </Provider>
            </AuthContextProvider>
          </ServiceFactoryProvider>
        </ThemeProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

export default __DEV__
  ? App
  : withErrorBoundary(App, { fallback: ErrorFallback });
