/**
 * @file: useTaskInspectionFlows.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useFetchAsyncState } from '@euler/functions';
import { InspectionCategory } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { useEffect } from 'react';

export const useTaskInspectionFlows = (
  category: InspectionCategory,
  taskNo: string,
) => {
  const { taskService } = useServiceFactory();
  const [state, fetch] = useFetchAsyncState(
    async () => {
      return await taskService.getTaskInspectionFlows(category, taskNo);
    },
    { status: 'loading' },
  );
  useEffect(() => {
    fetch().catch(() => null);
  }, [fetch]);
  return [state, fetch] as const;
};
