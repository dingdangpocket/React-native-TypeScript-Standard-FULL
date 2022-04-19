/**
 * @file: InspectionSiteRelType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionSiteRelType {
  Default = 1,
  Structural = 2,
  Spatial = 3,
  Workflow = 4,
}

export const InspectionSiteRelTypeValueSet = new Set([
  InspectionSiteRelType.Default,
  InspectionSiteRelType.Structural,
  InspectionSiteRelType.Spatial,
  InspectionSiteRelType.Workflow,
]);
