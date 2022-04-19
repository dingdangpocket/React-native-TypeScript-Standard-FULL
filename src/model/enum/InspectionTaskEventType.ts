/**
 * @file: InspectionTaskEventType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskEventType {
  System = 0,
  Creation = 100,
  Inspection = 200,
  Quotation = 300,
  Construction = 400,
  Diagnostic = 500,
  Completion = 600,
  PreInspection = 700,
  DeliveryCheck = 800,
}

export const InspectionTaskEventTypeValueSet = new Set([
  InspectionTaskEventType.System,
  InspectionTaskEventType.Creation,
  InspectionTaskEventType.Inspection,
  InspectionTaskEventType.Quotation,
  InspectionTaskEventType.Construction,
  InspectionTaskEventType.Diagnostic,
  InspectionTaskEventType.Completion,
  InspectionTaskEventType.PreInspection,
  InspectionTaskEventType.DeliveryCheck,
]);
