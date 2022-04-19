/**
 * @file: InspectionResults.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionTaskCustomIssue } from './entity';
import { VehicleInspectedSiteInfo } from './VehicleInspectedSiteInfo';

export type InspectionResults = {
  inspectedSites: VehicleInspectedSiteInfo[];
  customIssues?: VehicleInspectionTaskCustomIssue[];
};
