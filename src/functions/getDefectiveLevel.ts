/**
 * @file: getIssueLevelCls.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  DefectiveLevel,
  DefectiveLevelText,
  DefectiveLevelTextShort,
  DefectiveLevelTokenMap,
} from '@euler/model';
import { AbnormalLevel, SeverityLevel } from '@euler/model/enum';
import Color from 'color';
import { DefaultTheme } from 'styled-components/native';

export function getDefectiveLevel(
  abnormalLevel: AbnormalLevel,
  severityLevel: SeverityLevel,
): DefectiveLevel {
  if (abnormalLevel === AbnormalLevel.Fine) {
    return DefectiveLevel.Fine;
  }

  if (
    abnormalLevel === AbnormalLevel.Urgent ||
    severityLevel === SeverityLevel.Danger
  ) {
    return DefectiveLevel.Urgent;
  }

  if (
    severityLevel === SeverityLevel.Slight ||
    severityLevel === SeverityLevel.Notice
  ) {
    return DefectiveLevel.Defective;
  }

  return DefectiveLevel.Warning;
}

export function getDefectiveLevelTokenByValue(value: DefectiveLevel) {
  return DefectiveLevelTokenMap[value];
}

export function getDefectiveLevelToken(
  abnormalLevel: AbnormalLevel,
  severityLevel: SeverityLevel,
) {
  const level = getDefectiveLevel(abnormalLevel, severityLevel);
  return DefectiveLevelTokenMap[level];
}

export function getDefectiveLevelColor(
  theme: DefaultTheme,
  level: DefectiveLevel,
): string {
  const token = DefectiveLevelTokenMap[level];
  return (theme.colors.defectiveLevel as any)[token];
}

export function getDefectiveLevelBgColor(
  theme: DefaultTheme,
  level: DefectiveLevel,
): string {
  const color = getDefectiveLevelColor(theme, level);
  return Color(color).alpha(0.1).string();
}

export function getDefectiveLevelText(level: DefectiveLevel) {
  return DefectiveLevelText[level];
}

export function getDefectiveLevelTextShort(level: DefectiveLevel) {
  return DefectiveLevelTextShort[level];
}
