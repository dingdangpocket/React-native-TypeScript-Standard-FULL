/**
 * @file: ConstructionReportItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { ConstructionReportItemDetail } from './ConstructionReportItemDetail';
import { MediaInfo } from './MediaInfo';

export interface ConstructionReportItemMediaInfo extends MediaInfo {
  procedure: string | null;
  procedureOrder: number | null;
  isLegacy?: boolean;
}

export interface ConstructionReportItem {
  name: string;
  remark: string | null;
  technicianId: number | null;
  technicianName: string | null;
  teamName: string | null;
  groupName: string | null;
  medias: ConstructionReportItemMediaInfo[];
  details: ConstructionReportItemDetail[];
}
