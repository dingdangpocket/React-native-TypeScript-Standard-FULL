/**
 * @file: VehicleInspectionSite.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionSiteCheckItem } from './VehicleInspectionSiteCheckItem';

export interface VehicleInspectionSite {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  categoryId: number;
  code: string;
  name: string;
  positionCode?: string | null;
  isFacadeSite: boolean;
  pyInitial?: string | null;
  influenceFactor: number;
  nextCheckMileageInterval?: number | null;
  supportsIdevice: boolean;
  ideviceSortOrder: number;
  description?: string | null;
  purpose?: string | null;
  imgUrl?: string | null;
  iconUrl?: string | null;
  iconHash?: string | null;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  checkItems?: VehicleInspectionSiteCheckItem[];
}
