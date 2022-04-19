/**
 * @file: QuotationStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum QuotationStatus {
  Pending = 0,
  Started = 1,
  Initiated = 2,
  Submitted = 3,
  Confirmed = 4,
  Finished = 5,
}

export const QuotationStatusValueSet = new Set([
  QuotationStatus.Pending,
  QuotationStatus.Started,
  QuotationStatus.Initiated,
  QuotationStatus.Submitted,
  QuotationStatus.Confirmed,
  QuotationStatus.Finished,
]);
