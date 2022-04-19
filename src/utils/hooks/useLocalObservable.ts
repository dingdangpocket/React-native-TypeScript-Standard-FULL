/**
 * @file: useLocalObservable.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InstanceOrFactory } from '@euler/typings';
import { DependencyList, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useLocalObservable<T>(
  source: InstanceOrFactory<Observable<T>>,
  startWithValue: T | (() => T),
  deps: DependencyList = [],
): T {
  const [latest, setValue] = useState(startWithValue);
  useEffect(() => {
    const observable = typeof source === 'function' ? source() : source;
    const subscription = observable.subscribe({
      next: v => setValue(() => v),
      error: e =>
        setValue(() => {
          throw e;
        }),
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return latest;
}
