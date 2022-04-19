/**
 * @file: QuotationReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { QuotationReportItem } from './QuotationReportItem';

export interface QuotationReport {
  id: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  items: QuotationReportItem[];
}
