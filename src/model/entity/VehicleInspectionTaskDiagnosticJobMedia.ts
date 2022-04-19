/**
 * @file: VehicleInspectionTaskDiagnosticJobMedia.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskDiagnosticJobMediaCategory } from '../enum';

export interface VehicleInspectionTaskDiagnosticJobMedia {
  id: number;
  cid: string;
  orgId: number;
  storeId: number;
  taskId: number;
  jobId: number;
  vin: string;
  type: string;
  url: string;
  coverUrl?: string | null;
  category: InspectionTaskDiagnosticJobMediaCategory;
  tag: number;
  title?: string | null;
  subTitle?: string | null;
  description?: string | null;
  seqNo: number;
  dateRef: string | Date;
  sortOrder: number;
  annotationMetadata?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
