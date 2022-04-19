/**
 * @file: navigatorTracking.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { integrations } from '@euler/lib/integration';
import { sentry } from '@euler/lib/integration/sentry';
import { sensitizeParams } from '@euler/utils';
import { NavigationContainerRef } from '@react-navigation/core';
import { InitialState, NavigationState } from '@react-navigation/routers';
import { RefObject, useCallback, useRef } from 'react';

function getCurrentRouteName(group: string, state: NavigationState): string {
  let current: InitialState | undefined = state;
  let prefix = group;

  while (current?.routes[current.index ?? 0].state != null) {
    const parent: any = current.routes[current.index ?? 0];
    prefix = prefix + parent.name + '/';
    current = parent.state;
  }

  const route = current?.routes[current?.index ?? 0];
  if (route == null) {
    return prefix + 'init';
  }
  return prefix + route?.name;
}

// https://reactnavigation.org/docs/screen-tracking/#example
export const useTrackNavigator = (
  prefix: string,
  providedNavContainerRef?: RefObject<NavigationContainerRef<any>>,
) => {
  const privateNavContainerRef = useRef<NavigationContainerRef<any>>(null);
  const navContainerRef = providedNavContainerRef ?? privateNavContainerRef;
  const currentRouteNameRef = useRef<string>(prefix);
  const ready = useRef(false);

  const onScreenChange = useCallback(() => {
    const navContainer = navContainerRef.current;

    if (!navContainer) {
      return;
    }

    if (!ready.current) {
      sentry.registerRoutingInstrumentation(navContainer);
      ready.current = true;
    }

    const previousRouteName = currentRouteNameRef.current;
    const currentRoute = navContainer.getCurrentRoute();
    const routeName = getCurrentRouteName(prefix, navContainer.getState());
    if (!currentRoute || routeName === previousRouteName) {
      return;
    }

    integrations.notifyScreenChange(
      currentRouteNameRef.current ?? 'Launch',
      routeName,
      sensitizeParams(currentRoute.params),
    );
  }, [navContainerRef, prefix]);

  const onReady = useCallback(() => {
    onScreenChange();
  }, [onScreenChange]);

  const onStateChange = useCallback(() => {
    onScreenChange();
  }, [onScreenChange]);

  return {
    ref: navContainerRef,
    onReady,
    onStateChange,
  };
};
