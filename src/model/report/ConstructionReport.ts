/**
 * @file: ConstructionReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { ConstructionReportItem } from './ConstructionReportItem';

export interface ConstructionReport {
  id: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  items: ConstructionReportItem[];
  technicianId: number | null;
  technicianName: string | null;
  groupName: string | null;
  teamName: string | null;
}
