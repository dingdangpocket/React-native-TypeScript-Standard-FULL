/**
 * @file: Versions.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { TaskDetailProjection } from './TaskDetail';

export type TaskDetailVersionKey = keyof TaskDetailProjection | 'detail';

export type TaskDetailVersionIncrements = Record<TaskDetailVersionKey, number>;
export type TaskDetailVersions = Record<TaskDetailVersionKey, number>;

export const AllDetailVersionKeys: TaskDetailVersionKey[] = [
  'detail',
  'basicInfo',
  'preInspection',
  'inspection',
  'obdInspection',
  'construction',
  'deliveryCheck',
];
