/**
 * @file: VehicleIssueCloseType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum VehicleIssueCloseType {
  Fixed = 1,
  WontFixByCustomer = 2,
  WontFix = 3,
  Silence = 4,
  Inreproducible = 5,
}

export const VehicleIssueCloseTypeValueSet = new Set([
  VehicleIssueCloseType.Fixed,
  VehicleIssueCloseType.WontFixByCustomer,
  VehicleIssueCloseType.WontFix,
  VehicleIssueCloseType.Silence,
  VehicleIssueCloseType.Inreproducible,
]);
