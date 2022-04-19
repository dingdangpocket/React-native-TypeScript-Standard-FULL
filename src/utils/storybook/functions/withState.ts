/**
 * @file: withState.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { useArgs } from '@storybook/client-api';
import { DecoratorFn } from '@storybook/react';
import { useEffect } from 'react';

export function withState<T>(
  factory: (update: (newValue: Partial<T>) => void) => Partial<T>,
): DecoratorFn {
  return function (storyFn) {
    const [, updateArgs] = useArgs();
    useEffect(() => {
      updateArgs(factory(updateArgs));
    }, [updateArgs]);
    return storyFn();
  };
}
