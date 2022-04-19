/**
 * @file: SeverityLevel.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum SeverityLevel {
  None = 10,
  Slight = 20,
  Notice = 40,
  Warning = 80,
  Danger = 100,
}

export const SeverityLevelValueSet = new Set([
  SeverityLevel.None,
  SeverityLevel.Slight,
  SeverityLevel.Notice,
  SeverityLevel.Warning,
  SeverityLevel.Danger,
]);
