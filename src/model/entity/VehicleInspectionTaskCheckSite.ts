/**
 * @file: VehicleInspectionTaskCheckSite.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  AbnormalLevel,
  InspectionTaskSiteStatus,
  SeverityLevel,
  SiteInspectionType,
} from '../enum';
import { VehicleInspectionTaskCheckSiteItem } from './VehicleInspectionTaskCheckSiteItem';

export interface VehicleInspectionTaskCheckSite {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  siteId: number;
  siteCode: string;
  commitId?: string | null;
  name: string;
  inspectionType: SiteInspectionType;
  status?: InspectionTaskSiteStatus | null;
  abnormalLevel?: AbnormalLevel | null;
  severityLevel?: SeverityLevel | null;
  technicianId: number;
  technicianName: string;
  finishedAt?: string | Date | null;
  remark?: string | null;
  extraData?: string | null;
  inspectedSiteItems?: VehicleInspectionTaskCheckSiteItem[];
}
