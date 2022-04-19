import { CustomIssue } from './CustomIssue';
import { ObdTroubleCode } from './ObdTroubleCode';
import { SiteInspection } from './SiteInspection';

export type InspectionDetail = {
  inspectedSites: SiteInspection[];
  customIssues?: CustomIssue[];
  obdTroubleCodes?: ObdTroubleCode[];
};
