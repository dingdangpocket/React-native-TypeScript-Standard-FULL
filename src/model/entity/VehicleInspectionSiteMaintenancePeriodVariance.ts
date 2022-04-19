/**
 * @file: VehicleInspectionSiteMaintenancePeriodVariance.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionSiteMaintenancePeriodVariance {
  id: number;
  siteId: number;
  varianceType?: string | null;
  mileageLower?: number | null;
  mileageUpper?: number | null;
  timeLower?: string | null;
  timeUpper?: string | null;
}
