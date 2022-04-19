/**
 * @file: InspectionTaskJobStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskJobStatus {
  Pending = 1,
  InProgress,
  Finished,
}

export const InspectionTaskJobStatusValueSet = new Set([
  InspectionTaskJobStatus.Pending,
  InspectionTaskJobStatus.InProgress,
  InspectionTaskJobStatus.Finished,
]);
