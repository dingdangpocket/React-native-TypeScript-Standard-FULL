/**
 * @file: VehicleIssue.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  AbnormalLevel,
  SeverityLevel,
  SiteInspectionType,
  VehicleIssueCloseType,
  VehicleIssueStatus,
} from '../enum';

export interface VehicleIssue {
  id: number;
  orgId: number;
  storeId: number;
  orderNo: string;
  vin: string;
  inspectionType: SiteInspectionType;
  inspectedSiteItemId?: number | null;
  title: string;
  siteId?: number | null;
  itemId?: number | null;
  siteName: string;
  siteCode?: string | null;
  itemName?: string | null;
  customIssueId?: number | null;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  maintenanceAdvice?: string | null;
  status: VehicleIssueStatus;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  resolvedAt?: string | Date | null;
  closedAs?: VehicleIssueCloseType | null;
  closedAt?: string | Date | null;
  closedRemark?: string | null;
  createdBy: number;
  createdByName: string;
  resolvedBy?: number | null;
  closedBy?: number | null;
  resolvedByName?: string | null;
  closedByName?: string | null;
}
