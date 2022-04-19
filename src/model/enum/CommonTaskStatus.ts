/**
 * @file: CommonTaskStatus.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum CommonTaskStatus {
  Pending = 0,
  InProgress = 1,
  Finished = 2,
}

export const CommonTaskStatusValueSet = new Set([
  CommonTaskStatus.Pending,
  CommonTaskStatus.InProgress,
  CommonTaskStatus.Finished,
]);
