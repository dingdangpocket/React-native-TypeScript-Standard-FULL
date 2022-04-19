/**
 * @file: FileExtraInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface ImageFileExtraInfo {
  width: number;
  height: number;
  cover: string;
}

export interface AudioFileExtraInfo {
  duration: number;
}

export interface VideoFileExtraInfo {
  duration: number;
  width: number;
  height: number;
  cover: string;
}

export type MixedFileExtraInfo =
  | ImageFileExtraInfo
  | AudioFileExtraInfo
  | VideoFileExtraInfo;
export type FileExtraInfo<T = MixedFileExtraInfo> = T;
