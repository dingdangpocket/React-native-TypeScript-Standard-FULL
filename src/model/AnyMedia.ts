/**
 * @file: AnyMedia.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type AnyMedia = {
  id: number;
  cid: string;
  type: string;
  url: string;
  coverUrl?: string;
  title?: string;
  subTitle?: string;
  dateRef?: string | Date;
  createdAt: string | Date;
  annotationMetadata?: string;
  remark?: string;
  description?: string;
};
