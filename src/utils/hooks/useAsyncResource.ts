/**
 * @file: useAsyncResource.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { onErrorIgnore } from '@euler/utils/onErrorIgnore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type State<T> =
  | {
      status: 'pending';
    }
  | {
      status: 'error';
      error?: any;
    }
  | {
      status: 'loaded';
      value: T;
    };
export class AsyncResource<T> {
  refreshed = false;

  private state: State<T> = { status: 'pending' };

  constructor(private readonly factory: () => Promise<T>) {}

  read(initialValue?: T) {
    if (this.state.status === 'loaded') {
      return this.state.value;
    }

    if (this.state.status === 'error') {
      throw this.state.error;
    }

    if (initialValue !== undefined) {
      return initialValue;
    }

    const promise = this.factory();

    promise.then(
      value => {
        this.state = {
          status: 'loaded',
          value,
        };
      },
      error => {
        this.state = {
          status: 'error',
          error,
        };
      },
    );

    this.refreshed = true;

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw promise;
  }
}

const cache = new Map<any, any>();

export const useAsyncResource = <T>(
  factory: () => Promise<T>,
  key: string,
  initialValue?: T,
) => {
  const resource = useRef<AsyncResource<T>>();
  useMemo(() => {
    if (cache.has(key)) {
      resource.current = cache.get(key);
    } else {
      resource.current = new AsyncResource(factory);
      cache.set(key, resource.current);
    }
  }, [factory, key]);
  const result = resource.current!.read(initialValue);
  const [value, setValue] = useState(result);
  const refreshed = useRef(false);
  useEffect(() => {
    if (resource.current?.refreshed) {
      resource.current.refreshed = false;
    } else if (!resource.current?.refreshed && !refreshed.current) {
      refreshed.current = true;
      factory().then(setValue).catch(onErrorIgnore);
    }
  }, [key, factory]);
  return value;
};

export const useRefreshableAsyncResource = <T>(
  factory: () => Promise<T>,
  key: string,
  initialValue?: T,
) => {
  const resource = useRef<AsyncResource<T>>();
  useMemo(() => {
    if (resource.current) return;
    if (cache.has(key)) {
      resource.current = cache.get(key);
    } else {
      resource.current = new AsyncResource(factory);
      cache.set(key, resource.current);
    }
  }, [factory, key]);
  const result = resource.current!.read(initialValue);
  const [value, setValue] = useState(result);
  const [error, setError] = useState<Error>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshed = useRef(false);

  const refresh = useCallback(
    (silent?: boolean) => {
      if (!silent) setIsRefreshing(true);
      factory()
        .then(setValue)
        .catch(e => {
          setError(e as Error);
        })
        .finally(() => !silent && setIsRefreshing(false));
    },
    [factory],
  );

  useEffect(() => {
    if (resource.current?.refreshed) {
      resource.current.refreshed = false;
    } else if (!resource.current?.refreshed && !refreshed.current) {
      refreshed.current = true;
      refresh(true);
    }
  }, [key, factory, refresh]);

  return { value, isRefreshing, refresh, error };
};
