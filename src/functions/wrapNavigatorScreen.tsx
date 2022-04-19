import { useRoute } from '@react-navigation/core';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import { FC, memo, ReactNode, Suspense } from 'react';

export type WrappedNavigatorScreen<
  T extends Record<string, any>,
  U = StackNavigationOptions,
> = FC<T> & {
  component: FC<T>;
  options: U;
  extraProps?: any;
};

export function wrapNavigatorScreen<
  T extends object,
  U = StackNavigationOptions,
>(
  Component: FC<T>,
  options?:
    | U
    | ((props: {
        route: { params: T };
        navigation: StackNavigationProp<any>;
      }) => U),
  extraProps?: any,
  fallback?: NonNullable<ReactNode> | null,
): WrappedNavigatorScreen<T> {
  const NavigatorScreenWrapper = memo(function () {
    const params = useRoute().params as T;
    return (
      <Suspense fallback={fallback ?? null}>
        <Component {...params} />
      </Suspense>
    );
  }) as any;

  NavigatorScreenWrapper.component = Component;
  NavigatorScreenWrapper.options = options as U;
  NavigatorScreenWrapper.extraProps = extraProps;

  return NavigatorScreenWrapper;
}
