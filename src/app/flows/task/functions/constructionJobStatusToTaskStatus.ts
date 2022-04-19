/**
 * @file: constructionJobStatusToTaskStatus.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { CommonTaskStatus, InspectionTaskJobStatus } from '@euler/model/enum';

export const constructionJobStatusToTaskStatus = (
  status: InspectionTaskJobStatus,
): CommonTaskStatus => {
  if (status === InspectionTaskJobStatus.Pending) {
    return CommonTaskStatus.Pending;
  }
  if (status === InspectionTaskJobStatus.InProgress) {
    return CommonTaskStatus.InProgress;
  }

  return CommonTaskStatus.Finished;
};
