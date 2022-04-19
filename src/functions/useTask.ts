/**
 * @file: useTask.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { sleep } from '@euler/utils';
import { useCallback, useState } from 'react';

export type Task<TArgs extends any[], TResult> = {
  loading: boolean;
  error?: Error;
  request(...args: TArgs): Promise<TResult>;
};

export function useTask<TArgs extends any[], TResult>(
  proc: (...args: TArgs) => TResult | Promise<TResult>,
  options?: {
    simulate?: boolean;
    delay?: number;
    result?: TResult;
    alertError?: boolean;
  },
): Task<TArgs, TResult> {
  const [state, setState] = useState<{ loading: boolean; error?: Error }>({
    loading: false,
  });

  const request = useCallback(
    async (...args: TArgs) => {
      try {
        setState({ loading: true });
        if (options?.simulate) {
          await sleep(options.delay ?? 3000);
          setState({ loading: false });
          return options.result!;
        } else {
          const result = await proc(...args);
          setState({ loading: false });
          return result;
        }
      } catch (e) {
        if (options?.alertError) {
          alert((e as Error).message);
        }
        setState({ loading: false, error: e as Error });
        throw e;
      }
    },
    [proc, options],
  );
  return { ...state, request };
}
