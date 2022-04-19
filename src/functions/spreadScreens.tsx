/**
 * @file: spreadScreens.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { WrappedNavigatorScreen } from '@euler/functions';
import { ComponentProps } from 'react';

export type ScreenToParams<
  Screens extends { [k: string]: WrappedNavigatorScreen<any> },
> = {
  [P in keyof Screens]: ComponentProps<Screens[P]['component']>;
};

export function spreadScreens(
  Screen: any,
  screens: {
    [k: string]: WrappedNavigatorScreen<any>;
  },
  initialScreen?: string,
  initialParams?: any | ((name: string) => any),
) {
  return Object.entries(screens).map(([name, component]) => (
    <Screen
      key={name}
      name={name as any}
      component={component}
      options={component.options}
      initialParams={
        typeof initialParams === 'function'
          ? initialParams(name)
          : name === initialScreen
          ? initialParams
          : undefined
      }
      {...component.extraProps}
    />
  ));
}
