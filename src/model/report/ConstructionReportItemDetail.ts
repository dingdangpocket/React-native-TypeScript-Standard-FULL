/**
 * @file: ConstructionReportItemDetail.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '../enum';

export interface ConstructionReportItemDetail {
  label: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  siteId: number | null;
  siteName: string | null;
  itemId: number | null;
  itemName: string | null;
  customIssueId: number;
  remark: string | null;
}
