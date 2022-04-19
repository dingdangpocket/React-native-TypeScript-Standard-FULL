/**
 * @file: VehicleInspectionSiteMaintenancePeriod.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { MaintenanceType } from '../enum';

export interface VehicleInspectionSiteMaintenancePeriod {
  id: number;
  siteId: number;
  description?: string | null;
  recommendedMaintenanceType?: MaintenanceType | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
