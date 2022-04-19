/**
 * @file: inspectionResultDataTypeHelpers.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { OptionValueType } from '@euler/model/enum';
import {
  SiteInspectionItemComplexResult,
  SiteInspectionItemNumericResult,
  SiteInspectionItemResult,
  SiteInspectionItemStringResult,
} from '@euler/model/task-detail';

export type ResultDataType =
  | OptionValueType.Celsius
  | OptionValueType.Fahrenheit
  | OptionValueType.Kilometer
  | OptionValueType.TenThousandsKm
  | OptionValueType.Year
  | OptionValueType.Millimeter
  | OptionValueType.Centimeter
  | OptionValueType.Percentage
  | OptionValueType.Number
  | OptionValueType.String
  | OptionValueType.Text
  | OptionValueType.Xml
  | OptionValueType.Json
  | OptionValueType.Csv
  | OptionValueType.Yaml
  | OptionValueType.Blob
  | OptionValueType.Custom;

export type SimpleNumericResultDataType =
  | OptionValueType.Celsius
  | OptionValueType.Fahrenheit
  | OptionValueType.Kilometer
  | OptionValueType.TenThousandsKm
  | OptionValueType.Year
  | OptionValueType.Millimeter
  | OptionValueType.Centimeter
  | OptionValueType.Percentage
  | OptionValueType.Number;

const SimpleNumericResultDataTypeSet = new Set<OptionValueType>([
  OptionValueType.Celsius,
  OptionValueType.Fahrenheit,
  OptionValueType.Kilometer,
  OptionValueType.TenThousandsKm,
  OptionValueType.Year,
  OptionValueType.Millimeter,
  OptionValueType.Centimeter,
  OptionValueType.Percentage,
  OptionValueType.Number,
]);

export type SimpleStringResultDataType = OptionValueType.String;

const SimpleStringResultDataTypeSet = new Set<OptionValueType>([
  OptionValueType.String,
]);

export type ComplexResultDataType =
  | OptionValueType.Text
  | OptionValueType.Xml
  | OptionValueType.Json
  | OptionValueType.Csv
  | OptionValueType.Yaml
  | OptionValueType.Blob
  | OptionValueType.Custom;

const ComplexResultDataTypeSet = new Set<OptionValueType>([
  OptionValueType.Text,
  OptionValueType.Xml,
  OptionValueType.Json,
  OptionValueType.Csv,
  OptionValueType.Yaml,
  OptionValueType.Blob,
  OptionValueType.Custom,
]);

export function isComplexInspectionResultDataType<T extends ResultDataType>(
  type: T | null | undefined,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): type is ComplexResultDataType {
  return type != null && ComplexResultDataTypeSet.has(type);
}

export function isSimpleNumericInspectionResultDataType<
  T extends ResultDataType,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
>(type: T | null | undefined): type is SimpleNumericResultDataType {
  return type != null && SimpleNumericResultDataTypeSet.has(type);
}

export function isSimpleStringInspectionResultDataType<
  T extends ResultDataType,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
>(type: T | null | undefined): type is SimpleStringResultDataType {
  return type != null && SimpleStringResultDataTypeSet.has(type);
}

export function isValidResultDataType(type: OptionValueType): boolean {
  return (
    isComplexInspectionResultDataType(type) ||
    isSimpleNumericInspectionResultDataType(type) ||
    isSimpleStringInspectionResultDataType(type)
  );
}

export function isSimpleNumericItemResult<T extends SiteInspectionItemResult>(
  result: T,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): result is SiteInspectionItemNumericResult {
  return (
    result.valueType === OptionValueType.Number ||
    result.valueType === OptionValueType.Celsius ||
    result.valueType === OptionValueType.Fahrenheit ||
    result.valueType === OptionValueType.Kilometer ||
    result.valueType === OptionValueType.TenThousandsKm ||
    result.valueType === OptionValueType.Year ||
    result.valueType === OptionValueType.Millimeter ||
    result.valueType === OptionValueType.Centimeter ||
    result.valueType === OptionValueType.Percentage
  );
}

export function isSimpleStringItemResult<T extends SiteInspectionItemResult>(
  result: T,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): result is SiteInspectionItemStringResult {
  return result.valueType === OptionValueType.String;
}

export function isComplexItemResult<T extends SiteInspectionItemResult>(
  result: T,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): result is SiteInspectionItemComplexResult {
  return (
    result.valueType === OptionValueType.Text ||
    result.valueType === OptionValueType.Xml ||
    result.valueType === OptionValueType.Json ||
    result.valueType === OptionValueType.Csv ||
    result.valueType === OptionValueType.Yaml ||
    result.valueType === OptionValueType.Blob ||
    result.valueType === OptionValueType.Custom
  );
}
