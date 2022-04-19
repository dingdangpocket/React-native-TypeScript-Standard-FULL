/**
 * @file: logbox.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { LogBox } from 'react-native';

export namespace logbox {
  export function ignorePatterns() {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
      /Tried to set property `_css/,
      /VirtualizedLists should never be nested inside plain ScrollViews/,
      /SplashScreen.show/,
      /externalScrollView/,
      /(componentWillMount|componentWillReceiveProps) has been renamed/,
      'EventEmitter.removeListener',
      // https://github.com/software-mansion/react-native-gesture-handler/pull/1817
      "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);
  }
}
