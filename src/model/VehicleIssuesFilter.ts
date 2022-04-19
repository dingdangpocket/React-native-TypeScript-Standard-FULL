/**
 * @file: VehicleIssuesFilter.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import {
  ResourceAccessScope,
  VehicleIssueCloseType,
  VehicleIssueStatus,
} from './enum';

export type VehicleIssuesFilter = {
  scope?: ResourceAccessScope;
  status?: VehicleIssueStatus[];
  closedAs?: VehicleIssueCloseType[];
};
