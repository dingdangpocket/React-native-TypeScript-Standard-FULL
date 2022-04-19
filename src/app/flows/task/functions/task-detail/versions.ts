/**
 * @file: versions.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  AllDetailVersionKeys,
  TaskDetail,
  TaskDetailVersions,
} from '@euler/model/task-detail';

export const getDetailVersions = (detail: TaskDetail): TaskDetailVersions => {
  return {
    detail: detail.version,
    basicInfo: detail.basicInfo.version,
    preInspection: detail.preInspection.version,
    inspection: detail.inspection.version,
    obdInspection: detail.obdInspection.version,
    construction: detail.construction.version,
    deliveryCheck: detail.deliveryCheck.version,
  };
};

export const detailVersionsMatch = (
  a: TaskDetailVersions,
  b: TaskDetailVersions,
) => {
  for (const key of AllDetailVersionKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
};
