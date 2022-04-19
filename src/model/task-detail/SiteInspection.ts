import { SiteCustomIssueCommitPayload } from '.';
import { AbnormalLevel, SeverityLevel, SiteInspectionType } from '../enum';
import { SiteCustomIssue } from './CustomIssue';
import {
  SiteInspectionItem,
  SiteInspectionItemCommitPayload,
  SiteInspectionItemStaged,
} from './SiteInspectionItem';

export type SiteInspection = {
  id: number;
  siteId: number;
  commitId: string;
  name: string;
  inspectionType: SiteInspectionType;
  technicianId: number;
  technicianName: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  items: SiteInspectionItem[];
  customIssues: SiteCustomIssue[];
  extraData?: string;
  remark?: string;
};

export type SiteInspectionCommitPayload = Omit<
  SiteInspection,
  'id' | 'commitId' | 'items' | 'customIssues' | 'name'
> & {
  id?: number;
  commitId?: string;
  items: SiteInspectionItemCommitPayload[];
  customIssues: SiteCustomIssueCommitPayload[];
  // legacy, will be removed in the future.
  dashboardImgUrl?: string;
};

export type SiteInspectionStaged = Omit<
  SiteInspectionCommitPayload,
  'customIssues' | 'items'
> & {
  items: SiteInspectionItemStaged[];
};
