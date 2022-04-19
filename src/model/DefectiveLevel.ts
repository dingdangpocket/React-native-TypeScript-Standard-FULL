/**
 * @file: DefectiveLevel.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type DefectiveLevelToken = 'urgent' | 'warning' | 'defective' | 'fine';

export enum DefectiveLevel {
  Urgent = 4,
  Warning = 3,
  Defective = 2,
  Fine = 1,
}

export const DefectiveLevelTokenMap: {
  [p in DefectiveLevel]: DefectiveLevelToken;
} = {
  [DefectiveLevel.Urgent]: 'urgent',
  [DefectiveLevel.Warning]: 'warning',
  [DefectiveLevel.Defective]: 'defective',
  [DefectiveLevel.Fine]: 'fine',
};

export const DefectiveLevelTextShort: {
  [p in DefectiveLevel]: string;
} = {
  [DefectiveLevel.Urgent]: '紧急',
  [DefectiveLevel.Warning]: '异常',
  [DefectiveLevel.Defective]: '轻微',
  [DefectiveLevel.Fine]: '正常',
};

export const DefectiveLevelText: {
  [p in DefectiveLevel]: string;
} = {
  [DefectiveLevel.Urgent]: '继续处理',
  [DefectiveLevel.Warning]: '建议处理',
  [DefectiveLevel.Defective]: '轻微异常',
  [DefectiveLevel.Fine]: '正常',
};
