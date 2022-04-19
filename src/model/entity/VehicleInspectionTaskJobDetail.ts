/**
 * @file: VehicleInspectionTaskJobDetail.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, InspectionTaskJobStatus, SeverityLevel } from '../enum';

export interface VehicleInspectionTaskJobDetail {
  id: number;
  taskId: number;
  jobId: number;
  label?: string | null;
  siteId?: number | null;
  siteName?: string | null;
  itemId?: number | null;
  itemName?: string | null;
  customIssueId?: number | null;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  status: InspectionTaskJobStatus;
  createdAt: string | Date;
  startedAt?: string | Date | null;
  finishedAt?: string | Date | null;
  remark?: string | null;
}
