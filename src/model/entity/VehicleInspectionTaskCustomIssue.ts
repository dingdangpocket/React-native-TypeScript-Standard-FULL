/**
 * @file: VehicleInspectionTaskCustomIssue.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  AbnormalLevel,
  SeverityLevel,
  SiteInspectionType,
  VehicleIssueStatus,
} from '../enum';
import { VehicleInspectionTaskCustomIssueMedia } from './VehicleInspectionTaskCustomIssueMedia';

export interface VehicleInspectionTaskCustomIssue {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  inspectionType: SiteInspectionType;
  siteId?: number | null;
  siteName: string;
  itemId?: number | null;
  itemName?: string | null;
  inspectionResult: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  referenceState?: string | null;
  maintenanceAdvice?: string | null;
  label?: string | null;
  description?: string | null;
  technicianId: number;
  technicianName: string;
  status: VehicleIssueStatus;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  siteInfluenceFactor: number;
  itemInfluenceFactor: number;
  medias?: VehicleInspectionTaskCustomIssueMedia[];
}
