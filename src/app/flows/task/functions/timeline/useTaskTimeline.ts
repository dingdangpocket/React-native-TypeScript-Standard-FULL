/**
 * @file: useTaskTimeline.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { EventInfo } from './types';

export const useTaskTimeline = (taskNo: string) => {
  const { taskService } = useServiceFactory();
  const [state, setState] = useState<{
    loading: boolean;
    data?: EventInfo[];
    error?: Error;
  }>({
    loading: false,
  });

  const load = useCallback(
    async (current?: EventInfo[]) => {
      setState({ loading: true, data: current });
      try {
        const events = await taskService.getTaskTimeline(taskNo);
        setState({
          loading: false,
          data: events.map(x => ({
            id: String(x.id),
            type: x.type,
            subType: x.subType,
            timestamp: dayjs(x.timestamp).toDate(),
            data: x.data ?? undefined,
            dataType: x.dataType,
            dataVersion: x.dataVersion ?? 0,
            author: x.author,
          })),
        });
      } catch (e) {
        console.error(e);
        setState({ loading: false, data: current, error: e as Error });
      }
    },
    [taskNo, taskService],
  );

  const refresh = useCallback(() => {
    load(state.data).catch(onErrorIgnore);
  }, [load, state]);

  useEffect(() => {
    load().catch(onErrorIgnore);
  }, [load]);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    refresh,
  };
};
