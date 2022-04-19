/**
 * @file: CheckResultDataType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum CheckResultDataType {
  Text = 'text',
  Json = 'json',
  Xml = 'xml',
  Yaml = 'yaml',
  Csv = 'csv',
  Blob = 'blob',
  Custom = 'custom',
}

export const CheckResultDataTypeValueSet = new Set([
  CheckResultDataType.Text,
  CheckResultDataType.Json,
  CheckResultDataType.Xml,
  CheckResultDataType.Yaml,
  CheckResultDataType.Csv,
  CheckResultDataType.Blob,
  CheckResultDataType.Custom,
]);
