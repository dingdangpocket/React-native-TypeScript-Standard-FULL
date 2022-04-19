/**
 * @file: FileInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { MixedFileExtraInfo } from './FileExtraInfo';
import { FileUploadResult } from './FileUploadResult';

export interface FileInfo<TExtra = MixedFileExtraInfo>
  extends FileUploadResult<TExtra> {}
