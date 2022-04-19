import { CommonTaskStatus } from '../enum';
import { VehicleInspectionFlow } from '../VehicleInspectionFlow';
import { CustomIssue } from './CustomIssue';
import { SiteInspection } from './SiteInspection';

export type Inspection = {
  status: CommonTaskStatus;
  sites: SiteInspection[];
  customIssues?: CustomIssue[];
  finishedAt?: string | Date;
  finishedBy?: string;
  flows: VehicleInspectionFlow[];
  version: number;
};
