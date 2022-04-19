/**
 * @file: useFetchAsyncState.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { usePersistFn } from '@euler/utils/hooks';
import { Dispatch, SetStateAction, useState } from 'react';

export type AsyncState<T> =
  | {
      status: 'loading';
    }
  | {
      status: 'error';
      error: Error;
    }
  | { status: 'success'; result: T | null };

export type ValueElseUndefined<T, U> = U extends
  | string
  | number
  | boolean
  | symbol
  | object
  | ((...args: any[]) => any)
  ? T
  : T | undefined;

type FetchFunction<T, U extends any[] = any> = (...args: U) => Promise<T>;

export const useFetchAsyncState = <
  TFetch extends FetchFunction<any> | undefined,
  T = TFetch extends FetchFunction<infer U> ? Awaited<PromiseLike<U>> : unknown,
  TInitialState extends AsyncState<T> | undefined = AsyncState<T>,
>(
  fetchFn: TFetch,
  initialState: AsyncState<T> | undefined,
): [
  TInitialState extends AsyncState<T>
    ? AsyncState<T>
    : AsyncState<T> | undefined,
  TFetch extends (...args: any[]) => Promise<any>
    ? FetchFunction<T, Parameters<TFetch>>
    : never,
  Dispatch<SetStateAction<AsyncState<T>>>,
] => {
  const [state, setState] = useState(initialState);
  const fetch = usePersistFn(async (...args: any[]) => {
    try {
      if (!fetchFn) return;
      setState({ status: 'loading' } as any);
      const result = await (fetchFn as any)(...args);
      setState({ status: 'success', result } as any);
      return result;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let error: Error;
      if (e instanceof Error) {
        error = e;
      } else {
        error = new Error((e as any).message ?? (e as any).errMsg ?? String(e));
      }
      setState({ status: 'error', error } as any);
    }
  });
  return [state as any, fetch as any, setState as any];
};
