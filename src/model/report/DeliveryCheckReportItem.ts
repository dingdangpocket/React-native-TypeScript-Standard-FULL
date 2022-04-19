/**
 * @file: DeliveryCheckReportItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { MediaInfo } from './MediaInfo';

export interface DeliveryCheckReportItem {
  title: string;
  remark: string | null;
  technicianName: string | null;
  medias: MediaInfo[];
}
