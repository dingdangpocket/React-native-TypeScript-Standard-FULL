/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/**
 * @file: InspectionResultFormatter.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '@euler/model/enum';
import {
  InspectionReportItem,
  InspectionReportItemType,
} from '@euler/model/report';
import { sprintf } from 'sprintf-js';

const UseFriendlyLabel = true;

export interface VehicleInspectionReportDetailFormattable {
  labelFormat: string | null | undefined;
  label: string | null | undefined;
  lower: number | null | undefined;
  upper: number | null | undefined;
  lowerInclusive: boolean | null | undefined;
  upperInclusive: boolean | null | undefined;
  valueUnit: string | null | undefined;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class InspectionResultFormatter {
  static formatLabel(item: InspectionReportItem) {
    return item.abnormalLevel === AbnormalLevel.Fine
      ? this.formatNormalLabel(item)
      : this.formatAbnormalLabel(item);
  }

  static getInspectedItemDisplayName(item: InspectionReportItem) {
    const name =
      item.type === InspectionReportItemType.CustomIssue
        ? item.siteItemName && item.siteItemName !== '自定义'
          ? item.siteItemName
          : item.siteName
        : item.siteItemName || item.siteName;
    return name || '';
  }

  static formatNormalLabel(item: InspectionReportItem) {
    const {
      normalResultLabelFormat: labelFormat,
      normalResultLabel: label,
      normalResultLower: lower,
      normalResultLowerInclusive: lowerInclusive,
      normalResultUpper: upper,
      normalResultUpperInclusive: upperInclusive,
      normalValueUnit: valueUnit,
    } = item;

    return this.formatValueLabel(
      this.getInspectedItemDisplayName(item),
      labelFormat,
      label,
      lower,
      upper,
      lowerInclusive,
      upperInclusive,
      valueUnit,
    );
  }

  static formatAbnormalLabel(item: InspectionReportItem) {
    const {
      abnormalResultLabelFormat: labelFormat,
      abnormalResultLabel: label,
      abnormalResultLower: lower,
      abnormalResultLowerInclusive: lowerInclusive,
      abnormalResultUpper: upper,
      abnormalResultUpperInclusive: upperInclusive,
      normalValueUnit: valueUnit,
    } = item;
    return this.formatValueLabel(
      this.getInspectedItemDisplayName(item),
      labelFormat,
      label || item.resultDataStringValue,
      lower,
      upper,
      lowerInclusive,
      upperInclusive,
      valueUnit,
    );
  }

  static formatValueLabel(
    name: string,
    labelFormat: string | null | undefined,
    label: string | null | undefined,
    lower: number | null | undefined,
    upper: number | null | undefined,
    lowerInclusive: boolean | null | undefined,
    upperInclusive: boolean | null | undefined,
    valueUnit: string | null | undefined,
  ) {
    if (!labelFormat) {
      return label || '';
    }

    const values: any[] = [];
    if (typeof lower === 'number' && typeof upper === 'number') {
      values.push(lower, upper);
      const lowerLabel = this.formatValue(lower, valueUnit);
      const upperLabel = this.formatValue(upper, valueUnit);
      if (UseFriendlyLabel) {
        const lowerInclusiveLabel = lowerInclusive ? '' : '(不含)';
        const upperInclusiveLabel = upperInclusive ? '' : '(不含)';
        return [
          `${lowerLabel}${lowerInclusiveLabel}`,
          `${upperLabel}${upperInclusiveLabel}`,
        ].join('~');
      }

      return [
        lowerLabel,
        lowerInclusive ? '≤' : '<',
        name || '检测值',
        upperInclusive ? '≤' : '<',
        upperLabel,
      ].join('');
    } else if (typeof lower === 'number') {
      values.push(lower);
      const op = lowerInclusive ? '≥' : '>';
      return `${op} ${this.formatValue(lower, valueUnit)}`;
    } else if (typeof upper === 'number') {
      values.push(upper);
      const op = upper ? '≤' : '<';
      return `${op} ${this.formatValue(upper, valueUnit)}`;
    } else {
      return sprintf(labelFormat, ...values);
    }
  }

  static formatValue(value: number, unit: string | null | undefined) {
    return `${value}${unit || ''}`;
  }
}
