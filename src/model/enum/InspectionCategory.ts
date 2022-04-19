/**
 * @file: InspectionCategory.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionCategory {
  Pre = 1,
  Normal = 2,
}

export const InspectionCategoryValueSet = new Set([
  InspectionCategory.Pre,
  InspectionCategory.Normal,
]);
