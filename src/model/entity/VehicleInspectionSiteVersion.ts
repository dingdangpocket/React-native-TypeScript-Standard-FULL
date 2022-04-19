/**
 * @file: VehicleInspectionSiteVersion.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionSiteVersion {
  id: number;
  orgId: number;
  storeId: number;
  version: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
