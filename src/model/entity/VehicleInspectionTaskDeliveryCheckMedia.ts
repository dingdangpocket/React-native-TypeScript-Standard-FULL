/**
 * @file: VehicleInspectionTaskDeliveryCheckMedia.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionTaskDeliveryCheckMedia {
  id: number;
  cid: string;
  orgId: number;
  storeId: number;
  taskId: number;
  checkId: number;
  vin: string;
  type: string;
  url: string;
  coverUrl?: string | null;
  title?: string | null;
  subTitle?: string | null;
  dateRef?: string | Date | null;
  annotationMetadata?: string | null;
  remark?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
