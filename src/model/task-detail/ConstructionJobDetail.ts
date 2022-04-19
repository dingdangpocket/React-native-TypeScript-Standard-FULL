import { AbnormalLevel, InspectionTaskJobStatus, SeverityLevel } from '../enum';

export type ConstructionJobDetail = {
  id: number;
  label?: string;
  siteId?: number;
  siteName?: string;
  itemId?: number;
  itemName?: string;
  customIssueId?: number;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  status: InspectionTaskJobStatus;
  remark?: string;
};
