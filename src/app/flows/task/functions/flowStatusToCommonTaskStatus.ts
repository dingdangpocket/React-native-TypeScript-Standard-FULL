/**
 * @file: flowStatusToCommonTaskStatus.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionFlowStatus } from '@euler/model';
import { CommonTaskStatus } from '@euler/model/enum';

export const flowStatusToCommonTaskStatus = (
  status: VehicleInspectionFlowStatus,
): CommonTaskStatus => {
  if (status === 'pending') {
    return CommonTaskStatus.Pending;
  }
  if (status === 'inprogress') {
    return CommonTaskStatus.InProgress;
  }

  return CommonTaskStatus.Finished;
};
