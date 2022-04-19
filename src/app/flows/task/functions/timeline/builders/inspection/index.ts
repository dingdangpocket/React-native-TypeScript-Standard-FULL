/**
 * @file: index.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  getDefectiveLevel,
  getDefectiveLevelColor,
  getDefectiveLevelTextShort,
} from '@euler/functions';
import {
  AbnormalLevel,
  InspectionTaskEventSubType,
  InspectionTaskEventType,
  SeverityLevel,
} from '@euler/model/enum';
import { DefaultTheme } from 'styled-components/native';
import { registerEventType } from '../../registry';

const register = registerEventType(InspectionTaskEventType.Inspection);

function itemInspected() {
  register(InspectionTaskEventSubType.ItemInspected)((item, data) => {
    const abnormalLevel = data.a as AbnormalLevel;
    const severityLevel = data.s as SeverityLevel;
    const level = getDefectiveLevel(abnormalLevel, severityLevel);
    const defectiveLabel = getDefectiveLevelTextShort(level);
    const color = (theme: DefaultTheme) => getDefectiveLevelColor(theme, level);
    return item.label([
      `${data.name}: `,
      { text: data.label || defectiveLabel, color },
    ]);
  });
}

function diagnosticJobCommitted() {
  register(InspectionTaskEventSubType.DiagnosticJobCommitted)((item, data) => {
    item.label(data.jn).medias('m');
  });
}

function customIssueAdded() {
  register(InspectionTaskEventSubType.CustomIssueAdded)((item, data) => {
    const name =
      (data.itemName === '自定义' ? null : data.itemName) ?? data.siteName;
    const abnormalLevel = data.a as AbnormalLevel;
    const severityLevel = data.s as SeverityLevel;
    const level = getDefectiveLevel(abnormalLevel, severityLevel);
    const defectiveLabel = getDefectiveLevelTextShort(level);
    const color = (theme: DefaultTheme) => getDefectiveLevelColor(theme, level);
    return item
      .label([`${name}: `, { text: data.label || defectiveLabel, color }])
      .medias('m');
  });
}

itemInspected();
customIssueAdded();
diagnosticJobCommitted();
