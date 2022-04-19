/**
 * @file: VehicleInspectedSiteItemInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import {
  VehicleInspectionTaskCheckSiteItem,
  VehicleInspectionTaskCustomIssue,
} from './entity';

export type VehicleInspectedSiteItemInfo =
  VehicleInspectionTaskCheckSiteItem & {
    customIssues?: VehicleInspectionTaskCustomIssue[];
  };
