/**
 * @file: usePersistFn.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useRef } from 'react';

type Func<TArguments extends any[] = any[], TReturnType = any> = (
  ...args: TArguments
) => TReturnType;

export function usePersistFn<F extends Func>(fn: F): F {
  const fnRef = useRef<F>(fn);
  fnRef.current = fn;

  const persistFn = useRef<F>();
  if (!persistFn.current) {
    persistFn.current = function (this: any, ...args) {
      return fnRef.current!.apply(this, args);
    } as F;
  }

  return persistFn.current!;
}
