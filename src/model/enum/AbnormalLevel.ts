/**
 * @file: AbnormalLevel.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum AbnormalLevel {
  Fine = 10,
  Defective = 50,
  Urgent = 100,
}

export const AbnormalLevelValueSet = new Set([
  AbnormalLevel.Fine,
  AbnormalLevel.Defective,
  AbnormalLevel.Urgent,
]);
