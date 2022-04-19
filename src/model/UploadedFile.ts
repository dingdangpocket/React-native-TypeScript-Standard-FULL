/**
 * @file: UploadedFile.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { FileExtraInfo, MixedFileExtraInfo } from '@euler/model/common';

export interface UploadedFile<TExtraInfo = MixedFileExtraInfo> {
  name: string;
  url: string;
  filename: string;
  filePath?: string;
  sizeInBytes: number;
  size: string;
  type: string;
  realm: string;
  extra?: FileExtraInfo<TExtraInfo>;
  fields: Record<string, string>;
}
