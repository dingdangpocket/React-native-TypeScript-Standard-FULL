/**
 * @file: InspectionTaskDiagnosticJobMediaCategory.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskDiagnosticJobMediaCategory {
  DiagnosticResult = 1,
  Procedure,
}

export const InspectionTaskDiagnosticJobMediaCategoryValueSet = new Set([
  InspectionTaskDiagnosticJobMediaCategory.DiagnosticResult,
  InspectionTaskDiagnosticJobMediaCategory.Procedure,
]);
