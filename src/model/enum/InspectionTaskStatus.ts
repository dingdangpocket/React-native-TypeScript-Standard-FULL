/**
 * @file: InspectionTaskStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskStatus {
  Pending = 'pending',
  InProgress = 'inprogress',
  Finished = 'finished',
  Cancelled = 'cancelled',
}

export const InspectionTaskStatusValueSet = new Set([
  InspectionTaskStatus.Pending,
  InspectionTaskStatus.InProgress,
  InspectionTaskStatus.Finished,
  InspectionTaskStatus.Cancelled,
]);
