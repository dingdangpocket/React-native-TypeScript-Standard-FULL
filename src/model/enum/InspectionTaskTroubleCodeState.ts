/**
 * @file: InspectionTaskTroubleCodeState.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskTroubleCodeState {
  Unknown = 0,
  Determinate = 10,
  Incidental = 20,
  Other = 90,
}

export const InspectionTaskTroubleCodeStateValueSet = new Set([
  InspectionTaskTroubleCodeState.Unknown,
  InspectionTaskTroubleCodeState.Determinate,
  InspectionTaskTroubleCodeState.Incidental,
  InspectionTaskTroubleCodeState.Other,
]);
