/**
 * @file: VehicleInspectionTaskQuotationIssue.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '../enum';

export interface VehicleInspectionTaskQuotationIssue {
  id: number;
  taskId: number;
  quotationId: number;
  title: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  siteId?: number | null;
  siteName?: string | null;
  itemId?: number | null;
  itemName?: string | null;
  customIssueId?: number | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  label?: string | null;
  maintenanceAdvice?: string | null;
}
