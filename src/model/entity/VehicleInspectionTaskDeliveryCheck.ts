/**
 * @file: VehicleInspectionTaskDeliveryCheck.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionTaskDeliveryCheckMedia } from './VehicleInspectionTaskDeliveryCheckMedia';

export interface VehicleInspectionTaskDeliveryCheck {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  title: string;
  constructionJobId?: number | null;
  resultCode: string;
  resultText?: string | null;
  remark?: string | null;
  technicianId: number;
  technicianName: string;
  checkedAt: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  medias?: VehicleInspectionTaskDeliveryCheckMedia[];
}
