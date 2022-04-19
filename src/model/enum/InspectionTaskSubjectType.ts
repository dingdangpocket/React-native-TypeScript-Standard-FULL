/**
 * @file: InspectionTaskSubjectType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskSubjectType {
  ServiceSubject = 1,
  InspectionSubject,
}

export const InspectionTaskSubjectTypeValueSet = new Set([
  InspectionTaskSubjectType.ServiceSubject,
  InspectionTaskSubjectType.InspectionSubject,
]);
