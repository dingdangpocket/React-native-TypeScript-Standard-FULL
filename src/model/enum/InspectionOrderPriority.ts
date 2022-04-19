/**
 * @file: InspectionOrderPriority.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionOrderPriority {
  Normal = 1,
  High,
  Urgent,
}

export const InspectionOrderPriorityValueSet = new Set([
  InspectionOrderPriority.Normal,
  InspectionOrderPriority.High,
  InspectionOrderPriority.Urgent,
]);
