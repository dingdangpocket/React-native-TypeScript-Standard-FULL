/**
 * @file: AuditStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum AuditStatus {
  Pending = 1,
  Accepted,
  Rejected,
}

export const AuditStatusValueSet = new Set([
  AuditStatus.Pending,
  AuditStatus.Accepted,
  AuditStatus.Rejected,
]);
