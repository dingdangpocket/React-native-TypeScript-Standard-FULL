/**
 * @file: InspectionTaskJobMediaCategory.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskJobMediaCategory {
  Comparison = 1,
  Procedure = 2,
  BeforeConstruction = 3,
  AfterConstruction = 4,
  ProductConfirm = 5,
  Custom = 99,
}

export const InspectionTaskJobMediaCategoryValueSet = new Set([
  InspectionTaskJobMediaCategory.Comparison,
  InspectionTaskJobMediaCategory.Procedure,
  InspectionTaskJobMediaCategory.BeforeConstruction,
  InspectionTaskJobMediaCategory.AfterConstruction,
  InspectionTaskJobMediaCategory.ProductConfirm,
  InspectionTaskJobMediaCategory.Custom,
]);
