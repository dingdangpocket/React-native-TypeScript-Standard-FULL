/**
 * @file: VehicleIssueStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum VehicleIssueStatus {
  New = 'new',
  Resolved = 'resolved',
  Closed = 'closed',
}

export const VehicleIssueStatusValueSet = new Set([
  VehicleIssueStatus.New,
  VehicleIssueStatus.Resolved,
  VehicleIssueStatus.Closed,
]);
