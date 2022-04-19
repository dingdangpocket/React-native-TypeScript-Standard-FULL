/**
 * @file: VersionedResponse.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { TaskDetailVersions } from './Versions';

export type VersionedResponse<T> = {
  versions: TaskDetailVersions;
  response: T;
};
