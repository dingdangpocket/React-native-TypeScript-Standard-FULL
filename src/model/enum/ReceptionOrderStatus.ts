/**
 * @file: ReceptionOrderStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum ReceptionOrderStatus {
  Pending = 'pending',
  InProgress = 'inprogress',
  Cancelled = 'cancelled',
  Finished = 'finished',
}

export const ReceptionOrderStatusValueSet = new Set([
  ReceptionOrderStatus.Pending,
  ReceptionOrderStatus.InProgress,
  ReceptionOrderStatus.Cancelled,
  ReceptionOrderStatus.Finished,
]);
