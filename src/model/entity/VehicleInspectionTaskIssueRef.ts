/**
 * @file: VehicleInspectionTaskIssueRef.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel, VehicleIssueStatus } from '../enum';

export interface VehicleInspectionTaskIssueRef {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  sourceIssueId: number;
  title: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  status: VehicleIssueStatus;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
