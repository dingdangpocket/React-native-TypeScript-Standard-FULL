/**
 * @file: Gender.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export const GenderValueSet = new Set([
  Gender.Unknown,
  Gender.Male,
  Gender.Female,
]);
