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
import { DefectiveLevel } from '@euler/model';
import { AttributedText } from '@euler/model/AttributedText';
import {
  AbnormalLevel,
  InspectionTaskEventSubType,
  InspectionTaskEventType,
  SeverityLevel,
} from '@euler/model/enum';
import { DefaultTheme } from 'styled-components/native';
import { registerEventType } from '../../registry';

const register = registerEventType(InspectionTaskEventType.PreInspection);

function itemInspected() {
  register(InspectionTaskEventSubType.PreItemInspected)((item, data, map) => {
    const abnormalLevel = data.a as AbnormalLevel;
    const severityLevel = data.s as SeverityLevel;
    const level = getDefectiveLevel(abnormalLevel, severityLevel);
    const defectiveLabel = getDefectiveLevelTextShort(level);
    let name = data.name;
    let label = data.label;
    if (label !== '已点亮') {
      label = defectiveLabel;
      const pid = data.pevtid ? String(data?.pevtid) : null;
      const pevent = pid ? map.get(pid) : null;
      if (pevent?.data) {
        const obj = JSON.parse(pevent.data);
        name = obj.name;
      }
    }
    const color = (theme: DefaultTheme) =>
      getDefectiveLevelColor(theme, DefectiveLevel.Warning);

    item.label(name);
    const tagline: (string | AttributedText)[] = [
      '状态: ',
      { text: label, color },
    ];
    item.tagline(tagline).medias('m');
  });
}

itemInspected();
