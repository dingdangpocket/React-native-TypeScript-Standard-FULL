/**
 * @file: VehicleInspectionTaskCheckSiteItemMedia.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionTaskCheckSiteItemMedia {
  id?: number;
  cid?: string;
  orgId?: number;
  storeId?: number;
  taskId?: number;
  taskSiteId?: number;
  taskItemId?: number;
  vin?: string;
  type: string;
  url: string;
  coverUrl?: string | null;
  title?: string | null;
  subTitle?: string | null;
  dateRef?: string | Date | null;
  createdAt?: string | Date;
  remark?: string | null;
  annotationMetadata?: string | null;
}
