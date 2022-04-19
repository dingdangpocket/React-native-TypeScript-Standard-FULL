/**
 * @file: ApprovalStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum ApprovalStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export const ApprovalStatusValueSet = new Set([
  ApprovalStatus.Pending,
  ApprovalStatus.Accepted,
  ApprovalStatus.Rejected,
]);
