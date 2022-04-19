/**
 * @file: InspectionTaskSiteStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskSiteStatus {
  Pending = 'pending',
  InProgress = 'inprogress',
  Cancelled = 'cancelled',
  Finished = 'finished',
}

export const InspectionTaskSiteStatusValueSet = new Set([
  InspectionTaskSiteStatus.Pending,
  InspectionTaskSiteStatus.InProgress,
  InspectionTaskSiteStatus.Cancelled,
  InspectionTaskSiteStatus.Finished,
]);
