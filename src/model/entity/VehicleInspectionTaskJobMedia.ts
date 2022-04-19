/**
 * @file: VehicleInspectionTaskJobMedia.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskJobMediaCategory } from '../enum';

export interface VehicleInspectionTaskJobMedia {
  id: number;
  cid: string;
  orgId: number;
  storeId: number;
  taskId: number;
  jobId: number;
  detailId?: number | null;
  vin: string;
  type: string;
  url: string;
  coverUrl?: string | null;
  title?: string | null;
  subTitle?: string | null;
  dateRef?: string | Date | null;
  sortOrder: number;
  description?: string | null;
  procedure?: string | null;
  procedureOrder?: number | null;
  category: InspectionTaskJobMediaCategory;
  tag: number;
  seqNo: number;
  annotationMetadata?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
