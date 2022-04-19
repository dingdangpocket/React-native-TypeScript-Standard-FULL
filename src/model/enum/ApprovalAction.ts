/**
 * @file: ApprovalAction.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum ApprovalAction {
  Accept = 'accept',
  Reject = 'reject',
}

export const ApprovalActionValueSet = new Set([
  ApprovalAction.Accept,
  ApprovalAction.Reject,
]);
