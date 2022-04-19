/**
 * @file: VehicleInspectedSiteInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import {
  VehicleInspectionTaskCheckSite,
  VehicleInspectionTaskCustomIssue,
} from './entity';

export type VehicleInspectedSiteInfo = VehicleInspectionTaskCheckSite & {
  customIssues?: VehicleInspectionTaskCustomIssue[];
};
