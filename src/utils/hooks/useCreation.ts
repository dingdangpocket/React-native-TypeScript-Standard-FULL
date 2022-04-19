/**
 * @file: useCreation.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DependencyList, useDebugValue, useEffect, useRef } from 'react';

/**
 * Like ahook/useCreation , but added cleanup callback
 *
 * @see https://ahooks.js.org/hooks/use-creation
 */
export function useCreation<T>(
  factory: () => T,
  deps: DependencyList,
  cleanup?: (creation: T) => void,
): T {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
    cleanup,
  });

  // cleanup before component unmount
  useEffect(
    () => () => {
      current.initialized && current.cleanup?.(current.obj!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.initialized && current.cleanup?.(current.obj!);

    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
    current.cleanup = cleanup;
  }

  useDebugValue(current.obj);

  return current.obj!;
}

function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
  if (oldDeps === deps) return true;

  /**
   * The length of react hook deps is always required to be consistent
   * so we can skip the length checking
   */
  return oldDeps.every((i, idx) => Object.is(i, deps[idx]));
}
