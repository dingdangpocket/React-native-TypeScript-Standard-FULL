/**
 * @file: useInfiniteList.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCallback, useState } from 'react';

export const useInfiniteList = <T>({
  limit,
  query,
}: {
  query: (offset: number) => Promise<T[]>;
  limit: number;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    data: T[];
    lastOffset?: number;
  }>({
    loading: false,
    error: undefined,
    data: [],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const queryData = useCallback(
    async (
      currentData: T[],
      nextOffset: number,
      mergeData: (current: T[], next: T[]) => T[],
      refresh = false,
    ) => {
      if (refresh) {
        setIsRefreshing(true);
      }
      setState({ loading: true, error: undefined, data: currentData });
      try {
        const next = await query(nextOffset);
        const data = mergeData(currentData, next);
        setState({ loading: false, error: undefined, data });
        setOffset(nextOffset);
        setHasMore(next.length === limit);
      } catch (e) {
        setState({
          loading: false,
          error: e as Error,
          data: currentData,
          lastOffset: nextOffset,
        });
      } finally {
        if (refresh) {
          setIsRefreshing(false);
        }
      }
    },
    [limit, query],
  );

  const fetch = useCallback(async () => {
    if (state.loading) return;
    await queryData(state.data, 0, (_, results) => results, true);
  }, [state.data, state.loading, queryData]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || state.loading) return;
    await queryData(state.data, offset + limit, (x, y) => x.concat(y));
  }, [hasMore, state.loading, state.data, queryData, offset, limit]);

  const fetchSinceLastError = useCallback(async () => {
    if (state.lastOffset == null) return;
    await queryData(state.data, state.lastOffset, (x, y) => x.concat(y));
  }, [state.lastOffset, state.data, queryData]);

  return {
    fetch,
    fetchMore,
    fetchSinceLastError,
    isRefreshing,
    isLoading: state.loading,
    data: state.data,
    error: state.error,
    hasMore,
  };
};
