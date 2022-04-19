/**
 * @file: logbox.native.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { LogBox } from 'react-native';

export namespace logbox {
  export function ignorePatterns() {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
      /Unable to deactivate keep awake. However, it probably is deactivated already/,
      /fontFamily style attribute preprocessor/,
      /Overwriting fontFamily style attribute preprocessor/,
      /Tried to set property `_css/,
      /VirtualizedLists should never be nested inside plain ScrollViews/,
      /SplashScreen.show/,
      /externalScrollView/,
      /Can't perform a React state update on an unmounted component./,
      /Setting a timer for a long period of time/,
      /The native module for Flipper seems unavailable. Please verify that `react-native-flipper`/,
      /(componentWillMount|componentWillReceiveProps) has been renamed/,
      /Unhandled promise rejections will not be caught by Sentry/,
      /is not a valid color or brush/,
      /Sending `onAnimatedValueUpdate` with no listeners/,
      'EventEmitter.removeListener',
      // https://github.com/software-mansion/react-native-gesture-handler/pull/1817
      "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);
  }
}
