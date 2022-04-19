/**
 * @file: SiteInspectionType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum SiteInspectionType {
  Default = 1,
  Dashboard = 2,
  Facade = 3,
  AirConditioner = 4,
}

export const SiteInspectionTypeValueSet = new Set([
  SiteInspectionType.Default,
  SiteInspectionType.Dashboard,
  SiteInspectionType.Facade,
  SiteInspectionType.AirConditioner,
]);
