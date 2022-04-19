/**
 * @file: ReviewStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum ReviewStatus {
  Pending = 1,
  Accepted,
  Rejected,
}

export const ReviewStatusValueSet = new Set([
  ReviewStatus.Pending,
  ReviewStatus.Accepted,
  ReviewStatus.Rejected,
]);
