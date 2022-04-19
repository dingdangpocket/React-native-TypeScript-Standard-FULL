/**
 * @file: useTaskResource.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { useCreation, useObservable } from '@euler/utils/hooks';
import { useCallback, useState } from 'react';
import { BehaviorSubject, from, switchMap, tap } from 'rxjs';

export const useTaskResource = <T>(params: {
  resourceId: (taskNo: string) => string;
  fetch: (taskNo: string) => Promise<T>;
  tag: string;
}) => {
  const { resourceId, fetch, tag } = params;
  const { taskNo } = useTaskContext();

  const fetch$ = useCreation(() => new BehaviorSubject(true), []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const resource$ = useCreation(
    () =>
      fetch$.pipe(
        tap(() => {
          console.log(`[${tag}] fetching... `);
        }),
        // delay(3000),
        switchMap(() => from(fetch(taskNo))),
        tap(() => {
          setIsRefreshing(false);
        }),
      ),
    [fetch$, tag, fetch, taskNo],
  );
  const detail = useObservable(resource$, resourceId(taskNo));
  const fetchResource = useCallback(() => {
    setIsRefreshing(true);
    fetch$.next(true);
  }, [fetch$]);
  return [detail, isRefreshing, fetchResource] as const;
};
