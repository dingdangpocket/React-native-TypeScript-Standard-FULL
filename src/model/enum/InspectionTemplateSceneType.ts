/**
 * @file: InspectionTemplateSceneType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTemplateSceneType {
  Basic = 'basic',
  Full = 'full',
  Facade = 'facade',
  Dashboard = 'dashboard',
  Custom = 'custom',
}

export const InspectionTemplateSceneTypeValueSet = new Set([
  InspectionTemplateSceneType.Basic,
  InspectionTemplateSceneType.Full,
  InspectionTemplateSceneType.Facade,
  InspectionTemplateSceneType.Dashboard,
  InspectionTemplateSceneType.Custom,
]);
