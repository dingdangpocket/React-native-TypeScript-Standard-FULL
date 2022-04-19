/**
 * @file: InspectionOrderType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionOrderType {
  Basic = 'basic',
  Repair = 'repair',
  Full = 'full',
}

export const InspectionOrderTypeValueSet = new Set([
  InspectionOrderType.Basic,
  InspectionOrderType.Repair,
  InspectionOrderType.Full,
]);
