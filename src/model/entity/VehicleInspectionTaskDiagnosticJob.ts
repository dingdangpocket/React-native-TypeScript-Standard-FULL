/**
 * @file: VehicleInspectionTaskDiagnosticJob.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskJobStatus } from '../enum';
import { VehicleInspectionTaskDiagnosticJobMedia } from './VehicleInspectionTaskDiagnosticJobMedia';
import { VehicleInspectionTaskDiagnosticJobTroubleCode } from './VehicleInspectionTaskDiagnosticJobTroubleCode';

export interface VehicleInspectionTaskDiagnosticJob {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  subjectId: number;
  name: string;
  description?: string | null;
  status: InspectionTaskJobStatus;
  commitId?: string | null;
  diagnosticResult?: string | null;
  suggestedSolution?: string | null;
  remark?: string | null;
  quotationName?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  startedAt?: string | Date | null;
  finishedAt?: string | Date | null;
  groupId?: number | null;
  groupName?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  technicianId?: number | null;
  technicianName?: string | null;
  troubleCodes?: VehicleInspectionTaskDiagnosticJobTroubleCode[];
  medias?: VehicleInspectionTaskDiagnosticJobMedia[];
}
