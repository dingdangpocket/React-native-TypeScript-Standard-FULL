/**
 * @file: MaintenanceType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum MaintenanceType {
  None = 'none',
  Basic = 'basic',
  Watch = 'watch',
  Replace = 'replace',
}

export const MaintenanceTypeValueSet = new Set([
  MaintenanceType.None,
  MaintenanceType.Basic,
  MaintenanceType.Watch,
  MaintenanceType.Replace,
]);
