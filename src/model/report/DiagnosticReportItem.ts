/**
 * @file: DiagnosticReportItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { DiagnosticTroubleCode } from './DiagnosticTroubleCode';
import { MediaInfo } from './MediaInfo';

export interface DiagnosticReportItem {
  title: string;
  quotationName: string | null;
  description: string | null;
  diagnosticResult: string | null;
  suggestedSolution: string | null;
  remark: string | null;
  teamName: string | null;
  medias: MediaInfo[];
  troubleCodes: DiagnosticTroubleCode[];
}
