/**
 * @file: InspectionTemplatePredefinedType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTemplatePredefinedType {
  FullInspection = 'full_inspection',
  AirConditionerInspection = 'air_conditioner_inspection',
  CarWashBeauty = 'car_wash_beauty',
  Other = 'other',
}

export const InspectionTemplatePredefinedTypeValueSet = new Set([
  InspectionTemplatePredefinedType.FullInspection,
  InspectionTemplatePredefinedType.AirConditionerInspection,
  InspectionTemplatePredefinedType.CarWashBeauty,
  InspectionTemplatePredefinedType.Other,
]);
