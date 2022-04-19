/**
 * @file: QuotationReportItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '../enum';
import { QuotationReportItemDetail } from './QuotationReportItemDetail';
import { QuotationReportItemIssue } from './QuotationReportItemIssue';

export interface QuotationReportItem {
  name: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  manHourCost: number;
  description: string | null;
  technicianId: number;
  technicianName: string | null;
  timestamp: Date;
  details: QuotationReportItemDetail[];
  issues: QuotationReportItemIssue[];
}
