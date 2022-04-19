/**
 * @file: VehicleInspectionSiteCategory.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionSite } from './VehicleInspectionSite';

export interface VehicleInspectionSiteCategory {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  name: string;
  tag?: string | null;
  description?: string | null;
  parentCategoryId?: number | null;
  sortOrder: number;
  siteCount: number;
  itemCount: number;
  iconUrl?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  sites?: VehicleInspectionSite[];
}
