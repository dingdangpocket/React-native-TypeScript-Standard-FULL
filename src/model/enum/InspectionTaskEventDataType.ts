/**
 * @file: InspectionTaskEventDataType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum InspectionTaskEventDataType {
  None = 1,
  Text,
  Json,
  Xml,
  Plist,
  Csv,
  StringList,
  MediaList,
  QueryString,
  Custom,
}

export const InspectionTaskEventDataTypeValueSet = new Set([
  InspectionTaskEventDataType.None,
  InspectionTaskEventDataType.Text,
  InspectionTaskEventDataType.Json,
  InspectionTaskEventDataType.Xml,
  InspectionTaskEventDataType.Plist,
  InspectionTaskEventDataType.Csv,
  InspectionTaskEventDataType.StringList,
  InspectionTaskEventDataType.MediaList,
  InspectionTaskEventDataType.QueryString,
  InspectionTaskEventDataType.Custom,
]);
