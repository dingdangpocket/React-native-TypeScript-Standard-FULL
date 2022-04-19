/**
 * @file: DeliveryCheckReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel, SiteInspectionType } from '../enum';
import { DeliveryCheckReportItem } from './DeliveryCheckReportItem';

export interface DeliveryCheckPendingIssue {
  title: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  inspectionType: SiteInspectionType;
  siteId: number | null;
  siteName: string | null;
  siteCode: string | null;
  itemName: string | null;
  itemId: number | null;
  customIssueId: number | null;
  maintenanceAdvice: string | null;
}

export interface DeliveryCheckReport {
  id: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  items: DeliveryCheckReportItem[];
  pendingIssues: DeliveryCheckPendingIssue[];
  technicianId: number | null;
  technicianName: string | null;
  groupName: string | null;
  teamName: string | null;
  signatureImgUrl: string | null;
  signedAt: Date | null;
}
