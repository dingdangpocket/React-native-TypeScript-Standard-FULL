/**
 * @file: VehicleInspectionSiteCheckItemMedia.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { ContentType } from '../enum';

export interface VehicleInspectionSiteCheckItemMedia {
  id: number;
  cid: string;
  itemId: number;
  type?: ContentType | null;
  url?: string | null;
  description?: string | null;
  createdAt?: string | Date | null;
}
