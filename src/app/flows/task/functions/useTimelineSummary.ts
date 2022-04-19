/**
 * @file: useTimelineSummary.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useTaskResource } from '@euler/app/flows/task/functions/useTaskResource';
import { useServiceFactory } from '@euler/services/factory';
import { useCallback } from 'react';

export const getTimelineSummaryResourceId = (taskNo: string) => {
  return `tasks/${taskNo}/timeline:summary`;
};

export const useTaskTimelineSummary = () => {
  const { taskService } = useServiceFactory();

  const fetch = useCallback(
    (taskNo: string) => {
      return taskService.getTaskTimeline(taskNo, 10);
    },
    [taskService],
  );

  return useTaskResource({
    resourceId: getTimelineSummaryResourceId,
    fetch,
    tag: 'timeline:summary',
  });
};
