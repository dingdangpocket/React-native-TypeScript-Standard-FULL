/**
 * @file: useConstructionJobs.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { useTaskResource } from '@euler/app/flows/task/functions/useTaskResource';
import { useServiceFactory } from '@euler/services/factory';
import { useCallback } from 'react';

export const getConstructionJobsResourceId = (taskNo: string) => {
  return `tasks/${taskNo}/constructions/scheduled-jobs`;
};

export const useConstructionJobs = () => {
  const { taskService } = useServiceFactory();

  const fetch = useCallback(
    (taskNo: string) => {
      return taskService.listScheduledConstructionJobs(taskNo);
    },
    [taskService],
  );

  return useTaskResource({
    resourceId: getConstructionJobsResourceId,
    fetch,
    tag: 'construction jobs',
  });
};
