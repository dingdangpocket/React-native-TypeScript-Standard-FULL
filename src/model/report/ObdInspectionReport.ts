/**
 * @file: OdbInspectionReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { DiagnosticTroubleCode } from './DiagnosticTroubleCode';

export interface ObdInspectionReport {
  id: string;
  troubleCodes: DiagnosticTroubleCode[] | null;
  createdAt: Date;
  inspectedAt: Date | null;
  technicianId: number | null;
  technicianName: string | null;
  groupName: string | null;
  teamName: string | null;
}
