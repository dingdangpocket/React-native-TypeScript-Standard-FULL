/**
 * @file: MediaInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum MediaSourceType {
  Dashboard = 'dashboard',
  Facade = 'facade',
  Inspection = 'inspection',
  Diagnostic = 'diagnostic',
  Construction = 'construction',
  DeliveryCheck = 'deliverycheck',
}

export interface MediaInfo {
  id: string;
  type: string;
  sourceType: MediaSourceType;
  category: string | null;
  title: string | null;
  subTitle: string | null;
  url: string;
  coverUrl: string | null;
  dateRef: Date | null;
  tag: string | null;
  remark: string | null;
  annotationMetadata: string | null;
  sortOrder: number | null;
  seqNo?: number | null;
}
