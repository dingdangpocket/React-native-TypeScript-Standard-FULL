/**
 * @file: VehicleInspectionSiteRel.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionSiteRelType } from '../enum';

export interface VehicleInspectionSiteRel {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  templateId?: number | null;
  type: InspectionSiteRelType;
  siteId: number;
  relatedSiteId: number;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
