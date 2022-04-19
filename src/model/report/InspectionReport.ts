/**
 * @file: InspectionReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { DiagnosticTroubleCode } from './DiagnosticTroubleCode';
import { InspectionReportItem } from './InspectionReportItem';

export interface InspectionReportStats {
  inspectedSiteCount: number;
  inspectedSiteItemCount: number;
  normalSiteCount: number;
  normalSiteItemCount: number;
  abnormalSiteCount: number;
  abnormalSiteItemCount: number;
  urgentSiteCount: number;
  urgentSiteItemCount: number;
}

export interface InspectionReport {
  id: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  stats: InspectionReportStats;
  items: InspectionReportItem[];
  extraData: { [siteCode: string]: string } | null;
  troubleCodes: DiagnosticTroubleCode[] | null;
  score: number;
  technicianId: number | null;
  technicianName: string | null;
  groupName: string | null;
  teamName: string | null;
  totalSiteCount: number;
  totalItemCount: number;
}

export interface PreInspectionReport extends InspectionReport {
  signatureImgUrl: string | null;
  signedAt: Date | null;
}
