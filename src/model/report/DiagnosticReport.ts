/**
 * @file: DiagnosticReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { DiagnosticReportItem } from './DiagnosticReportItem';

export interface DiagnosticReport {
  id: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  items: DiagnosticReportItem[];
  technicianId: number | null;
  technicianName: string | null;
  groupName: string | null;
  teamName: string | null;
}
