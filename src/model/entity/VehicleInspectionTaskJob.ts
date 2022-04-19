/**
 * @file: VehicleInspectionTaskJob.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskJobStatus } from '../enum';
import { VehicleInspectionTaskJobDetail } from './VehicleInspectionTaskJobDetail';
import { VehicleInspectionTaskJobMedia } from './VehicleInspectionTaskJobMedia';

export interface VehicleInspectionTaskJob {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  name: string;
  label?: string | null;
  status: InspectionTaskJobStatus;
  isCustom: boolean;
  commitId?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  startedAt?: string | Date | null;
  finishedAt?: string | Date | null;
  remark?: string | null;
  groupId?: number | null;
  groupName?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  technicianId?: number | null;
  technicianName?: string | null;
  details?: VehicleInspectionTaskJobDetail[];
  medias?: VehicleInspectionTaskJobMedia[];
}
