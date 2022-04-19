/**
 * @file: navigationOptionsBuilder.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { isMobileLayout } from '@euler/utils';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import { Platform } from 'react-native';

export type StackNavigationOptionsFactory<T> = (props: {
  route: { params: T };
  navigation: StackNavigationProp<any>;
}) => StackNavigationOptions;

export type StackNavigationOptionsOrFactory<T> =
  | StackNavigationOptions
  | StackNavigationOptionsFactory<T>;

export const centerModalOptions = (): StackNavigationOptions => ({
  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  animationEnabled: false,
  headerShown: false,
});

export const transparentModalOptions = (): StackNavigationOptions => ({
  presentation: 'modal',
  cardOverlayEnabled: true,
  animationEnabled: false,
  detachPreviousScreen: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  headerShown: false,
});

export const adaptiveWrapperOptions = <T>(
  options?: StackNavigationOptionsOrFactory<T>,
): StackNavigationOptionsOrFactory<T> => {
  const isMobile = isMobileLayout();
  const baseStackOptions: StackNavigationOptions = isMobile
    ? {
        headerStatusBarHeight: 0,
        headerShown: false,
        presentation: Platform.OS === 'ios' ? 'modal' : 'card',
      }
    : centerModalOptions();

  if (typeof options === 'function') {
    return (props: {
      route: { params: T };
      navigation: StackNavigationProp<any>;
    }) => ({
      ...baseStackOptions,
      ...options(props),
    });
  }

  return {
    ...baseStackOptions,
    ...options,
  };
};
