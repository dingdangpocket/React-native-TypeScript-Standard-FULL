/**
 * @file: OptionValueType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum OptionValueType {
  Celsius = 'celsius',
  Fahrenheit = 'fahrenheit',
  Kilometer = 'km',
  TenThousandsKm = 'ten_thousands_km',
  Year = 'year',
  Millimeter = 'mm',
  Centimeter = 'cm',
  Percentage = 'percentage',
  Number = 'number',
  String = 'string',
  Text = 'text',
  Xml = 'xml',
  Json = 'json',
  Csv = 'csv',
  Yaml = 'yaml',
  Blob = 'blob',
  Custom = 'custom',
}

export const OptionValueTypeValueSet = new Set([
  OptionValueType.Celsius,
  OptionValueType.Fahrenheit,
  OptionValueType.Kilometer,
  OptionValueType.TenThousandsKm,
  OptionValueType.Year,
  OptionValueType.Millimeter,
  OptionValueType.Centimeter,
  OptionValueType.Percentage,
  OptionValueType.Number,
  OptionValueType.String,
  OptionValueType.Text,
  OptionValueType.Xml,
  OptionValueType.Json,
  OptionValueType.Csv,
  OptionValueType.Yaml,
  OptionValueType.Blob,
  OptionValueType.Custom,
]);
