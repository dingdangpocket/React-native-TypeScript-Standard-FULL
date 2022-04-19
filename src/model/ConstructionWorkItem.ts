/**
 * @file: PendingConstructionItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from './enum';

export interface ConstructionWorkItem {
  title: string;
  siteId?: number | null;
  siteName: string;
  itemId?: number | null;
  itemName?: string | null;
  customIssueId?: number | null;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  label: string;
  maintenanceAdvice: string;
  isLegacyIssue: boolean;
}
