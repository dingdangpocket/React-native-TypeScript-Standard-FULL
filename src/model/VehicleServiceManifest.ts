/**
 * @file: VehicleServiceManifest.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '@euler/model/enum';

export interface VehicleServiceManifestItemInfo {
  itemId: number;
  itemName: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  maintained: boolean;
}

export interface VehicleServiceManifestSiteRecord {
  orderNo: string;
  taskNo: string;
  reportNo: string;
  mileage: number;
  date: string | Date;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  items: VehicleServiceManifestItemInfo[];
}

export interface VehicleServiceManifestEntry {
  siteId: number;
  siteName: string;
  records: VehicleServiceManifestSiteRecord[];
}

export interface VehicleServiceManifest {
  vin: string;
  entries: VehicleServiceManifestEntry[];
}
