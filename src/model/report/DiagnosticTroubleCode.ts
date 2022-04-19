/**
 * @file: DiagnosticTroubleCode.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskTroubleCodeState } from '../enum';

export interface DiagnosticTroubleCode {
  sourceModule: string;
  sourceModuleName: string;
  code: string | null;
  description: string | null;
  status: InspectionTaskTroubleCodeState | null;
  statusText: string | null;
}
